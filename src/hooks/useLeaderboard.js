import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc } from 'firebase/firestore';

export default function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to top players
  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('xp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topPlayers = [];
      snapshot.forEach((doc) => {
        topPlayers.push({ id: doc.id, ...doc.data() });
      });
      console.log("Firebase sync: loaded leaderboard with", topPlayers.length, "players:", topPlayers);
      setLeaderboard(topPlayers);
      setLoading(false);
    }, (error) => {
      console.error("Firebase sync: Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update current user's stats
  const updatePlayerStats = async (userId, nickname, xp, currentLevel, avatar) => {
    if (!userId || !nickname) {
      console.warn("Firebase sync: missing userId or nickname", userId, nickname);
      return;
    }
    try {
      console.log("Firebase sync: writing to firestore for", userId);
      await setDoc(doc(db, 'leaderboard', userId), {
        nickname,
        xp,
        level: currentLevel,
        avatar: avatar || 'kuro_profile.png',
        lastUpdate: new Date().toISOString()
      }, { merge: true });
      console.log("Firebase sync: write successful!");
    } catch (error) {
      console.error("Firebase sync: Error updating player stats:", error);
    }
  };

  return { leaderboard, loading, updatePlayerStats };
}
