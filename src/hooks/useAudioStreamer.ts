'use client';

import { useState, useRef, useCallback } from 'react';

interface UseAudioStreamerOptions {
  sampleRate?: number;
  onAudioChunk?: (base64Audio: string) => void;
  onAudioLevel?: (level: number) => void;
}

export function useAudioStreamer(options: UseAudioStreamerOptions = {}) {
  const { sampleRate = 16000, onAudioChunk, onAudioLevel } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      console.log('🎤 Requesting microphone access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log('✅ Microphone access granted');
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);

      // Analyser for audio level visualization
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      // Processor for getting audio chunks
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (onAudioChunk) {
          const inputData = e.inputBuffer.getChannelData(0);

          // Convert float32 to int16 PCM
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          // Convert to base64
          const uint8Array = new Uint8Array(pcmData.buffer);
          let binary = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          const base64Audio = btoa(binary);

          onAudioChunk(base64Audio);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      // Start level monitoring
      const monitorLevel = () => {
        if (analyserRef.current && onAudioLevel) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          onAudioLevel(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(monitorLevel);
      };
      monitorLevel();

      setIsRecording(true);
      console.log('🎤 Recording started');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      console.error('❌ Error starting recording:', err);
    }
  }, [onAudioChunk, onAudioLevel, sampleRate]);

  const stopRecording = useCallback(() => {
    console.log('🎤 Stopping recording...');

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
    console.log('✅ Recording stopped');
  }, []);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  };
}
