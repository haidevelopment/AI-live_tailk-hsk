'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface WaveformProps {
  isActive: boolean;
  audioLevel?: number;
  className?: string;
  barCount?: number;
  color?: string;
}

export default function Waveform({
  isActive,
  audioLevel = 0,
  className,
  barCount = 5,
  color = 'bg-primary-500',
}: WaveformProps) {
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const animateBars = () => {
      barsRef.current.forEach((bar, index) => {
        if (bar) {
          const baseHeight = 20;
          const variation = audioLevel > 0 
            ? Math.random() * audioLevel * 30 
            : Math.random() * 15;
          const delay = index * 0.1;
          bar.style.height = `${baseHeight + variation}px`;
          bar.style.transitionDelay = `${delay}s`;
        }
      });
    };

    const interval = setInterval(animateBars, 100);
    return () => clearInterval(interval);
  }, [isActive, audioLevel]);

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) barsRef.current[index] = el;
          }}
          className={cn(
            'w-1 rounded-full transition-all duration-150',
            color,
            isActive ? 'opacity-100' : 'opacity-40'
          )}
          style={{
            height: isActive ? '20px' : '8px',
          }}
        />
      ))}
    </div>
  );
}
