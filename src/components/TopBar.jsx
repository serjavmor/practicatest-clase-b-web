import React from 'react';

export default function TopBar({ lives, streak, xp, progress, timeToNextLife, onExit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', justifyContent: 'space-between' }}>
      {onExit && (
        <button onClick={onExit} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '10px' }}>
          ✖️
        </button>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--kuro-incorrect)', fontWeight: 'bold' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '4px' }}>🖤</span>
        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{lives}</span>
        {timeToNextLife && (
          <span style={{ fontSize: '0.8rem', color: 'var(--kuro-gray)', backgroundColor: '#fff', padding: '2px 6px', borderRadius: '10px' }}>
            {timeToNextLife}
          </span>
        )}
      </div>
      
      {progress !== undefined && (
        <div style={{ flex: 1, margin: '0 15px', backgroundColor: 'var(--kuro-gray)', height: '16px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ 
            backgroundColor: 'var(--kuro-correct)', 
            height: '100%', 
            width: `${progress * 100}%`,
            transition: 'width 0.3s ease-in-out'
          }}></div>
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {xp !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', color: '#ffb300', fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '4px' }}>🌟</span>
            <span style={{ fontSize: '1.2rem' }}>{xp}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', color: '#ff9600', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '4px' }}>🔥</span>
          <span style={{ fontSize: '1.2rem' }}>{streak}</span>
        </div>
      </div>
      
    </div>
  )
}
