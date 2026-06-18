import { useEffect, useRef, useState } from 'react';
import { formatElapsed } from '@/utils/formatters';

interface ElapsedTimerProps {
  running: boolean;
  className?: string;
}

/** Displays a live-updating elapsed time counter. */
export function ElapsedTimer({ running, className }: ElapsedTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      startRef.current = Date.now();
      const tick = () => {
        setElapsed(Date.now() - (startRef.current ?? Date.now()));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setElapsed(0);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  if (!running) return null;

  return (
    <span className={className}>
      Elapsed: {formatElapsed(elapsed)}
    </span>
  );
}
