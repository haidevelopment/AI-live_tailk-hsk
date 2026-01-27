'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

interface UseAudioPlaybackOptions {
  sampleRate?: number;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
}

export function useAudioPlayback(options: UseAudioPlaybackOptions = {}) {
  const { sampleRate = 24000, onPlaybackStart, onPlaybackEnd } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isProcessingRef = useRef(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext({ sampleRate });
    }
    return audioContextRef.current;
  }, [sampleRate]);

  const base64ToArrayBuffer = useCallback((base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }, []);

  const processQueue = useCallback(() => {
    if (isProcessingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;

    if (!isPlaying) {
      setIsPlaying(true);
      onPlaybackStart?.();
    }

    try {
      const audioContext = initAudioContext();
      const currentTime = audioContext.currentTime;

      // Initialize start time if needed
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime + 0.05; // Small buffer
      }

      // Process all chunks in queue
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

        // Schedule playback at precise time
        source.start(nextStartTimeRef.current);
        scheduledSourcesRef.current.push(source);

        // Update next start time
        nextStartTimeRef.current += audioBuffer.duration;

        // Clean up when done
        source.onended = () => {
          const index = scheduledSourcesRef.current.indexOf(source);
          if (index > -1) {
            scheduledSourcesRef.current.splice(index, 1);
          }
          
          // Check if all done
          if (scheduledSourcesRef.current.length === 0 && audioQueueRef.current.length === 0) {
            isProcessingRef.current = false;
            setIsPlaying(false);
            onPlaybackEnd?.();
            nextStartTimeRef.current = 0;
          }
        };
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      isProcessingRef.current = false;
      setIsPlaying(false);
      onPlaybackEnd?.();
    } finally {
      isProcessingRef.current = false;
    }
  }, [initAudioContext, onPlaybackStart, onPlaybackEnd, sampleRate, isPlaying]);

  const playAudioChunk = useCallback((base64Audio: string) => {
    try {
      const arrayBuffer = base64ToArrayBuffer(base64Audio);
      audioQueueRef.current.push(arrayBuffer);
      processQueue();
    } catch (err) {
      console.error('Error processing audio chunk:', err);
    }
  }, [base64ToArrayBuffer, processQueue]);

  const clearQueue = useCallback(() => {
    audioQueueRef.current = [];
    
    // Stop all scheduled sources
    scheduledSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
    });
    scheduledSourcesRef.current = [];

    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
      currentSourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    isProcessingRef.current = false;
    nextStartTimeRef.current = 0;
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearQueue();
    };
  }, [clearQueue]);

  return {
    isPlaying,
    playAudioChunk,
    clearQueue,
  };
}
