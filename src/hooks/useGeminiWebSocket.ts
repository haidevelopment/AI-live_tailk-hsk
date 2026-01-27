'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface GeminiMessage {
  type: string;
  text?: string;
  audio?: string;
  mimeType?: string;
  sessionId?: string;
  message?: string;
}

interface UseGeminiWebSocketOptions {
  wsUrl: string;
  level: number;
  topicId: string;
  onUserTranscript?: (text: string) => void;
  onAITranscript?: (text: string) => void;
  onAudioResponse?: (audio: string, mimeType: string) => void;
  onTurnComplete?: () => void;
  onError?: (error: string) => void;
  onReady?: () => void;
  onStreamingStarted?: () => void;
}

export function useGeminiWebSocket(options: UseGeminiWebSocketOptions) {
  const {
    wsUrl,
    level,
    topicId,
    onUserTranscript,
    onAITranscript,
    onAudioResponse,
    onTurnComplete,
    onError,
    onReady,
    onStreamingStarted,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    if (isConnectingRef.current) {
      console.log('⚠️ Already attempting to connect, skipping...');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('⚠️ WebSocket already connected');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log('⚠️ WebSocket already connecting, waiting...');
      return;
    }

    isConnectingRef.current = true;
    console.log('🔌 Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        isConnectingRef.current = false;
        setIsConnected(true);

        // Send init message
        ws.send(JSON.stringify({
          type: 'init',
          level,
          topicId,
          voiceName: 'Kore',
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data: GeminiMessage = JSON.parse(event.data);
          console.log('📨 WS Message:', data.type);

          switch (data.type) {
            case 'session_info':
              setSessionId(data.sessionId || null);
              break;

            case 'ready':
              console.log('✅ Gemini Live API ready');
              setIsReady(true);
              onReady?.();
              break;

            case 'streaming_started':
              console.log('🎙️ Streaming started');
              setIsStreaming(true);
              onStreamingStarted?.();
              break;

            case 'user_transcript':
              if (data.text) {
                console.log('👤 User said:', data.text);
                onUserTranscript?.(data.text);
              }
              break;

            case 'text_response':
              if (data.text) {
                console.log('🤖 AI said:', data.text);
                onAITranscript?.(data.text);
              }
              break;

            case 'audio_response':
              if (data.audio && data.mimeType) {
                console.log('🔊 AI audio received');
                onAudioResponse?.(data.audio, data.mimeType);
              }
              break;

            case 'turn_complete':
              console.log('✅ Turn complete');
              onTurnComplete?.();
              break;

            case 'stream_ended':
              console.log('🎙️ Stream ended');
              setIsStreaming(false);
              break;

            case 'error':
              console.error('❌ WS Error:', data.message);
              onError?.(data.message || 'Unknown error');
              break;

            case 'session_closed':
              console.log('🔌 Session closed');
              setIsConnected(false);
              setIsReady(false);
              break;
          }
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        isConnectingRef.current = false;
        onError?.('WebSocket connection error');
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        isConnectingRef.current = false;
        setIsConnected(false);
        setIsReady(false);
        setIsStreaming(false);
        wsRef.current = null;
      };
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      isConnectingRef.current = false;
      onError?.('Failed to connect to server');
    }
  }, [wsUrl, level, topicId, onUserTranscript, onAITranscript, onAudioResponse, onTurnComplete, onError, onReady, onStreamingStarted]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      // Only send stop message if WebSocket is open
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'stop' }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsReady(false);
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected');
      return false;
    }

    console.log('🎙️ Starting stream...');
    wsRef.current.send(JSON.stringify({ type: 'start_stream' }));
    return true;
  }, []);

  const endStream = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    console.log('🎙️ Ending stream...');
    wsRef.current.send(JSON.stringify({ type: 'end_stream' }));
    setIsStreaming(false);
  }, []);

  const sendAudioChunk = useCallback((audioBase64: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !isStreaming) {
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'audio_chunk',
      audio: audioBase64,
    }));
  }, [isStreaming]);

  const sendText = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'text',
      text,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Only disconnect if we have an active connection
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        disconnect();
      }
    };
  }, [disconnect]);

  return {
    isConnected,
    isReady,
    isStreaming,
    sessionId,
    connect,
    disconnect,
    startStream,
    endStream,
    sendAudioChunk,
    sendText,
  };
}
