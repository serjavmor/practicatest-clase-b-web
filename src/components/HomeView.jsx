import React from 'react';
import TopBar from './TopBar';

export default function HomeView({ lives, streak, currentLevel, savedTestIndex, onStart, timeToNextLife, onChangeUser, onStudy }) {
  
  const levels = Array.from({length: 10}, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--kuro-bg)' }}>
      <TopBar lives={lives} streak={streak} timeToNextLife={timeToNextLife} />
      <button onClick={onChangeUser} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--kuro-dark)', fontWeight: 'bold', textDecoration: 'underline' }}>Cambiar Perfil</button>
      
      {lives < 5 && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button onClick={onStudy} className="duo-btn" style={{ backgroundColor: 'var(--kuro-pink)', borderBottom: '4px solid var(--kuro-pink-shadow)', color: 'white', fontSize: '0.9rem', padding: '10px 20px' }}>
            📚 Estudiar (+1 Vida)
          </button>
        </div>
      )}
      
      
      <div style={{ textAlign: 'center', padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <h1 style={{ color: 'var(--duo-text)', fontSize: '2rem', marginBottom: '15px' }}>Camino al Examen</h1>

        {/* Badges Section */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            opacity: streak >= 3 ? 1 : 0.4, filter: streak >= 3 ? 'none' : 'grayscale(100%)' 
          }}>
            <div style={{ fontSize: '2rem', animation: streak >= 3 ? 'pulse-heartbeat 1.5s infinite' : 'none' }}>🔥</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--kuro-dark)' }}>Racha de 3</span>
          </div>

          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            opacity: currentLevel > 1 ? 1 : 0.4, filter: currentLevel > 1 ? 'none' : 'grayscale(100%)' 
          }}>
            <div style={{ fontSize: '2rem' }}>🔰</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--kuro-dark)' }}>Aprobado Básico</span>
          </div>

          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            opacity: currentLevel >= 10 ? 1 : 0.4, filter: currentLevel >= 10 ? 'none' : 'grayscale(100%)' 
          }}>
            <div style={{ fontSize: '2rem' }}>👑</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--kuro-dark)' }}>Leyenda</span>
          </div>
        </div>

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
            icon = savedTestIndex > 0 ? '▶️' : '💀'; /* Cambia a play si está en pausa */
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
                opacity: isLocked ? 0.8 : 1,
                position: 'relative'
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
              {isCurrent && savedTestIndex > 0 && (
                <span style={{ position: 'absolute', top: '-15px', backgroundColor: 'white', color: 'var(--kuro-dark)', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                  En pausa
                </span>
              )}
              {icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}
