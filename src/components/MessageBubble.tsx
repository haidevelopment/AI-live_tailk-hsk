'use client';

import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  pinyin?: string;
  translation?: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onPlayAudio?: () => void;
}

export default function MessageBubble({ message, onPlayAudio }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full message-enter',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm break-words',
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md'
            : 'bg-white text-slate-800 rounded-bl-md border border-slate-100'
        )}
      >
        {/* Main text */}
        <p className={cn('text-base leading-relaxed whitespace-pre-wrap', message.isStreaming && 'animate-pulse')}>
          {message.text}
          {message.isStreaming && <span className="ml-1">▊</span>}
        </p>

        {/* Pinyin (for AI messages) */}
        {message.pinyin && (
          <p className="mt-1 text-sm text-slate-500 italic">{message.pinyin}</p>
        )}

        {/* Translation (for AI messages) */}
        {message.translation && (
          <p className="mt-1 text-sm text-slate-400">{message.translation}</p>
        )}

        {/* Footer with timestamp and actions */}
        <div
          className={cn(
            'mt-2 flex items-center gap-2 text-xs',
            isUser ? 'text-primary-200' : 'text-slate-400'
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          
          {!isUser && onPlayAudio && (
            <button
              onClick={onPlayAudio}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
              title="Phát lại"
            >
              <Volume2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
