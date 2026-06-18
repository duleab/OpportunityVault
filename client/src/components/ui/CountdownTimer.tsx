import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';

interface CountdownTimerProps {
  deadline: string;
  className?: string;
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'EXPIRED';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export function CountdownTimer({ deadline, className = '' }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(() =>
    differenceInSeconds(new Date(deadline), new Date())
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(differenceInSeconds(new Date(deadline), new Date()));
    }, 60000);
    return () => clearInterval(id);
  }, [deadline]);

  const urgent = seconds <= 2 * 86400;
  return (
    <span className={`font-mono text-sm ${urgent ? 'text-danger' : 'text-warning'} ${className}`}>
      {formatCountdown(seconds)}
    </span>
  );
}
