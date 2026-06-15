import { useState, useEffect } from 'react';

const MAX_LIVES = 5;
const MINUTES_PER_LIFE = 15;
const REGEN_MS = MINUTES_PER_LIFE * 60 * 1000;

export default function useLives() {
  const [lives, setLivesState] = useState(MAX_LIVES);
  const [lastLostTime, setLastLostTime] = useState(null);
  const [timeToNextLife, setTimeToNextLife] = useState(null);

  // Load from local storage
  useEffect(() => {
    const savedLives = localStorage.getItem('kuro_lives');
    const savedTime = localStorage.getItem('kuro_last_lost');

    if (savedLives !== null) {
      setLivesState(parseInt(savedLives, 10));
    }
    if (savedTime !== null) {
      setLastLostTime(parseInt(savedTime, 10));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('kuro_lives', lives);
    if (lastLostTime) {
      localStorage.setItem('kuro_last_lost', lastLostTime);
    } else {
      localStorage.removeItem('kuro_last_lost');
    }
  }, [lives, lastLostTime]);

  // Timer loop for regenerating lives
  useEffect(() => {
    let interval;
    
    if (lives < MAX_LIVES && lastLostTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const timePassed = now - lastLostTime;
        
        if (timePassed >= REGEN_MS) {
          // Regenerate one life
          const newLives = Math.min(lives + 1, MAX_LIVES);
          setLivesState(newLives);
          
          if (newLives === MAX_LIVES) {
            setLastLostTime(null);
            setTimeToNextLife(null);
          } else {
            // Reset timer start point
            setLastLostTime(now);
          }
        } else {
          // Update countdown
          const remaining = REGEN_MS - timePassed;
          const mins = Math.floor(remaining / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          setTimeToNextLife(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      }, 1000);
    } else {
      setTimeToNextLife(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lives, lastLostTime]);

  const decreaseLife = () => {
    if (lives > 0) {
      const newLives = lives - 1;
      setLivesState(newLives);
      // Solo iniciamos el timer si estábamos llenos
      if (lives === MAX_LIVES) {
        setLastLostTime(Date.now());
      }
    }
  };

  const refillLives = () => {
    setLivesState(MAX_LIVES);
    setLastLostTime(null);
  };

  return {
    lives,
    decreaseLife,
    refillLives,
    timeToNextLife,
    hasLives: lives > 0
  };
}
