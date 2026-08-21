'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatUIStore } from '@/store/useChatUIStore';
import { getSocket } from '@/lib/socket';
import { Message, GroupConversation, Conversation, MessagesResponse } from '@/types/chat';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onConversationUpdated: (callback: (conversation: GroupConversation) => void) => () => void;
  emitSendMessage: (conversationId: string, text: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

function extractConversationId(message: any): string {
  if (!message) return '';
  if (typeof message.conversation === 'string') return message.conversation;
  if (typeof message.conversation === 'object' && message.conversation?._id) return message.conversation._id;
  if (typeof message.conversationId === 'string') return message.conversationId;
  if (typeof message.conversationId === 'object' && message.conversationId?._id) return message.conversationId._id;
  return '';
}

function extractSenderId(message: any): string {
  if (!message) return '';
  if (typeof message.sender === 'string') return message.sender;
  if (typeof message.sender === 'object' && message.sender?._id) return message.sender._id;
  if (typeof message.senderId === 'string') return message.senderId;
  if (typeof message.senderId === 'object' && message.senderId?._id) return message.senderId._id;
  return '';
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
      console.log('⚡ Socket connected to server:', sock.id);
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

    // Central Global Event Listener for real-time messages
    const handleGlobalNewMessage = (incomingMessage: any) => {
      const convId = extractConversationId(incomingMessage);
      const senderId = extractSenderId(incomingMessage);
      if (!convId) return;

      const activeId = useChatUIStore.getState().activeConversationId;
      const currentUserId = useAuthStore.getState().user?._id;
      const isFromMe = Boolean(currentUserId && senderId === currentUserId);
      const isCurrentlyOpen = activeId === convId;

      // 1. Immediately inject message into the active or target conversation's cache
      queryClient.setQueryData<MessagesResponse>(
        queryKeys.conversations.messages(convId),
        (old) => {
          if (!old) {
            return { messages: [incomingMessage], hasMore: false };
          }
          const exists = old.messages.some((m) => m._id === incomingMessage._id);
          if (exists) return old;

          // Replace optimistic placeholder if text matches
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

      // 2. Immediately update the conversation list (Inbox) and bump conversation to top
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

    // Central Global Event Listener for group changes
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

    if (sock.connected) {
      setIsConnected(true);
    }

    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      sock.off('connect_error', handleConnectError);
      sock.off('message:new', handleGlobalNewMessage);
      sock.off('conversation:updated', handleGlobalConversationUpdated);
    };
  }, [token, isAuthenticated, queryClient]);

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

  const value: SocketContextType = {
    socket,
    isConnected,
    onNewMessage,
    onConversationUpdated,
    emitSendMessage,
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
