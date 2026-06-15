import { useState, useEffect } from 'react';
import localforage from 'localforage';

const MAX_LIVES = 5;
const MINUTES_PER_LIFE = 15;
const REGEN_MS = MINUTES_PER_LIFE * 60 * 1000;

export default function useLives(userId) {
  const [lives, setLivesState] = useState(MAX_LIVES);
  const [lastLostTime, setLastLostTime] = useState(null);
  const [timeToNextLife, setTimeToNextLife] = useState(null);

  // Load from localforage
  useEffect(() => {
    if (!userId) return;
    async function loadLives() {
      const savedLives = await localforage.getItem(`kuro_user_${userId}_lives`);
      const savedTime = await localforage.getItem(`kuro_user_${userId}_last_lost`);

      if (savedLives !== null) {
        setLivesState(parseInt(savedLives, 10));
      } else {
        setLivesState(MAX_LIVES); // default new user
      }
      
      if (savedTime !== null) {
        setLastLostTime(parseInt(savedTime, 10));
      } else {
        setLastLostTime(null);
      }
    }
    loadLives();
  }, [userId]);

  // Save to localforage
  useEffect(() => {
    if (!userId) return;
    async function saveLives() {
      await localforage.setItem(`kuro_user_${userId}_lives`, lives);
      if (lastLostTime) {
        await localforage.setItem(`kuro_user_${userId}_last_lost`, lastLostTime);
      } else {
        await localforage.removeItem(`kuro_user_${userId}_last_lost`);
      }
    }
    saveLives();
  }, [lives, lastLostTime, userId]);

  // Timer loop for regenerating lives
  useEffect(() => {
    if (!userId) return;
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
  }, [lives, lastLostTime, userId]);

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

  const addLife = () => {
    if (lives < MAX_LIVES) {
      const newLives = lives + 1;
      setLivesState(newLives);
      if (newLives === MAX_LIVES) {
        setLastLostTime(null);
        setTimeToNextLife(null);
      } else {
        // Al sumar una vida, reiniciamos el ciclo de 15 minutos de la SIGUIENTE vida
        setLastLostTime(Date.now());
      }
    }
  };

  const refillLives = () => {
    setLivesState(MAX_LIVES);
    setLastLostTime(null);
    setTimeToNextLife(null);
  };

  return {
    lives,
    decreaseLife,
    addLife,
    refillLives,
    timeToNextLife,
    hasLives: lives > 0,
    maxLives: MAX_LIVES
  };
}
