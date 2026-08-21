'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { getSocket } from '@/lib/socket';
import { Message, GroupConversation } from '@/types/chat';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onConversationUpdated: (callback: (conversation: GroupConversation) => void) => () => void;
  emitSendMessage: (conversationId: string, text: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
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
      console.log('⚡ Socket connected successfully:', sock.id);
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

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);
    sock.on('connect_error', handleConnectError);

    if (sock.connected) {
      setIsConnected(true);
    }

    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      sock.off('connect_error', handleConnectError);
    };
  }, [token, isAuthenticated]);

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
