import React, { useState } from 'react';
import TopBar from '../organisms/TopBar';
import { ALBUM_CARDS } from '../../hooks/useAlbum';
import useAudio from '../../hooks/useAudio';

export default function AlbumView({ unlockedCards, streak, currentLevel, onExit }) {
  const { playUnlockCard } = useAudio();
  const [selectedCard, setSelectedCard] = useState(null);

  const totalUnlocked = unlockedCards.length;
  const totalCards = ALBUM_CARDS.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--kuro-bg)' }}>
      <TopBar onExit={onExit} />
      
      <div style={{ textAlign: 'center', padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src="/images/kuro_album.png" 
          alt="Album" 
          style={{ height: '100px', marginBottom: '10px', mixBlendMode: 'multiply' }} 
        />
        <h1 style={{ color: 'var(--duo-text)', fontSize: '2rem', marginBottom: '5px', marginTop: 0 }}>Álbum Coleccionable</h1>
        <div style={{
          backgroundColor: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          fontWeight: 'bold',
          color: 'var(--kuro-dark)',
          border: '2px solid var(--kuro-gray)',
          boxShadow: '0 2px 0 var(--kuro-gray)'
        }}>
          Completado: {totalUnlocked} / {totalCards}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <h2 style={{ color: 'var(--duo-text)', fontSize: '1.2rem', margin: '10px 0', textAlign: 'center' }}>Medallas</h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', justifyContent: 'center' }}>
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

        <h2 style={{ color: 'var(--duo-text)', fontSize: '1.2rem', margin: '10px 0', textAlign: 'center' }}>Cartas Exclusivas</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', alignContent: 'start' }}>
        {ALBUM_CARDS.map((card, index) => {
          const isUnlocked = unlockedCards.includes(card.id);
          
          return (
            <div 
              key={card.id}
              onClick={() => {
                setSelectedCard(card);
                if (isUnlocked) {
                  playUnlockCard();
                }
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: `3px solid ${isUnlocked ? 'var(--kuro-pink)' : 'var(--kuro-gray)'}`,
                boxShadow: `0 4px 0 ${isUnlocked ? 'var(--kuro-pink-shadow)' : 'var(--kuro-gray)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                transform: 'scale(1)',
                animation: isUnlocked ? 'slideUp 0.5s ease backwards' : 'none',
                animationDelay: `${index * 0.1}s`
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Card Image */}
              <div style={{ 
                width: '100%', 
                aspectRatio: '1', 
                backgroundColor: isUnlocked ? '#fff0f5' : '#f0f0f0',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                overflow: 'hidden'
              }}>
                <img 
                  src={card.image} 
                  alt={card.name} 
                  style={{ 
                    width: '80%', 
                    height: '80%', 
                    objectFit: 'contain',
                    mixBlendMode: 'multiply',
                    filter: isUnlocked ? 'contrast(1.1)' : 'grayscale(100%) contrast(0) brightness(1.5)',
                    opacity: isUnlocked ? 1 : 0.4
                  }} 
                />
              </div>
              
              <h3 style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                color: isUnlocked ? 'var(--kuro-dark)' : 'var(--kuro-gray)',
                textAlign: 'center',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isUnlocked ? card.name : '???'}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Modal / Popup for Card Details */}
      {selectedCard && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setSelectedCard(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '25px',
            width: '100%',
            maxWidth: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }} onClick={e => e.stopPropagation()}>
            
            {unlockedCards.includes(selectedCard.id) ? (
              <>
                <div style={{ backgroundColor: '#fff0f5', borderRadius: '16px', padding: '20px', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <img src={selectedCard.image} style={{ width: '150px', height: '150px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                </div>
                <h2 style={{ margin: '0 0 10px 0', color: 'var(--kuro-pink)' }}>{selectedCard.name}</h2>
                <p style={{ textAlign: 'center', color: 'var(--kuro-dark)', margin: '0 0 20px 0', fontWeight: 'bold' }}>
                  {selectedCard.description}
                </p>
                <div style={{ backgroundColor: 'var(--duo-gray)', padding: '8px 15px', borderRadius: '20px', fontSize: '0.8rem', color: 'gray', fontWeight: 'bold' }}>
                  ¡Carta Desbloqueada!
                </div>
              </>
            ) : (
              <>
                <div style={{ backgroundColor: '#f0f0f0', borderRadius: '16px', padding: '20px', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <img src={selectedCard.image} style={{ width: '150px', height: '150px', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'grayscale(100%) contrast(0) brightness(1.5)', opacity: 0.4 }} />
                </div>
                <h2 style={{ margin: '0 0 10px 0', color: 'var(--kuro-gray)' }}>Carta Bloqueada</h2>
                <p style={{ textAlign: 'center', color: 'var(--kuro-gray)', margin: '0 0 20px 0' }}>
                  Sigue jugando para descubrir esta carta.
                </p>
                <div style={{ backgroundColor: '#fff0f5', border: '2px dashed var(--kuro-pink)', padding: '10px 15px', borderRadius: '16px', fontSize: '0.9rem', color: 'var(--kuro-pink)', fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                  Misión: {selectedCard.conditionText}
                </div>
              </>
            )}

            <button onClick={() => setSelectedCard(null)} className="duo-btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
