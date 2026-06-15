import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid'; // Fallback to uuid library
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function UserSelectView({ onSelectUser }) {
  const [profiles, setProfiles] = useState([
    { id: 1, name: null },
    { id: 2, name: null },
    { id: 3, name: null }
  ]);

  useEffect(() => {
    async function loadProfiles() {
      const p1 = await localforage.getItem('kuro_user_1_name');
      const p2 = await localforage.getItem('kuro_user_2_name');
      const p3 = await localforage.getItem('kuro_user_3_name');
      const p1_uid = await localforage.getItem('kuro_user_1_uid') || 1;
      const p2_uid = await localforage.getItem('kuro_user_2_uid') || 2;
      const p3_uid = await localforage.getItem('kuro_user_3_uid') || 3;
      
      setProfiles([
        { id: 1, name: p1, uid: p1_uid },
        { id: 2, name: p2, uid: p2_uid },
        { id: 3, name: p3, uid: p3_uid }
      ]);
    }
    loadProfiles();
  }, []);

  const handleSelect = async (profile) => {
    if (!profile.name) {
      const name = prompt(`Ingresa un nombre para el Perfil ${profile.id}:`);
      if (name && name.trim()) {
        const uid = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : uuidv4();
        await localforage.setItem(`kuro_user_${profile.id}_name`, name.trim());
        await localforage.setItem(`kuro_user_${profile.id}_uid`, uid);
        onSelectUser({ id: profile.id, name: name.trim(), uid: uid }, true); // isNew = true
      }
    } else {
      let uid = await localforage.getItem(`kuro_user_${profile.id}_uid`);
      if (!uid) {
        // Upgrade existing profile
        uid = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : uuidv4();
        await localforage.setItem(`kuro_user_${profile.id}_uid`, uid);
      }
      onSelectUser({ id: profile.id, name: profile.name, uid: uid }, false); // isNew = false
    }
  };

  const handleClear = async (e, id) => {
    e.stopPropagation();
    if(confirm(`¿Seguro que deseas borrar el progreso del Perfil ${id}?`)) {
      const uid = await localforage.getItem(`kuro_user_${id}_uid`);
      if (uid) {
        try {
          await deleteDoc(doc(db, 'leaderboard', uid));
          console.log("Firebase sync: deleted user", uid);
        } catch (error) {
          console.error("Firebase sync: error deleting user", error);
        }
      }

      await localforage.removeItem(`kuro_user_${id}_name`);
      await localforage.removeItem(`kuro_user_${id}_level`);
      await localforage.removeItem(`kuro_user_${id}_streak`);
      await localforage.removeItem(`kuro_user_${id}_lives`);
      await localforage.removeItem(`kuro_user_${id}_last_lost`);
      await localforage.removeItem(`kuro_user_${id}_errors`);
      await localforage.removeItem(`kuro_user_${id}_uid`);
      
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: null, uid: null } : p));
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100dvh', 
      backgroundColor: 'var(--kuro-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <img src="/images/kuromi_instructor_1781483016419.png" style={{ height: '120px', mixBlendMode: 'multiply', filter: 'contrast(1.1)', marginBottom: '20px', animation: 'float 3s infinite' }} alt="Kuromi" />
      <h1 style={{ color: 'var(--kuro-dark)', marginBottom: '40px', textAlign: 'center' }}>¿Quién va a jugar?</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
        {profiles.map(p => (
          <div 
            key={p.id} 
            onClick={() => handleSelect(p)}
            style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '20px', 
              border: `3px solid ${p.name ? 'var(--kuro-pink)' : 'var(--kuro-gray)'}`,
              boxShadow: `0 8px 0 ${p.name ? 'var(--kuro-pink)' : 'var(--kuro-gray)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: p.name ? 'var(--kuro-dark)' : 'var(--kuro-gray-shadow)' }}>
              {p.name ? <><img src="/images/kuro_heart.png" alt="User" style={{width: '20px', verticalAlign: 'middle', marginRight: '5px', mixBlendMode: 'multiply'}} /> {p.name}</> : `Crear Perfil ${p.id}`}
            </span>
            {p.name && (
              <button 
                onClick={(e) => handleClear(e, p.id)}
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: 'var(--kuro-incorrect)', 
                  fontSize: '0.9rem',
                  fontWeight: 'bold' 
                }}
              >
                Borrar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
