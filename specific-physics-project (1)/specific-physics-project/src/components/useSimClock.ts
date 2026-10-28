import { useCallback, useEffect, useState } from 'react';

export function useSimClock(maxTime: number, stepSize = 0.05) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((current) => {
        const next = current + stepSize;
        if (next >= maxTime) {
          setPlaying(false);
          return Math.max(0, maxTime);
        }
        return next;
      });
    }, 50);
    return () => window.clearInterval(timer);
  }, [playing, maxTime, stepSize]);
  const reset = useCallback(() => { setPlaying(false); setTime(0); }, []);
  const step = useCallback((direction: number) => { setPlaying(false); setTime((current) => Math.min(maxTime, Math.max(0, current + direction * stepSize))); }, [maxTime, stepSize]);
  return { time, playing, play: () => setPlaying(true), pause: () => setPlaying(false), reset, step, setTime };
}

export const fixed = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
