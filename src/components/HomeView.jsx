import React from 'react';
import TopBar from './TopBar';

export default function HomeView({ lives, streak, currentLevel, onStart }) {
  
  const levels = Array.from({length: 10}, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f7f7f7' }}>
      <TopBar lives={lives} streak={streak} />
      
      <div style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src="/images/kuromi_instructor_1781483016419.png" 
          alt="Kuromi Mascot" 
          style={{ height: '120px', marginBottom: '10px', mixBlendMode: 'multiply', filter: 'contrast(1.1)' }} 
        />
        <div style={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '16px',
          boxShadow: '0 4px 0 var(--duo-gray)',
          fontWeight: 'bold',
          color: 'var(--duo-text)',
          marginBottom: '15px',
          position: 'relative'
        }}>
          ¡Aprobar la Clase B es tu destino!
        </div>
        <h1 style={{ color: 'var(--duo-text)', fontSize: '2rem' }}>Camino al Examen</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }}>
        {levels.map(level => {
          const isCurrent = level === currentLevel;
          const isCompleted = level < currentLevel;
          const isLocked = level > currentLevel;
          
          const xOffset = level % 2 === 0 ? 50 : -50;
          
          let bgColor = 'var(--kuro-gray)';
          let shadowColor = 'var(--kuro-gray-shadow)';
          let icon = '🖤';
          
          if (isCompleted) {
            bgColor = 'var(--kuro-purple)';
            shadowColor = 'var(--kuro-purple-shadow)';
            icon = '⭐';
          } else if (isCurrent) {
            bgColor = 'var(--kuro-pink)';
            shadowColor = 'var(--kuro-pink-shadow)';
            icon = '💀'; /* Calavera de Kuromi para el nivel activo! */
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
                transition: 'transform 0.1s, box-shadow 0.1s',
                animation: isCurrent ? 'pulse-heartbeat 2s infinite' : 'none',
                opacity: isLocked ? 0.8 : 1
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
