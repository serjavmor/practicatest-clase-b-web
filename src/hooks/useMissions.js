import { useState, useEffect } from 'react';
import localforage from 'localforage';

const MISSION_POOL = [
  { id: 'streak_3', title: 'Fuego Interno', description: 'Alcanza una racha de 3 aciertos.', type: 'streak', target: 3, reward: 15 },
  { id: 'streak_5', title: 'Racha Imparable', description: 'Alcanza una racha de 5 aciertos.', type: 'streak', target: 5, reward: 30 },
  { id: 'perfect_level', title: 'Conocimiento Absoluto', description: 'Aprueba un nivel sin cometer errores.', type: 'perfect_test', target: 1, reward: 50 },
  { id: 'recover_life', title: 'Dedicatoria', description: 'Recupera una vida en la Sala de Castigo.', type: 'recover_life', target: 1, reward: 20 },
  { id: 'recover_life_3', title: 'Ratón de Biblioteca', description: 'Recupera 3 vidas en la Sala de Castigo.', type: 'recover_life', target: 3, reward: 40 },
  { id: 'play_level_2', title: 'Mente Activa', description: 'Completa 2 niveles (aprobados o no).', type: 'play_level', target: 2, reward: 25 },
];

function getRandomMissions(count) {
  const shuffled = [...MISSION_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(m => ({
    ...m,
    current: 0,
    completed: false,
    claimed: false
  }));
}

export default function useMissions(userId) {
  const [missions, setMissions] = useState([]);
  const [lastDate, setLastDate] = useState('');

  useEffect(() => {
    async function loadMissions() {
      if (!userId) return;
      
      const today = new Date().toISOString().split('T')[0];
      const savedDate = await localforage.getItem(`kuro_user_${userId}_missions_date`);
      
      if (savedDate === today) {
        // Load today's missions
        const savedMissions = await localforage.getItem(`kuro_user_${userId}_missions`);
        if (savedMissions) {
          setMissions(JSON.parse(savedMissions));
        } else {
          // Should not happen, but fallback
          const newMissions = getRandomMissions(3);
          setMissions(newMissions);
          await localforage.setItem(`kuro_user_${userId}_missions`, JSON.stringify(newMissions));
        }
      } else {
        // Generate new missions for today
        const newMissions = getRandomMissions(3);
        setMissions(newMissions);
        await localforage.setItem(`kuro_user_${userId}_missions_date`, today);
        await localforage.setItem(`kuro_user_${userId}_missions`, JSON.stringify(newMissions));
      }
      setLastDate(today);
    }
    loadMissions();
  }, [userId]);

  // Save missions whenever they change
  useEffect(() => {
    if (userId && missions.length > 0) {
      localforage.setItem(`kuro_user_${userId}_missions`, JSON.stringify(missions));
    }
  }, [missions, userId]);

  const updateMissionProgress = (type, value = 1) => {
    setMissions(prev => prev.map(mission => {
      if (mission.type === type && !mission.completed) {
        // For 'streak', we want the max streak. For others, we might want to add.
        let newCurrent = mission.current;
        if (type === 'streak') {
          newCurrent = Math.max(newCurrent, value);
        } else {
          newCurrent += value;
        }
        
        const completed = newCurrent >= mission.target;
        return {
          ...mission,
          current: Math.min(newCurrent, mission.target),
          completed
        };
      }
      return mission;
    }));
  };

  const claimReward = (missionId, earnXp) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission && mission.completed && !mission.claimed) {
      earnXp(mission.reward);
      setMissions(prev => prev.map(m => 
        m.id === missionId ? { ...m, claimed: true } : m
      ));
      return true;
    }
    return false;
  };

  return {
    missions,
    updateMissionProgress,
    claimReward
  };
}
