import { useCallback, useRef } from 'react';

export default function useAudio() {
  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      // Create context only on first user interaction to bypass browser autoplay policies
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if it was suspended
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTone = (freq, type, duration, startTime) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    // Envelope to prevent clicking
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const playCorrect = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Duolingo-style positive "Ding-Ding"
    // First high note
    playTone(523.25, 'sine', 0.15, now); // C5
    // Second higher note
    playTone(659.25, 'sine', 0.3, now + 0.1); // E5
  }, []);

  const playIncorrect = useCallback(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Duolingo-style negative "Bzzzt"
    // A dissonant, low square wave
    playTone(150, 'triangle', 0.2, now);
    playTone(140, 'triangle', 0.3, now + 0.15);
  }, []);

  return { playCorrect, playIncorrect };
}
