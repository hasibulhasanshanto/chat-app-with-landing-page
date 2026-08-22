import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '@/lib/cookies';

const SOCKET_SERVER_URL = 'https://frontend-task-chatapp.onrender.com';

let socketInstance: Socket | null = null;
let registeredToken: string | null = null;

export function getSocket(providedToken?: string | null): Socket | null {
  if (typeof window === 'undefined') return null;

  const token = providedToken !== undefined ? providedToken : getAuthToken();

  if (!token) {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      registeredToken = null;
    }
    return null;
  }

  // If socket already exists for this exact token, return it
  if (socketInstance && registeredToken === token) {
    if (!socketInstance.connected && !socketInstance.active) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  // If token changed or socket doesn't exist, create new connection
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  registeredToken = token;
  socketInstance = io(SOCKET_SERVER_URL, {
    auth: { token },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    query: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    registeredToken = null;
  }
}
