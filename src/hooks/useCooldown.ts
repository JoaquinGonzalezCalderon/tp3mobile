import { useCallback, useEffect, useRef, useState } from 'react';

export function useCooldown(seconds = 60) {
  const [remaining, setRemaining] = useState(0);
  const targetRef = useRef(0);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setInterval(() => {
      const next = Math.max(0, Math.ceil((targetRef.current - Date.now()) / 1000));
      setRemaining(next);
    }, 250);

    return () => clearInterval(timer);
  }, [remaining > 0]);

  const start = useCallback(() => {
    targetRef.current = Date.now() + seconds * 1000;
    setRemaining(seconds);
  }, [seconds]);

  return { remaining, isCoolingDown: remaining > 0, start };
}

