'use client';

import { useRef, useCallback, useState } from 'react';

interface AudioPlayerOptions {
  sampleRate?: number;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

export function useAudioPlayer(options: AudioPlayerOptions = {}) {
  const { sampleRate = 24000, onPlaybackStart, onPlaybackEnd } = options;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isProcessingRef = useRef(false);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext({ sampleRate });
    }
    return audioContextRef.current;
  }, [sampleRate]);

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || audioQueueRef.current.length === 0) {
      return;
    }
    
    isProcessingRef.current = true;
    setIsPlaying(true);
    onPlaybackStart?.();

    try {
      const audioContext = initAudioContext();
      
      while (audioQueueRef.current.length > 0) {
        const chunk = audioQueueRef.current.shift();
        if (!chunk) continue;
        
        // Convert PCM16 to Float32
        const int16Data = new Int16Array(chunk);
        const float32Data = new Float32Array(int16Data.length);
        for (let i = 0; i < int16Data.length; i++) {
          float32Data[i] = int16Data[i] / 32768;
        }
        
        const audioBuffer = audioContext.createBuffer(1, float32Data.length, sampleRate);
        audioBuffer.copyToChannel(float32Data, 0);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        await new Promise<void>((resolve) => {
          source.onended = () => resolve();
          source.start();
        });
      }
    } catch (err) {
      console.error('Error playing audio:', err);
    } finally {
      isProcessingRef.current = false;
      setIsPlaying(false);
      onPlaybackEnd?.();
    }
  }, [initAudioContext, onPlaybackStart, onPlaybackEnd, sampleRate]);

  const playAudioChunk = useCallback((chunk: ArrayBuffer) => {
    audioQueueRef.current.push(chunk);
    processQueue();
  }, [processQueue]);

  const clearQueue = useCallback(() => {
    audioQueueRef.current = [];
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    isProcessingRef.current = false;
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    playAudioChunk,
    clearQueue,
  };
}
