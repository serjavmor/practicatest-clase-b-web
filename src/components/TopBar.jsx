import React from 'react';

export default function TopBar({ lives, streak, progress }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', justifyContent: 'space-between' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--duo-red)', fontWeight: 'bold' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>❤️</span>
        <span style={{ fontSize: '1.2rem' }}>{lives}</span>
      </div>
      
      {progress !== undefined && (
        <div style={{ flex: 1, margin: '0 20px', backgroundColor: 'var(--duo-gray)', height: '16px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ 
            backgroundColor: 'var(--duo-green)', 
            height: '100%', 
            width: `${progress * 100}%`,
            transition: 'width 0.3s ease-in-out'
          }}></div>
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', color: '#ff9600', fontWeight: 'bold' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🔥</span>
        <span style={{ fontSize: '1.2rem' }}>{streak}</span>
      </div>
      
    </div>
  )
}
