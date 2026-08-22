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
  if (typeof payload === 'string') return payload;
  if (typeof payload.conversation === 'string') return payload.conversation;
  if (typeof payload.conversation === 'object' && payload.conversation?._id) return payload.conversation._id;
  if (typeof payload.conversation === 'object' && payload.conversation?.id) return payload.conversation.id;
  if (typeof payload.conversationId === 'string') return payload.conversationId;
  if (typeof payload.conversationId === 'object' && payload.conversationId?._id) return payload.conversationId._id;
  if (typeof payload.conversationId === 'object' && payload.conversationId?.id) return payload.conversationId.id;
  if (typeof payload.conversation_id === 'string') return payload.conversation_id;
  if (typeof payload.roomId === 'string') return payload.roomId;
  return '';
}

function extractSenderId(payload: any): string {
  if (!payload) return '';
  if (typeof payload.sender === 'string') return payload.sender;
  if (typeof payload.sender === 'object' && payload.sender?._id) return payload.sender._id;
  if (typeof payload.sender === 'object' && payload.sender?.id) return payload.sender.id;
  if (typeof payload.senderId === 'string') return payload.senderId;
  if (typeof payload.senderId === 'object' && payload.senderId?._id) return payload.senderId._id;
  if (typeof payload.senderId === 'object' && payload.senderId?.id) return payload.senderId.id;
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
    }, 1000);

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
          } else if (data && (data.type === 'new_message' || data.type === 'message') && data.message) {
            handleGlobalNewMessage(data.message);
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
      } else if (e.key === 'chatflow_message_sync' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data && data.message) {
            handleGlobalNewMessage(data.message);
          }
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

  // Global message handler ref for use across listeners
  const handleGlobalNewMessage = useCallback((incomingMessage: any) => {
    if (!incomingMessage) return;

    // Support unwrapping if wrapped in message or data property
    let msg = incomingMessage;
    if (msg.message && typeof msg.message === 'object') msg = msg.message;
    else if (msg.data && typeof msg.data === 'object' && (msg.data.text || msg.data.conversation)) msg = msg.data;

    const convId = extractConversationId(msg);
    const senderId = extractSenderId(msg);
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
            pages: [{ messages: [msg], hasMore: false }],
            pageParams: [undefined],
          };
        }

        // Handle InfiniteData structure
        if (old.pages && Array.isArray(old.pages)) {
          const allMessages = old.pages.flatMap((p: any) => p?.messages || []);
          if (allMessages.some((m: any) => m._id === msg._id)) {
            return old;
          }

          let replaced = false;
          const nextPages = old.pages.map((page: any) => {
            if (!page?.messages) return page;
            const optIdx = page.messages.findIndex(
              (m: any) =>
                (m._id && m._id.startsWith('optimistic-') && m.text === msg.text) ||
                (m.isOptimistic && m.text === msg.text)
            );
            if (optIdx !== -1) {
              replaced = true;
              const nextMsgs = [...page.messages];
              nextMsgs[optIdx] = msg;
              return { ...page, messages: nextMsgs };
            }
            return page;
          });

          if (!replaced && nextPages.length > 0) {
            nextPages[0] = {
              ...nextPages[0],
              messages: [msg, ...(nextPages[0]?.messages || [])],
            };
          }

          return { ...old, pages: nextPages };
        }

        // Handle Flat structure
        if (old.messages && Array.isArray(old.messages)) {
          if (old.messages.some((m: any) => m._id === msg._id)) return old;
          const optIdx = old.messages.findIndex(
            (m: any) =>
              (m._id && m._id.startsWith('optimistic-') && m.text === msg.text) ||
              (m.isOptimistic && m.text === msg.text)
          );
          if (optIdx !== -1) {
            const next = [...old.messages];
            next[optIdx] = msg;
            return { ...old, messages: next };
          }
          return { ...old, messages: [...old.messages, msg] };
        }

        return old;
      }
    );

    // Invalidate messages query to guarantee fresh state
    queryClient.invalidateQueries({
      queryKey: queryKeys.conversations.messages(convId),
      refetchType: 'active',
    });

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
            text: msg.text,
            sender: senderId,
            createdAt: msg.createdAt,
          },
          updatedAt: msg.createdAt,
          unreadCount: newUnreadCount,
        };

        const nextList = [...old];
        nextList.splice(index, 1);
        return [updated, ...nextList];
      }
    );
  }, [queryClient]);

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
      const activeId = useChatUIStore.getState().activeConversationId;
      if (activeId) {
        sock.emit('join', activeId);
        sock.emit('join:room', { conversationId: activeId });
        sock.emit('conversation:join', { conversationId: activeId });
      }
    };

    const handleDisconnect = (reason: string) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: any) => {
      console.warn('⚠️ Socket connection error:', error?.message || error);
      setIsConnected(false);
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
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list() });
    };

    const messageEvents = [
      'message:new',
      'message',
      'newMessage',
      'new_message',
      'chat:message',
      'message:created',
      'message:receive',
      'receive:message',
    ];

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);
    sock.on('connect_error', handleConnectError);
    messageEvents.forEach((evt) => {
      sock.on(evt, handleGlobalNewMessage);
    });
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
      messageEvents.forEach((evt) => {
        sock.off(evt, handleGlobalNewMessage);
      });
      sock.off('conversation:updated', handleGlobalConversationUpdated);
      sock.off('typing', handleTypingEvent);
      sock.off('user:typing', handleTypingEvent);
    };
  }, [token, isAuthenticated, queryClient, handleTypingEvent, handleGlobalNewMessage]);

  const onNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      const sock = socket || getSocket(token);
      if (!sock) return () => { };

      const messageEvents = [
        'message:new',
        'message',
        'newMessage',
        'new_message',
        'chat:message',
      ];
      messageEvents.forEach((evt) => sock.on(evt, callback));

      return () => {
        messageEvents.forEach((evt) => sock.off(evt, callback));
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
