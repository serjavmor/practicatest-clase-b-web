import React from 'react';

export default function TopBar({ lives, streak, xp, progress, timeToNextLife, onExit, onStudy }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', justifyContent: 'space-between' }}>
      {onExit && (
        <button onClick={onExit} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_close.png" alt="Close" style={{ width: '54px', height: '54px', mixBlendMode: 'multiply' }} />
        </button>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--kuro-incorrect)', fontWeight: 'bold' }}>
        <img src="/images/kuro_heart.png" alt="Life" style={{ width: '54px', height: '54px', marginRight: '4px', mixBlendMode: 'multiply' }} />
        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{lives}</span>
        {onStudy && lives < 5 && (
          <button onClick={onStudy} style={{ background: 'var(--kuro-pink)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '8px', boxShadow: '0 2px 0 var(--kuro-pink-shadow)' }}>+</button>
        )}
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
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '15px', padding: '5px 10px', boxShadow: '0 2px 0 #e0e0e0' }}>
            <img src="/images/kuro_coin.png" alt="Kuro Coin" style={{ width: '45px', height: '45px', marginRight: '5px', mixBlendMode: 'multiply' }} />
            <span style={{ fontWeight: 'bold', color: '#ffb300', fontSize: '1.1rem' }}>{xp}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', color: '#ff9600', fontWeight: 'bold' }}>
          <img src="/images/kuro_fire.png" alt="Streak" style={{ width: '54px', height: '54px', marginRight: '4px', mixBlendMode: 'multiply' }} />
          <span style={{ fontSize: '1.2rem' }}>{streak}</span>
        </div>
      </div>
      
    </div>
  )
}
