import { useState, useEffect } from 'react';
import localforage from 'localforage';
import confetti from 'canvas-confetti';

export const ALBUM_CARDS = [
  { id: 'card_1', name: 'Primera Chispa', description: 'Alcanza tu primera racha de 5 aciertos en el examen.', conditionText: 'Racha de 5', image: '/images/kuro_fire.png' },
  { id: 'card_2', name: 'Estudiante Aplicado', description: 'Completa 3 niveles de teoría o examen.', conditionText: 'Termina 3 Niveles', image: '/images/kuro_book.png' },
  { id: 'card_3', name: 'Sobreviviente', description: 'Recupera un total de 5 vidas en la Sala de Castigo.', conditionText: 'Recupera 5 Vidas', image: '/images/kuro_shield.png' },
  { id: 'card_4', name: 'Mente Maestra', description: 'Termina un nivel entero sin cometer errores.', conditionText: 'Nivel Perfecto', image: '/images/kuro_badge_legend.png' },
  { id: 'card_5', name: 'Comprador Compulsivo', description: 'Gasta un total de 150 Kuro-Coins en la Tienda.', conditionText: 'Gasta 150 Monedas', image: '/images/kuro_shop.png' },
  { id: 'card_6', name: 'Leyenda del Volante', description: 'Llega al temible nivel 10 del examen.', conditionText: 'Alcanza el Nivel 10', image: '/images/kuromi_instructor_1781483016419.png' },
];

export default function useAlbum(userId) {
  const [unlockedCards, setUnlockedCards] = useState([]);
  
  // Progress trackers for cumulative achievements
  const [stats, setStats] = useState({
    levelsCompleted: 0,
    livesRecovered: 0,
    coinsSpent: 0
  });

  useEffect(() => {
    async function loadAlbum() {
      if (!userId) return;
      
      const savedUnlocked = await localforage.getItem(`kuro_user_${userId}_album_unlocked`) || [];
      setUnlockedCards(savedUnlocked);
      
      const savedStats = await localforage.getItem(`kuro_user_${userId}_album_stats`) || {
        levelsCompleted: 0,
        livesRecovered: 0,
        coinsSpent: 0
      };
      setStats(savedStats);
    }
    loadAlbum();
  }, [userId]);

  const saveState = async (newUnlocked, newStats) => {
    if (!userId) return;
    if (newUnlocked) {
      setUnlockedCards(newUnlocked);
      await localforage.setItem(`kuro_user_${userId}_album_unlocked`, newUnlocked);
    }
    if (newStats) {
      setStats(newStats);
      await localforage.setItem(`kuro_user_${userId}_album_stats`, newStats);
    }
  };

  const unlockCard = (cardId) => {
    if (!unlockedCards.includes(cardId)) {
      const newUnlocked = [...unlockedCards, cardId];
      saveState(newUnlocked, null);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffb6c1', '#1a1a1a', '#ff9600']
      });
      // Here we could trigger a toast notification
      console.log(`¡Carta Desbloqueada: ${cardId}!`);
    }
  };

  const checkUnlocks = ({ currentLevel, streak, perfectLevel, livesRecoveredEvent, coinsSpentEvent, levelCompletedEvent }) => {
    const newStats = { ...stats };
    let statsChanged = false;

    if (livesRecoveredEvent) {
      newStats.livesRecovered += livesRecoveredEvent;
      statsChanged = true;
    }
    if (coinsSpentEvent) {
      newStats.coinsSpent += coinsSpentEvent;
      statsChanged = true;
    }
    if (levelCompletedEvent) {
      newStats.levelsCompleted += levelCompletedEvent;
      statsChanged = true;
    }

    if (statsChanged) {
      saveState(null, newStats);
    }

    // Check conditions
    // 1. Primera Chispa
    if (streak >= 5 && !unlockedCards.includes('card_1')) unlockCard('card_1');
    
    // 2. Estudiante Aplicado
    if (newStats.levelsCompleted >= 3 && !unlockedCards.includes('card_2')) unlockCard('card_2');
    
    // 3. Sobreviviente
    if (newStats.livesRecovered >= 5 && !unlockedCards.includes('card_3')) unlockCard('card_3');
    
    // 4. Mente Maestra
    if (perfectLevel && !unlockedCards.includes('card_4')) unlockCard('card_4');
    
    // 5. Comprador Compulsivo
    if (newStats.coinsSpent >= 150 && !unlockedCards.includes('card_5')) unlockCard('card_5');
    
    // 6. Leyenda del Volante
    if (currentLevel >= 10 && !unlockedCards.includes('card_6')) unlockCard('card_6');
  };

  return {
    unlockedCards,
    checkUnlocks,
    stats
  };
}
