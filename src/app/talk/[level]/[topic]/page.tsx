'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PhoneOff, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import { getHSKLevel } from '@/data/hsk-levels';
import { getTopic } from '@/data/hsk-topics';
import { cn } from '@/lib/utils';
import { useGeminiWebSocket, useAudioStreamer, useAudioPlayback } from '@/hooks';
import MicButton from '@/components/MicButton';
import ChatBox from '@/components/ChatBox';
import AIAvatar from '@/components/AIAvatar';
import type { Message } from '@/components/MessageBubble';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002/ws';

interface Props {
  params: { level: string; topic: string };
}

export default function TalkPage({ params }: Props) {
  const router = useRouter();
  const level = parseInt(params.level);
  const topicId = params.topic;

  const hskLevel = getHSKLevel(level);
  const topic = getTopic(topicId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUserTranscript, setCurrentUserTranscript] = useState('');
  const [currentAITranscript, setCurrentAITranscript] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRecording, setPendingRecording] = useState(false);

  const currentAIMessageIdRef = useRef<string | null>(null);
  const hasConnectedRef = useRef(false);

  // Audio playback for AI responses
  const { isPlaying, playAudioChunk, clearQueue } = useAudioPlayback({
    sampleRate: 24000,
    onPlaybackStart: () => setIsAISpeaking(true),
    onPlaybackEnd: () => setIsAISpeaking(false),
  });

  // WebSocket connection to Gemini Live API
  const {
    isConnected,
    isReady,
    isStreaming,
    connect,
    disconnect,
    startStream,
    endStream,
    sendAudioChunk,
  } = useGeminiWebSocket({
    wsUrl: WS_URL,
    level,
    topicId,
    onUserTranscript: (text) => {
      console.log('👤 User said:', text);
      setCurrentUserTranscript(text);
      
      // Add user message
      if (text.trim()) {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          text: text,
          timestamp: new Date(),
        };
        setMessages((prev) => {
          const exists = prev.some(m => m.role === 'user' && m.text === text);
          if (exists) return prev;
          return [...prev, userMessage];
        });
      }
    },
    onAITranscript: (text) => {
      console.log('🤖 AI said:', text);
      setCurrentAITranscript((prev) => prev + text);
      
      // Create or update AI message
      if (!currentAIMessageIdRef.current) {
        currentAIMessageIdRef.current = `ai-${Date.now()}`;
        const aiMessage: Message = {
          id: currentAIMessageIdRef.current,
          role: 'assistant',
          text: text,
          timestamp: new Date(),
          isStreaming: true,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentAIMessageIdRef.current
              ? { ...msg, text: msg.text + text }
              : msg
          )
        );
      }
    },
    onAudioResponse: (audio, mimeType) => {
      if (!isMuted) {
        playAudioChunk(audio);
      }
    },
    onTurnComplete: () => {
      console.log('✅ Turn complete');
      if (currentAIMessageIdRef.current) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentAIMessageIdRef.current
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        currentAIMessageIdRef.current = null;
      }
      setCurrentAITranscript('');
      setCurrentUserTranscript('');
    },
    onError: (err) => {
      console.error('❌ WebSocket error:', err);
      setError(err);
    },
    onReady: () => {
      console.log('✅ Gemini Live API ready');
      setError(null);
    },
    onStreamingStarted: () => {
      console.log('🎙️ Streaming started');
    },
  });

  // Audio recorder
  const { isRecording, startRecording, stopRecording } = useAudioStreamer({
    sampleRate: 16000,
    onAudioChunk: (base64Audio) => {
      sendAudioChunk(base64Audio);
    },
    onAudioLevel: (level) => {
      setAudioLevel(level);
    },
  });

  // Connect WebSocket on mount - only once
  useEffect(() => {
    let mounted = true;
    
    if (hskLevel && topic && !hasConnectedRef.current) {
      console.log('🔌 Connecting to WebSocket:', WS_URL);
      hasConnectedRef.current = true;
      
      // Small delay to avoid React Strict Mode double-mount issues
      const timer = setTimeout(() => {
        if (mounted) {
          connect();
        }
      }, 100);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
        console.log('🔌 Cleanup: disconnecting...');
        hasConnectedRef.current = false;
        disconnect();
      };
    }
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hskLevel, topic]);

  // Auto-start recording when stream is ready
  useEffect(() => {
    if (pendingRecording && isStreaming && !isRecording) {
      console.log('✅ Stream ready, starting recording...');
      setPendingRecording(false);
      startRecording();
    }
  }, [pendingRecording, isStreaming, isRecording, startRecording]);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      console.log('🎤 Stop recording');
      stopRecording();
      endStream();
      setPendingRecording(false);
    } else {
      if (!isReady) {
        setError('Đang kết nối với AI...');
        return;
      }
      if (isPlaying) {
        clearQueue();
      }
      console.log('🎤 Start recording - waiting for stream to start...');
      setError(null);
      const started = startStream();
      if (!started) {
        setError('Không thể bắt đầu. Vui lòng thử lại.');
        return;
      }
      
      // Set pending flag - useEffect will start recording when isStreaming becomes true
      setPendingRecording(true);
    }
  }, [isRecording, isReady, isPlaying, stopRecording, endStream, startStream, clearQueue]);

  const handleEndCall = useCallback(() => {
    stopRecording();
    endStream();
    disconnect();
    clearQueue();
    router.push(`/hsk/${level}`);
  }, [stopRecording, endStream, disconnect, clearQueue, router, level]);

  if (!hskLevel || !topic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600">Không tìm thấy nội dung</p>
          <Link href="/hsk" className="text-primary-600 hover:underline mt-2 inline-block">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="glass border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/hsk/${level}`}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-900">
                  {topic.icon} {topic.nameZh}
                </span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    `bg-gradient-to-r`,
                    hskLevel.gradient,
                    'text-white'
                  )}
                >
                  {hskLevel.name}
                </span>
              </div>
              <p className="text-sm text-slate-500">{topic.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                isConnected && isReady
                  ? 'bg-green-100 text-green-700'
                  : isConnected
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              )}
            >
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected && isReady ? 'Đã kết nối' : isConnected ? 'Đang kết nối...' : 'Chưa kết nối'}
            </div>

            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) clearQueue();
              }}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isMuted ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100 text-slate-600'
              )}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Avatar and controls */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 border-r border-slate-200">
          {/* AI Avatar */}
          <AIAvatar
            isActive={isConnected || isRecording}
            isSpeaking={isAISpeaking}
            currentText={currentAITranscript}
            className="mb-8"
          />

          {/* Error */}
          {error && (
            <div className="mb-3 px-4 py-2 bg-red-100 rounded-lg text-red-600 text-center max-w-xs">
              {error}
            </div>
          )}

          {/* Mic button */}
          <MicButton
            isRecording={isRecording}
            isConnecting={!isReady && isConnected}
            audioLevel={audioLevel}
            onClick={toggleRecording}
            disabled={!isConnected}
          />

          {/* Hints */}
          {!isConnected && (
            <p className="mt-4 text-sm text-amber-600 text-center">
              Đang kết nối với AI server...
            </p>
          )}
          {isReady && !isRecording && (
            <p className="mt-4 text-sm text-slate-500 text-center">
              Bấm microphone để bắt đầu nói chuyện
            </p>
          )}

          {/* End call button */}
          <button
            onClick={handleEndCall}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <PhoneOff className="h-5 w-5" />
            Kết thúc
          </button>
        </div>

        {/* Right side - Chat */}
        <div className="w-1/2 flex flex-col bg-slate-50">
          <div className="px-6 py-5 border-b border-slate-200 bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Hội thoại</h2>
            <p className="text-sm text-slate-500 mt-1">Tin nhắn sẽ hiển thị ở đây</p>
          </div>
          <ChatBox
            messages={messages}
            isTyping={false}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
