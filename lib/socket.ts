import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://frontend-task-chatapp.onrender.com';

let socketInstance: Socket | null = null;

export function getSocket(token?: string | null): Socket | null {
  if (typeof window === 'undefined') return null;

  if (!token) {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
    return null;
  }

  // If socket exists and is connected with the same token, reuse it
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
  }

  socketInstance = io(SOCKET_SERVER_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1500,
  });

  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
