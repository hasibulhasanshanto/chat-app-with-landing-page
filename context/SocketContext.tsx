'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatUIStore } from '@/store/useChatUIStore';
import { getSocket } from '@/lib/socket';
import { Message, GroupConversation, Conversation, MessagesResponse } from '@/types/chat';

export interface TypingUser {
  userId: string;
  name?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  typingUsers: Record<string, TypingUser[]>;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onConversationUpdated: (callback: (conversation: GroupConversation) => void) => () => void;
  emitSendMessage: (conversationId: string, text: string) => void;
  emitTyping: (conversationId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

function extractConversationId(payload: any): string {
  if (!payload) return '';
  if (typeof payload.conversation === 'string') return payload.conversation;
  if (typeof payload.conversation === 'object' && payload.conversation?._id) return payload.conversation._id;
  if (typeof payload.conversationId === 'string') return payload.conversationId;
  if (typeof payload.conversationId === 'object' && payload.conversationId?._id) return payload.conversationId._id;
  if (typeof payload.roomId === 'string') return payload.roomId;
  return '';
}

function extractSenderId(payload: any): string {
  if (!payload) return '';
  if (typeof payload.sender === 'string') return payload.sender;
  if (typeof payload.sender === 'object' && payload.sender?._id) return payload.sender._id;
  if (typeof payload.senderId === 'string') return payload.senderId;
  if (typeof payload.senderId === 'object' && payload.senderId?._id) return payload.senderId._id;
  if (typeof payload.userId === 'string') return payload.userId;
  return '';
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingUser[]>>({});

  const typingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Initialize cross-tab BroadcastChannel & LocalStorage listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('chatflow_realtime_channel');
        broadcastChannelRef.current = bc;

        bc.onmessage = (event) => {
          const data = event.data;
          if (data && data.type === 'typing') {
            handleTypingEvent(data);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    // Storage event listener for cross-window sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'chatflow_typing_sync' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          handleTypingEvent(data);
        } catch (err) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (bc) {
        bc.close();
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleTypingEvent = useCallback((data: any) => {
    const convId = extractConversationId(data);
    const userId = extractSenderId(data);
    const myId = useAuthStore.getState().user?._id;
    if (!convId || !userId || (myId && userId === myId)) return;

    const userName = data.name || data.userName || data.user?.name || 'Someone';
    const isTyping = data.isTyping !== false;
    const key = `${convId}-${userId}`;

    if (typingTimeoutsRef.current[key]) {
      clearTimeout(typingTimeoutsRef.current[key]);
      delete typingTimeoutsRef.current[key];
    }

    if (isTyping) {
      setTypingUsers((prev) => {
        const existing = prev[convId] || [];
        if (existing.some((u) => u.userId === userId)) return prev;
        return {
          ...prev,
          [convId]: [...existing, { userId, name: userName }],
        };
      });

      // Auto-clear after 3.5 seconds
      typingTimeoutsRef.current[key] = setTimeout(() => {
        setTypingUsers((prev) => {
          const existing = prev[convId] || [];
          return {
            ...prev,
            [convId]: existing.filter((u) => u.userId !== userId),
          };
        });
      }, 3500);
    } else {
      setTypingUsers((prev) => {
        const existing = prev[convId] || [];
        return {
          ...prev,
          [convId]: existing.filter((u) => u.userId !== userId),
        };
      });
    }
  }, []);

  useEffect(() => {
    if (!token && !isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const sock = getSocket(token);
    if (!sock) return;

    setSocket(sock);

    const handleConnect = () => {
      console.log('⚡ Socket connected:', sock.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: any) => {
      console.warn('⚠️ Socket connection error:', error?.message || error);
      setIsConnected(false);
    };

    // Global real-time message receiver
    const handleGlobalNewMessage = (incomingMessage: any) => {
      const convId = extractConversationId(incomingMessage);
      const senderId = extractSenderId(incomingMessage);
      if (!convId) return;

      // Automatically clear typing indicator for this user when message arrives
      setTypingUsers((prev) => {
        const list = prev[convId] || [];
        const nextList = list.filter((u) => u.userId !== senderId);
        if (nextList.length === list.length) return prev;
        return { ...prev, [convId]: nextList };
      });

      const activeId = useChatUIStore.getState().activeConversationId;
      const myId = useAuthStore.getState().user?._id;
      const isFromMe = Boolean(myId && senderId === myId);
      const isCurrentlyOpen = activeId === convId;

      // 1. Immediately inject message into cache
      queryClient.setQueryData<MessagesResponse>(
        queryKeys.conversations.messages(convId),
        (old) => {
          if (!old) {
            return { messages: [incomingMessage], hasMore: false };
          }
          const exists = old.messages.some((m) => m._id === incomingMessage._id);
          if (exists) return old;

          // Replace optimistic placeholder
          const optIdx = old.messages.findIndex(
            (m) => m.isOptimistic && m.text === incomingMessage.text
          );
          if (optIdx !== -1) {
            const next = [...old.messages];
            next[optIdx] = incomingMessage;
            return { ...old, messages: next };
          }

          return { ...old, messages: [...old.messages, incomingMessage] };
        }
      );

      // 2. Immediately update Inbox preview and bump to top
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => {
          const index = old.findIndex((c) => c._id === convId);
          if (index === -1) {
            queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list() });
            return old;
          }

          const existingConv = old[index];
          const currentUnread = existingConv.unreadCount || 0;
          const newUnreadCount =
            !isFromMe && !isCurrentlyOpen ? currentUnread + 1 : isCurrentlyOpen ? 0 : currentUnread;

          const updated: Conversation = {
            ...existingConv,
            lastMessage: {
              text: incomingMessage.text,
              sender: senderId,
              createdAt: incomingMessage.createdAt,
            },
            updatedAt: incomingMessage.createdAt,
            unreadCount: newUnreadCount,
          };

          const nextList = [...old];
          nextList.splice(index, 1);
          return [updated, ...nextList];
        }
      );
    };

    // Global real-time group updater
    const handleGlobalConversationUpdated = (updatedGroup: any) => {
      queryClient.setQueryData<Conversation[]>(
        queryKeys.conversations.list(),
        (old = []) => {
          const index = old.findIndex((c) => c._id === updatedGroup._id);
          if (index === -1) return [updatedGroup, ...old];
          const next = [...old];
          next[index] = { ...next[index], ...updatedGroup };
          return next;
        }
      );
    };

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);
    sock.on('connect_error', handleConnectError);
    sock.on('message:new', handleGlobalNewMessage);
    sock.on('conversation:updated', handleGlobalConversationUpdated);

    // Support typing events from server
    sock.on('typing', handleTypingEvent);
    sock.on('user:typing', handleTypingEvent);
    sock.on('typing:start', (data) => handleTypingEvent({ ...data, isTyping: true }));
    sock.on('typing:stop', (data) => handleTypingEvent({ ...data, isTyping: false }));

    if (sock.connected) {
      setIsConnected(true);
    }

    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      sock.off('connect_error', handleConnectError);
      sock.off('message:new', handleGlobalNewMessage);
      sock.off('conversation:updated', handleGlobalConversationUpdated);
      sock.off('typing', handleTypingEvent);
      sock.off('user:typing', handleTypingEvent);
      sock.off('typing:start');
      sock.off('typing:stop');
    };
  }, [token, isAuthenticated, queryClient, handleTypingEvent]);

  const onNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      const sock = socket || getSocket(token);
      if (!sock) return () => {};

      sock.on('message:new', callback);
      return () => {
        sock.off('message:new', callback);
      };
    },
    [socket, token]
  );

  const onConversationUpdated = useCallback(
    (callback: (conversation: GroupConversation) => void) => {
      const sock = socket || getSocket(token);
      if (!sock) return () => {};

      sock.on('conversation:updated', callback);
      return () => {
        sock.off('conversation:updated', callback);
      };
    },
    [socket, token]
  );

  const emitSendMessage = useCallback(
    (conversationId: string, text: string) => {
      const sock = socket || getSocket(token);
      if (sock && sock.connected) {
        sock.emit('message:send', { conversationId, text });
      }
    },
    [socket, token]
  );

  const emitTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      const myUser = useAuthStore.getState().user;
      const payload = {
        type: 'typing',
        conversationId,
        userId: myUser?._id,
        name: myUser?.name || 'Someone',
        isTyping,
        time: Date.now(),
      };

      // 1. Socket.io
      const sock = socket || getSocket(token);
      if (sock && sock.connected) {
        sock.emit('typing', payload);
        sock.emit(isTyping ? 'typing:start' : 'typing:stop', payload);
        sock.emit('user:typing', payload);
      }

      // 2. BroadcastChannel
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage(payload);
        } catch (e) {
          // ignore
        }
      }

      // 3. LocalStorage event for cross-browser/tab sync
      try {
        localStorage.setItem(
          'chatflow_typing_sync',
          JSON.stringify({ ...payload, _rnd: Math.random() })
        );
      } catch (e) {
        // ignore
      }
    },
    [socket, token]
  );

  const value: SocketContextType = {
    socket,
    isConnected,
    typingUsers,
    onNewMessage,
    onConversationUpdated,
    emitSendMessage,
    emitTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
