import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../utils/api';

// Fake real-time without Socket.io — runs entirely in browser
export function useSocket() {
  const { setQueueLengths } = useAppStore();

  useEffect(() => {
    // Initialize with current lengths
    setQueueLengths({ ...api._queueLengths });

    const interval = setInterval(() => {
      const lengths = api._queueLengths;
      const ids = Object.keys(lengths);
      if (!ids.length) return;

      // Randomly change 1-2 queues
      const count = Math.random() < 0.4 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const id = ids[Math.floor(Math.random() * ids.length)];
        const roll = Math.random();
        if (roll < 0.55 && lengths[id] > 0) {
          lengths[id] = Math.max(0, lengths[id] - 1);
        } else if (roll < 0.8) {
          lengths[id] = lengths[id] + 1;
        }
      }

      setQueueLengths({ ...lengths });
    }, 8000);

    return () => clearInterval(interval);
  }, [setQueueLengths]);
}
