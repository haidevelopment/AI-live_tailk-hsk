'use client';

import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import Waveform from './Waveform';

interface MicButtonProps {
  isRecording: boolean;
  isConnecting?: boolean;
  audioLevel?: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function MicButton({
  isRecording,
  isConnecting = false,
  audioLevel = 0,
  onClick,
  disabled = false,
}: MicButtonProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Waveform indicators */}
      <div className="flex items-center gap-4">
        <Waveform
          isActive={isRecording}
          audioLevel={audioLevel}
          barCount={5}
          color="bg-primary-400"
        />

        {/* Main button */}
        <button
          onClick={onClick}
          disabled={disabled || isConnecting}
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300',
            'shadow-lg hover:shadow-xl active:scale-95',
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-red-600'
              : 'bg-gradient-to-br from-primary-500 to-primary-600',
            (disabled || isConnecting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* Pulse rings when recording */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 pulse-ring" />
              <div
                className="absolute inset-0 rounded-full bg-red-400 opacity-20 pulse-ring"
                style={{ animationDelay: '0.5s' }}
              />
            </>
          )}

          {/* Icon */}
          {isConnecting ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isRecording ? (
            <MicOff className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </button>

        <Waveform
          isActive={isRecording}
          audioLevel={audioLevel}
          barCount={5}
          color="bg-primary-400"
        />
      </div>

      {/* Status text */}
      <p className="mt-4 text-sm font-medium text-slate-600">
        {isConnecting
          ? 'Đang kết nối...'
          : isRecording
          ? 'Nhấn để dừng'
          : 'Nhấn để bắt đầu nói'}
      </p>
    </div>
  );
}
