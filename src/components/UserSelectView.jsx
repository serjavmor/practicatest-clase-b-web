import React, { useState, useEffect } from 'react';

export default function UserSelectView({ onSelectUser }) {
  const [profiles, setProfiles] = useState([
    { id: 1, name: null },
    { id: 2, name: null },
    { id: 3, name: null }
  ]);

  useEffect(() => {
    const savedProfiles = [
      { id: 1, name: localStorage.getItem('kuro_user_1_name') },
      { id: 2, name: localStorage.getItem('kuro_user_2_name') },
      { id: 3, name: localStorage.getItem('kuro_user_3_name') }
    ];
    setProfiles(savedProfiles);
  }, []);

  const handleSelect = (profile) => {
    if (!profile.name) {
      const name = prompt(`Ingresa un nombre para el Perfil ${profile.id}:`);
      if (name && name.trim()) {
        localStorage.setItem(`kuro_user_${profile.id}_name`, name.trim());
        onSelectUser(profile.id, name.trim(), true); // isNew = true
      }
    } else {
      onSelectUser(profile.id, profile.name, false); // isNew = false
    }
  };

  const handleClear = (e, id) => {
    e.stopPropagation();
    if(confirm(`¿Seguro que deseas borrar el progreso del Perfil ${id}?`)) {
      localStorage.removeItem(`kuro_user_${id}_name`);
      localStorage.removeItem(`kuro_user_${id}_level`);
      localStorage.removeItem(`kuro_user_${id}_streak`);
      localStorage.removeItem(`kuro_user_${id}_lives`);
      localStorage.removeItem(`kuro_user_${id}_last_lost`);
      localStorage.removeItem(`kuro_user_${id}_errors`);
      
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: null } : p));
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
              {p.name ? `🖤 ${p.name}` : `Crear Perfil ${p.id}`}
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
