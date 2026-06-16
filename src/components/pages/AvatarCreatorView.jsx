import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKGROUNDS, CHARACTERS, BORDERS } from '../../constants/avatars';
import CompositeAvatar from '../atoms/CompositeAvatar';

export default function AvatarCreatorView({ onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('character');
  const [pilotName, setPilotName] = useState('');
  const [config, setConfig] = useState({
    characterId: CHARACTERS[0].id,
    backgroundId: BACKGROUNDS[0].id,
    borderId: BORDERS[0].id
  });

  const handleSelect = (type, id) => {
    setConfig(prev => ({ ...prev, [type]: id }));
  };

  const renderGrid = (items, type, selectedId) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
      padding: '20px',
      overflowY: 'auto',
      maxHeight: '300px'
    }}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(type, item.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: selectedId === item.id ? 1 : 0.6,
            transform: selectedId === item.id ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '16px',
            backgroundColor: 'white',
            border: selectedId === item.id ? '4px solid var(--kuro-pink)' : '2px solid var(--kuro-gray)',
            boxShadow: selectedId === item.id ? '0 4px 0 var(--kuro-pink-shadow)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <img src={item.src} alt={item.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--duo-text)', textAlign: 'center' }}>
            {item.name}
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#fffdf0' }}>
      
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', borderBottom: '2px solid var(--kuro-gray)', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' }}>❌</button>
          <h2 style={{ margin: 0, color: 'var(--kuro-dark)', fontSize: '1.5rem' }}>Crea tu Piloto</h2>
        </div>
        <input 
          type="text" 
          value={pilotName} 
          onChange={e => setPilotName(e.target.value)} 
          placeholder="Ingresa tu nombre..."
          maxLength={15}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '12px', 
            border: '2px solid var(--kuro-pink)', 
            fontSize: '1.1rem', 
            textAlign: 'center',
            boxSizing: 'border-box',
            fontWeight: 'bold',
            color: 'var(--kuro-dark)'
          }}
        />
      </div>

      {/* Avatar Preview */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0', backgroundColor: 'var(--kuro-bg)' }}>
        <CompositeAvatar config={config} size={160} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--kuro-gray)', backgroundColor: 'white' }}>
        <button 
          onClick={() => setActiveTab('character')}
          style={{ flex: 1, padding: '15px', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '1rem', color: activeTab === 'character' ? 'var(--kuro-pink)' : 'var(--kuro-gray)', borderBottom: activeTab === 'character' ? '4px solid var(--kuro-pink)' : '4px solid transparent' }}
        >
          Personaje
        </button>
        <button 
          onClick={() => setActiveTab('background')}
          style={{ flex: 1, padding: '15px', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '1rem', color: activeTab === 'background' ? 'var(--kuro-pink)' : 'var(--kuro-gray)', borderBottom: activeTab === 'background' ? '4px solid var(--kuro-pink)' : '4px solid transparent' }}
        >
          Fondo
        </button>
        <button 
          onClick={() => setActiveTab('border')}
          style={{ flex: 1, padding: '15px', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '1rem', color: activeTab === 'border' ? 'var(--kuro-pink)' : 'var(--kuro-gray)', borderBottom: activeTab === 'border' ? '4px solid var(--kuro-pink)' : '4px solid transparent' }}
        >
          Borde
        </button>
      </div>

      {/* Grid Content */}
      <div style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'character' && (
            <motion.div key="char" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {renderGrid(CHARACTERS, 'characterId', config.characterId)}
            </motion.div>
          )}
          {activeTab === 'background' && (
            <motion.div key="bg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {renderGrid(BACKGROUNDS, 'backgroundId', config.backgroundId)}
            </motion.div>
          )}
          {activeTab === 'border' && (
            <motion.div key="border" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {renderGrid(BORDERS, 'borderId', config.borderId)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Save */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderTop: '2px solid var(--kuro-gray)' }}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSave({ config, name: pilotName })}
          className="duo-btn"
          style={{ width: '100%', backgroundColor: 'var(--kuro-correct)', borderBottom: '4px solid #4a9e4d', color: 'white', fontSize: '1.2rem', padding: '15px' }}
        >
          ¡Listo!
        </motion.button>
      </div>
    </div>
  );
}
