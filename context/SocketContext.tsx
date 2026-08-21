'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatUIStore } from '@/store/useChatUIStore';
import { getSocket } from '@/lib/socket';
import { Message, GroupConversation, Conversation } from '@/types/chat';

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingUser[]>>({});

  const typingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Helper to handle typing event strictly attached to conversationId
  const handleTypingEvent = useCallback((data: any) => {
    const convId = extractConversationId(data);
    const userId = extractSenderId(data);
    const myId = useAuthStore.getState().user?._id;

    if (!convId || !userId || (myId && userId === myId)) return;

    const userName = data.name || data.userName || data.user?.name || 'Someone';
    const isTyping = data.isTyping !== false;
    const key = `${convId}:${userId}`;

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

  // 1. Real-time Server-Sent Events (SSE) stream listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/typing/stream');
      eventSource.onmessage = (event) => {
        if (!event.data || event.data.startsWith(':')) return;
        try {
          const data = JSON.parse(event.data);
          handleTypingEvent(data);
        } catch (e) {
          // ignore
        }
      };
    } catch (e) {
      console.warn('SSE not initialized:', e);
    }

    // Polling fallback strictly querying active conversation ID
    const pollInterval = setInterval(async () => {
      try {
        const activeId = useChatUIStore.getState().activeConversationId;
        const myId = useAuthStore.getState().user?._id;
        if (!activeId) return;

        const res = await fetch(`/api/typing?conversationId=${encodeURIComponent(activeId)}`);
        if (res.ok) {
          const { typingByConversation } = await res.json();
          const targetTypers = (typingByConversation?.[activeId] || []).filter(
            (t: any) => t.userId !== myId
          );
          setTypingUsers((prev) => ({
            ...prev,
            [activeId]: targetTypers,
          }));
        }
      } catch (e) {
        // ignore
      }
    }, 2000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
    };
  }, [handleTypingEvent]);

  // 2. BroadcastChannel & LocalStorage listeners for cross-tab sync
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
  }, [handleTypingEvent]);

  // 3. Socket.io Connection & Event Handling
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

    // Global message handler
    const handleGlobalNewMessage = (incomingMessage: any) => {
      const convId = extractConversationId(incomingMessage);
      const senderId = extractSenderId(incomingMessage);
      if (!convId) return;

      // Clear typing indicator for this conversation when message arrives
      setTypingUsers((prev) => {
        const list = prev[convId] || [];
        const nextList = list.filter((u) => u.userId !== senderId);
        if (nextList.length === list.length) return prev;
        return { ...prev, [convId]: nextList };
      });

      // Clear API typing state too
      fetch('/api/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId, userId: senderId, isTyping: false }),
      }).catch(() => { });

      const activeId = useChatUIStore.getState().activeConversationId;
      const myId = useAuthStore.getState().user?._id;
      const isFromMe = Boolean(myId && senderId === myId);
      const isCurrentlyOpen = activeId === convId;

      // 1. Update Messages Cache (supports both InfiniteData & flat formats safely)
      queryClient.setQueryData<any>(
        queryKeys.conversations.messages(convId),
        (old: any) => {
          if (!old) {
            return {
              pages: [{ messages: [incomingMessage], hasMore: false }],
              pageParams: [undefined],
            };
          }

          // Handle InfiniteData structure
          if (old.pages && Array.isArray(old.pages)) {
            const allMessages = old.pages.flatMap((p: any) => p?.messages || []);
            if (allMessages.some((m: any) => m._id === incomingMessage._id)) {
              return old;
            }

            let replaced = false;
            const nextPages = old.pages.map((page: any) => {
              if (!page?.messages) return page;
              const optIdx = page.messages.findIndex(
                (m: any) => m.isOptimistic && m.text === incomingMessage.text
              );
              if (optIdx !== -1) {
                replaced = true;
                const nextMsgs = [...page.messages];
                nextMsgs[optIdx] = incomingMessage;
                return { ...page, messages: nextMsgs };
              }
              return page;
            });

            if (!replaced && nextPages.length > 0) {
              nextPages[0] = {
                ...nextPages[0],
                messages: [incomingMessage, ...(nextPages[0]?.messages || [])],
              };
            }

            return { ...old, pages: nextPages };
          }

          // Handle Flat structure
          if (old.messages && Array.isArray(old.messages)) {
            if (old.messages.some((m: any) => m._id === incomingMessage._id)) return old;
            const optIdx = old.messages.findIndex(
              (m: any) => m.isOptimistic && m.text === incomingMessage.text
            );
            if (optIdx !== -1) {
              const next = [...old.messages];
              next[optIdx] = incomingMessage;
              return { ...old, messages: next };
            }
            return { ...old, messages: [...old.messages, incomingMessage] };
          }

          return old;
        }
      );

      // 2. Update Conversation List (lastMessage & unread count)
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
          // If message is from someone else and this chat is not currently open, increment unread badge!
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
    sock.on('typing', handleTypingEvent);
    sock.on('user:typing', handleTypingEvent);

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
    };
  }, [token, isAuthenticated, queryClient, handleTypingEvent]);

  const onNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      const sock = socket || getSocket(token);
      if (!sock) return () => { };

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
      if (!sock) return () => { };

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

      // 1. Next.js Real-time Typing Hub
      fetch('/api/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => { });

      // 2. BroadcastChannel
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage(payload);
        } catch (e) {
          // ignore
        }
      }

      // 3. LocalStorage Event
      try {
        localStorage.setItem(
          'chatflow_typing_sync',
          JSON.stringify({ ...payload, _rnd: Math.random() })
        );
      } catch (e) {
        // ignore
      }

      // 4. Socket.io
      const sock = socket || getSocket(token);
      if (sock && sock.connected) {
        sock.emit('typing', payload);
        sock.emit(isTyping ? 'typing:start' : 'typing:stop', payload);
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
