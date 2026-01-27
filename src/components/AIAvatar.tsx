'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AIAvatarProps {
  isActive?: boolean;
  isSpeaking?: boolean;
  currentText?: string;
  className?: string;
}

export default function AIAvatar({ isActive = false, isSpeaking = false, currentText = '', className }: AIAvatarProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Avatar container - no background */}
      <div
        className={cn(
          'relative flex h-40 w-40 items-center justify-center',
          'transition-all duration-300',
          isActive && 'scale-105'
        )}
      >
        {/* AI Avatar Image */}
        <div className="relative w-40 h-40">
          <Image
            src="/image/hsk-ai.png"
            alt="HSK AI Avatar"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
          {/* Shadow underneath like standing platform */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-3 bg-slate-300/40 rounded-full blur-md" />
        </div>
      </div>

      {/* Speech bubble - positioned above owl */}
      {isActive && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-100">
            <p className="text-sm font-medium text-slate-700 min-h-[20px] max-h-32 overflow-y-auto break-words">
              {currentText || (isSpeaking ? '正在说话...' : '我在听...')}
            </p>
          </div>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-100 transform rotate-45" />
        </div>
      )}
    </div>
  );
}
