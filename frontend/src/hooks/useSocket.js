import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

export function useSocket(userId) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    if (!socketInstance) {
      socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        transports: ['websocket'],
      });
    }
    socketRef.current = socketInstance;
    socketInstance.emit('join', userId);

    return () => {
      // Don't disconnect globally — reuse across components
    };
  }, [userId]);

  return socketRef.current;
}

export function getSocket() {
  return socketInstance;
}
