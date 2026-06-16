import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import localforage from 'localforage';

export const syncProfileToCloud = async (uid, profileData) => {
  if (!uid) return;
  try {
    await setDoc(doc(db, 'profiles', uid), {
      ...profileData,
      lastSync: new Date().toISOString()
    }, { merge: true });
    console.log("Cloud sync: Profile saved to cloud for", uid);
  } catch (error) {
    console.error("Cloud sync: Error saving profile to cloud", error);
  }
};

export const syncProfileFromCloud = async (uid) => {
  if (!uid) return null;
  try {
    const docRef = doc(db, 'profiles', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Cloud sync: Profile loaded from cloud for", uid, data);
      
      // Hydrate localforage
      if (data.level !== undefined) await localforage.setItem(`kuro_user_${uid}_level`, data.level);
      if (data.streak !== undefined) await localforage.setItem(`kuro_user_${uid}_streak`, data.streak);
      if (data.errors !== undefined) await localforage.setItem(`kuro_user_${uid}_errors`, data.errors);
      if (data.testIndex !== undefined) await localforage.setItem(`kuro_user_${uid}_test_index`, data.testIndex);
      if (data.xp !== undefined) await localforage.setItem(`kuro_user_${uid}_xp`, data.xp);
      if (data.inventory !== undefined) await localforage.setItem(`kuro_user_${uid}_inventory`, data.inventory);
      
      if (data.lives !== undefined) await localforage.setItem(`kuro_user_${uid}_lives`, data.lives);
      if (data.last_lost !== undefined) await localforage.setItem(`kuro_user_${uid}_last_lost`, data.last_lost);
      
      if (data.missions !== undefined) await localforage.setItem(`kuro_user_${uid}_missions`, data.missions);
      if (data.unlockedCards !== undefined) await localforage.setItem(`kuro_user_${uid}_unlockedCards`, data.unlockedCards);
      
      return data;
    } else {
      console.log("Cloud sync: No profile found in cloud for", uid);
      return null;
    }
  } catch (error) {
    console.error("Cloud sync: Error loading profile from cloud", error);
    return null;
  }
};
