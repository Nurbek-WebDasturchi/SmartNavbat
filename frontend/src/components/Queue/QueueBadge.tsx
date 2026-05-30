import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

interface QueueBadgeProps {
  count: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function getQueueClass(count: number): string {
  if (count <= 5) return 'queue-low';
  if (count <= 10) return 'queue-medium';
  return 'queue-high';
}

function getQueueLabel(count: number): string {
  if (count <= 5) return 'Oz navbat';
  if (count <= 10) return "O'rtacha";
  return 'Ko\'p navbat';
}

export default function QueueBadge({ count, showIcon = true, size = 'md' }: QueueBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : size === 'lg' ? 'text-base px-4 py-2' : '';

  return (
    <span className={`${getQueueClass(count)} ${sizeClass}`}>
      {showIcon && <Users className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <span>kishi</span>
    </span>
  );
}

export { getQueueLabel };
