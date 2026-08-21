'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
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
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
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
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (error: any) => {
      console.warn('Socket connection error:', error?.message || error);
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
  }, [isAuthenticated, token]);

  const onNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (!socket) return () => {};
      socket.on('message:new', callback);
      return () => {
        socket.off('message:new', callback);
      };
    },
    [socket]
  );

  const onConversationUpdated = useCallback(
    (callback: (conversation: GroupConversation) => void) => {
      if (!socket) return () => {};
      socket.on('conversation:updated', callback);
      return () => {
        socket.off('conversation:updated', callback);
      };
    },
    [socket]
  );

  const emitSendMessage = useCallback(
    (conversationId: string, text: string) => {
      if (socket && isConnected) {
        socket.emit('message:send', { conversationId, text });
      }
    },
    [socket, isConnected]
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
