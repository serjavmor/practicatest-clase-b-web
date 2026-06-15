import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import TopBar from '../organisms/TopBar';

export default function HomeView({ lives, streak, currentLevel, savedTestIndex, xp, onStart, timeToNextLife, onChangeUser, onStudy, onShop }) {
  
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const users = [];
      for (let i = 1; i <= 3; i++) {
        const name = await localforage.getItem(`kuro_user_${i}_name`);
        if (name) {
          const userXp = await localforage.getItem(`kuro_user_${i}_xp`) || 0;
          users.push({ name, xp: parseInt(userXp, 10) });
        }
      }
      users.sort((a, b) => b.xp - a.xp);
      setLeaderboard(users);
    }
    loadLeaderboard();
  }, [xp]); // Reload when current user xp changes
  
  const levels = Array.from({length: 10}, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--kuro-bg)' }}>
      <TopBar lives={lives} streak={streak} xp={xp} timeToNextLife={timeToNextLife} />
      
      <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', zIndex: 10 }}>
        <button onClick={onShop} style={{ background: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '20px', padding: '5px 12px', color: 'var(--kuro-dark)', fontWeight: 'bold', boxShadow: '0 2px 0 var(--kuro-gray)', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_shop.png" alt="Shop" style={{ width: '40px', height: '40px', marginRight: '6px', mixBlendMode: 'multiply' }} /> Tienda
        </button>
        <button onClick={onChangeUser} style={{ background: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '20px', padding: '4px 10px', color: 'var(--kuro-dark)', fontWeight: 'bold', boxShadow: '0 2px 0 var(--kuro-gray)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_profile.png" alt="User" style={{ width: '36px', height: '36px', marginRight: '4px', mixBlendMode: 'multiply' }} /> Cambiar
        </button>
      </div>
      
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
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            opacity: streak >= 3 ? 1 : 0.4, filter: streak >= 3 ? 'none' : 'grayscale(100%)' 
          }}>
            <div style={{ animation: streak >= 3 ? 'pulse-heartbeat 1.5s infinite' : 'none' }}>
              <img src="/images/kuro_fire.png" alt="Fire" style={{ width: '58px', height: '58px', mixBlendMode: 'multiply' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--kuro-dark)' }}>Racha de 3</span>
          </div>

          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            opacity: currentLevel > 1 ? 1 : 0.4, filter: currentLevel > 1 ? 'none' : 'grayscale(100%)' 
          }}>
            <div>
              <img src="/images/kuro_badge_basic.png" alt="Badge" style={{ width: '58px', height: '58px', mixBlendMode: 'multiply' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--kuro-dark)' }}>Aprobado Básico</span>
          </div>

          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            opacity: currentLevel >= 10 ? 1 : 0.4, filter: currentLevel >= 10 ? 'none' : 'grayscale(100%)' 
          }}>
            <div>
              <img src="/images/kuro_badge_legend.png" alt="Legend" style={{ width: '58px', height: '58px', mixBlendMode: 'multiply' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--kuro-dark)' }}>Leyenda</span>
          </div>
        </div>

        {/* Leaderboard Podio */}
        {leaderboard.length > 0 && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '10px 15px',
            width: '100%',
            maxWidth: '300px',
            boxShadow: '0 4px 0 var(--duo-gray)',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--kuro-dark)', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/kuro_trophy.png" alt="Trophy" style={{ width: '36px', height: '36px', marginRight: '5px', mixBlendMode: 'multiply' }} /> Podio de la Casa
            </h3>
            {leaderboard.map((user, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '5px 0',
                borderBottom: idx < leaderboard.length - 1 ? '1px solid #f0f0f0' : 'none',
                fontWeight: idx === 0 ? 'bold' : 'normal',
                color: idx === 0 ? '#ffb300' : 'var(--kuro-dark)'
              }}>
                <div>
                  <span style={{ marginRight: '10px', width: '36px', display: 'inline-block' }}>
                    {idx === 0 ? <img src="/images/kuro_medal_1.png" style={{width: '36px', mixBlendMode: 'multiply'}}/> : idx === 1 ? <img src="/images/kuro_medal_2.png" style={{width: '36px', mixBlendMode: 'multiply'}}/> : <img src="/images/kuro_medal_3.png" style={{width: '36px', mixBlendMode: 'multiply'}}/>}
                  </span>
                  <span>{user.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/images/kuro_coin.png" style={{ width: '30px', height: '30px', marginRight: '4px', mixBlendMode: 'multiply' }}/>
                  <span>{user.xp}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }}>
        {levels.map(level => {
          const isCurrent = level === currentLevel;
          const isCompleted = level < currentLevel;
          const isLocked = level > currentLevel;
          
          const xOffset = level % 2 === 0 ? 50 : -50;
          
          let icon = <img src="/images/kuro_heart.png" alt="Heart" style={{ width: '90px', height: '90px', opacity: 0.5, filter: 'grayscale(100%)', mixBlendMode: 'multiply' }} />;
          
          if (isCompleted) {
            icon = <img src="/images/kuro_coin.png" alt="Coin" style={{ width: '90px', height: '90px', mixBlendMode: 'multiply' }} />;
          } else if (isCurrent) {
            icon = savedTestIndex > 0 ? <span style={{fontSize: '4.5rem'}}>▶️</span> : <img src="/images/kuro_heart.png" alt="Active" style={{ width: '90px', height: '90px', mixBlendMode: 'multiply' }} />;
          }

          return (
            <button 
              key={level}
              onClick={() => isCurrent && onStart()}
              disabled={!isCurrent}
              style={{
                width: '110px',
                height: '110px',
                backgroundColor: 'transparent',
                border: 'none',
                transform: `translateX(${xOffset}px) translateY(${isCurrent ? 0 : 0}px)`,
                cursor: isCurrent ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px 0',
                transition: 'transform 0.1s',
                animation: isCurrent ? 'pulse-heartbeat 2s infinite' : 'none',
                opacity: isLocked ? 0.8 : 1,
                position: 'relative'
              }}
              onMouseDown={(e) => {
                if (isCurrent) {
                  e.currentTarget.style.transform = `translateX(${xOffset}px) scale(0.9)`;
                }
              }}
              onMouseUp={(e) => {
                if (isCurrent) {
                  e.currentTarget.style.transform = `translateX(${xOffset}px) scale(1)`;
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
