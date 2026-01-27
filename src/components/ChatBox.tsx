'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import MessageBubble, { Message } from './MessageBubble';

interface ChatBoxProps {
  messages: Message[];
  className?: string;
  isTyping?: boolean;
}

export default function ChatBox({ messages, className, isTyping = false }: ChatBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex flex-col gap-4 overflow-y-auto p-4',
        className
      )}
    >
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-center">
          <div className="text-slate-400">
            <p className="text-lg font-medium">Bắt đầu cuộc hội thoại</p>
            <p className="text-sm mt-1">Nhấn nút micro để nói chuyện với AI</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </>
      )}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
              <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
              <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
