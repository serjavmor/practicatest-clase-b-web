import React from 'react';
import TopBar from './TopBar';

export default function HomeView({ lives, streak, currentLevel, onStart }) {
  
  const levels = Array.from({length: 10}, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f7f7f7' }}>
      <TopBar lives={lives} streak={streak} />
      
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ color: 'var(--duo-text)', fontSize: '2rem' }}>Camino al Examen</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }}>
        {levels.map(level => {
          const isCurrent = level === currentLevel;
          const isCompleted = level < currentLevel;
          const isLocked = level > currentLevel;
          
          const xOffset = level % 2 === 0 ? 50 : -50;
          
          let bgColor = 'var(--duo-gray)';
          let shadowColor = 'var(--duo-gray-shadow)';
          let icon = '🔒';
          
          if (isCompleted) {
            bgColor = 'var(--duo-green)';
            shadowColor = 'var(--duo-green-shadow)';
            icon = '⭐';
          } else if (isCurrent) {
            bgColor = 'var(--duo-blue)';
            shadowColor = 'var(--duo-blue-shadow)';
            icon = '▶️';
          }

          return (
            <button 
              key={level}
              onClick={() => isCurrent && onStart()}
              disabled={!isCurrent}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: bgColor,
                border: 'none',
                boxShadow: `0 8px 0 ${shadowColor}`,
                transform: `translateX(${xOffset}px) translateY(${isCurrent ? 0 : 0}px)`,
                cursor: isCurrent ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '20px 0',
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseDown={(e) => {
                if (isCurrent) {
                  e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(8px)`;
                  e.currentTarget.style.boxShadow = `0 0px 0 ${shadowColor}`;
                }
              }}
              onMouseUp={(e) => {
                if (isCurrent) {
                  e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(0px)`;
                  e.currentTarget.style.boxShadow = `0 8px 0 ${shadowColor}`;
                }
              }}
            >
              {icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}
