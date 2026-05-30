import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAppStore } from '../store/useAppStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: ReturnType<typeof io> | null = null;

export function useSocket() {
  const { setQueueLengths } = useAppStore();

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    }

    socket.on('queue_update', (lengths: Record<string, number>) => {
      setQueueLengths(lengths);
    });

    return () => {
      socket?.off('queue_update');
    };
  }, [setQueueLengths]);

  return socket;
}
