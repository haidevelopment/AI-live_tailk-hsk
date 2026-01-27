'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
  language?: string;
  rate?: number;
  pitch?: number;
}

export function useSpeechSynthesis(options: SpeechSynthesisOptions = {}) {
  const { onStart, onEnd, language = 'zh-CN', rate = 0.9, pitch = 1 } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      setVoices(availableVoices);
    };
    
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback((text: string) => {
    console.log('🔊 speak() called with text:', text);
    
    if (!isSupported || !text) {
      console.log('⚠️ Cannot speak:', { isSupported, hasText: !!text });
      return;
    }
    
    console.log('🔊 Available voices:', voices.length);
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Find a Chinese voice
    const chineseVoice = voices.find(
      (voice) => voice.lang.includes('zh') || voice.lang.includes('cmn')
    );
    
    if (chineseVoice) {
      console.log('✅ Using Chinese voice:', chineseVoice.name);
      utterance.voice = chineseVoice;
    } else {
      console.log('⚠️ No Chinese voice found, using default');
    }
    
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => {
      console.log('🔊 Speech started');
      setIsSpeaking(true);
      onStart?.();
    };
    
    utterance.onend = () => {
      console.log('✅ Speech ended');
      setIsSpeaking(false);
      onEnd?.();
    };
    
    utterance.onerror = (e) => {
      console.error('❌ Speech error:', e);
      setIsSpeaking(false);
      onEnd?.();
    };
    
    console.log('🔊 Starting speech synthesis...');
    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices, language, rate, pitch, onStart, onEnd]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    voices,
  };
}
