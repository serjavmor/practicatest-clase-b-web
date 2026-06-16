import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import localforage from 'localforage';
import { Joyride, STATUS } from 'react-joyride';
import TopBar from '../organisms/TopBar';

export default function HomeView({ lives, streak, currentLevel, savedTestIndex, xp, leaderboard, onStart, timeToNextLife, isAnonymous, onChangeUser, onLinkAccount, onStudy, onShop, onMissions, hasCompletedMission, onAlbum, needsTour, onTourComplete }) {
  const [showPodium, setShowPodium] = useState(false);

  const tourSteps = [
    {
      target: 'body',
      content: '¡Bienvenido a Camino al Examen! Soy Kuromi y te daré un tour rápido.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#tour-lives',
      content: 'Aquí tienes tus Vidas. Cada vez que repruebes un examen, perderás una. ¡Si te quedas sin ellas, tendrás que estudiar para recuperarlas!',
      placement: 'bottom',
    },
    {
      target: '#tour-xp',
      content: 'Estas son tus Kuro-Coins. Gánalas pasando niveles o completando misiones. ¡Úsalas en la tienda!',
      placement: 'bottom',
    },
    {
      target: '#tour-streak',
      content: '¡Tu Racha de Fuego! Aumenta cada vez que pasas un nivel sin fallar. ¡Mantenla viva!',
      placement: 'bottom',
    },
    {
      target: '#tour-missions',
      content: 'Aquí puedes ver tus Misiones Diarias y reclamar recompensas.',
      placement: 'right',
    },
    {
      target: '#tour-level',
      content: 'Y aquí están los niveles. ¡Presiona el corazón palpitante para empezar tu primer examen! ¡Suerte!',
      placement: 'top',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      onTourComplete();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--kuro-bg)' }}>
      {needsTour && (
        <Joyride
          steps={tourSteps}
          run={true}
          continuous={true}
          showSkipButton={true}
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: '#ffb300',
              textColor: '#333',
              zIndex: 1000,
            },
            tooltip: {
              borderRadius: '16px',
              fontWeight: 'bold',
            },
            buttonNext: {
              borderRadius: '20px',
              fontWeight: 'bold',
            },
            buttonBack: {
              marginRight: 10,
            }
          }}
          locale={{
            back: 'Atrás',
            close: 'Cerrar',
            last: '¡Empezar!',
            next: 'Siguiente',
            skip: 'Saltar'
          }}
        />
      )}
      <TopBar lives={lives} streak={streak} xp={xp} timeToNextLife={timeToNextLife} onStudy={onStudy} />
      
      <div style={{ position: 'absolute', top: '90px', left: '15px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', zIndex: 10 }}>
        <motion.button id="tour-missions" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onMissions} style={{ position: 'relative', background: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '20px', padding: '5px 12px', color: 'var(--kuro-dark)', fontWeight: 'bold', boxShadow: '0 2px 0 var(--kuro-gray)', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_mission.png" alt="Missions" style={{ width: '40px', height: '40px', marginRight: '6px', mixBlendMode: 'multiply' }} /> Misiones
          {hasCompletedMission && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '15px', height: '15px', backgroundColor: 'var(--kuro-incorrect)', borderRadius: '50%', border: '2px solid white', animation: 'pulse-heartbeat 1s infinite' }} />
          )}
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onAlbum} style={{ background: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '20px', padding: '5px 12px', color: 'var(--kuro-dark)', fontWeight: 'bold', boxShadow: '0 2px 0 var(--kuro-gray)', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_album.png" alt="Album" style={{ width: '40px', height: '40px', marginRight: '6px', mixBlendMode: 'multiply' }} /> Álbum
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowPodium(true)} style={{ background: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '20px', padding: '5px 12px', color: 'var(--kuro-dark)', fontWeight: 'bold', boxShadow: '0 2px 0 var(--kuro-gray)', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_trophy.png" alt="Podio" style={{ width: '40px', height: '40px', marginRight: '6px', mixBlendMode: 'multiply' }} /> Podio
        </motion.button>
      </div>

      <div style={{ position: 'absolute', top: '90px', right: '15px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', zIndex: 10 }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onShop} style={{ background: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '20px', padding: '5px 12px', color: 'var(--kuro-dark)', fontWeight: 'bold', boxShadow: '0 2px 0 var(--kuro-gray)', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_shop.png" alt="Shop" style={{ width: '40px', height: '40px', marginRight: '6px', mixBlendMode: 'multiply' }} /> Tienda
        </motion.button>
        {isAnonymous ? (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onLinkAccount} style={{ backgroundColor: 'var(--kuro-pink)', border: 'none', borderRadius: '15px', padding: '10px 15px', fontWeight: 'bold', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>💾</span>
            Crear Cuenta
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onChangeUser} style={{ backgroundColor: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '15px', padding: '10px 15px', fontWeight: 'bold', color: 'var(--kuro-dark)', cursor: 'pointer' }}>
            <img src="/images/kuro_profile_1781502061317.png" alt="Profile" style={{ width: '20px', verticalAlign: 'middle', marginRight: '5px' }} />
            Salir
          </motion.button>
        )}
      </div>
      
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

      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '40px' }}>
        <motion.button 
          id="tour-level"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
          whileHover={{ scale: 1.1, rotate: 3, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.9, rotate: -3 }}
          onClick={onStart}
          style={{
             width: '180px',
             height: '180px',
             borderRadius: '50%',
             backgroundColor: currentLevel % 5 === 0 ? 'var(--kuro-incorrect)' : 'var(--kuro-dark)',
             border: '8px solid white',
             boxShadow: '0 8px 0 rgba(0,0,0,0.2)',
             color: 'white',
             fontSize: '1.5rem',
             fontWeight: 'bold',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             cursor: 'pointer',
             marginBottom: '40px',
             animation: 'float 3s infinite'
          }}
        >
          {savedTestIndex > 0 ? (
            <>
              <span style={{ fontSize: '3rem', marginBottom: '10px' }}>▶️</span>
              Continuar
            </>
          ) : currentLevel % 5 === 0 ? (
            <>
              <img src="/images/badtz_inspector_1781483016419.png" style={{ height: '70px', marginBottom: '10px', filter: 'drop-shadow(2px 2px 0px white)' }} alt="Boss" />
              ¡Jefe Final!
            </>
          ) : (
            <>
               <img src="/images/kuro_heart.png" style={{ height: '70px', marginBottom: '10px', mixBlendMode: 'screen' }} alt="Play" />
               Nivel {currentLevel}
            </>
          )}
        </motion.button>

        <div style={{ width: '80%', maxWidth: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--kuro-dark)', fontWeight: 'bold' }}>
            <span>Avance de Fase</span>
            <span>{((currentLevel - 1) % 5)} / 4</span>
          </div>
          <div style={{ width: '100%', height: '24px', backgroundColor: 'white', borderRadius: '12px', border: '3px solid var(--kuro-gray)', overflow: 'hidden', boxShadow: '0 4px 0 var(--kuro-gray)' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(((currentLevel - 1) % 5) / 4) * 100}%` }}
              style={{ 
                height: '100%', 
                backgroundColor: 'var(--kuro-pink)', 
                borderRadius: '8px'
              }}
            />
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--duo-text)', marginTop: '10px', fontWeight: 'bold' }}>
            Próximo Jefe: Nivel {Math.ceil(currentLevel/5)*5}
          </p>
        </div>
      </div>

      {/* Modal del Podio */}
      {showPodium && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            exit={{ scale: 0.5, opacity: 0, y: 50, transition: { duration: 0.2 } }}
            style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', width: '90%', maxWidth: '350px', position: 'relative', boxShadow: '0 8px 0 var(--kuro-gray)' }}
          >
            <button onClick={() => setShowPodium(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
              <img src="/images/kuro_close.png" alt="Close" style={{ width: '40px', height: '40px', mixBlendMode: 'multiply' }} />
            </button>
            <h2 style={{ textAlign: 'center', color: 'var(--kuro-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/kuro_trophy.png" alt="Trophy" style={{ width: '40px', height: '40px', marginRight: '10px', mixBlendMode: 'multiply' }} /> 
              Podio
            </h2>
            
            {leaderboard.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaderboard.map((user, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: idx === 0 ? '#fff8e1' : idx === 1 ? '#f5f5f5' : idx === 2 ? '#fff3e0' : 'white',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: idx === 0 ? '#ffb300' : idx === 1 ? '#9e9e9e' : idx === 2 ? '#ff9800' : '#e0e0e0',
                    fontWeight: idx === 0 ? 'bold' : 'normal',
                    color: 'var(--kuro-dark)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '10px', width: '36px', display: 'inline-block' }}>
                        {idx === 0 ? <img src="/images/kuro_medal_1.png" style={{width: '36px', mixBlendMode: 'multiply'}}/> : idx === 1 ? <img src="/images/kuro_medal_2.png" style={{width: '36px', mixBlendMode: 'multiply'}}/> : idx === 2 ? <img src="/images/kuro_medal_3.png" style={{width: '36px', mixBlendMode: 'multiply'}}/> : <span style={{fontSize:'1.2rem', paddingLeft: '10px'}}>{idx + 1}</span>}
                      </span>
                      <span style={{ fontSize: '1.1rem' }}>{user.nickname}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', marginRight: '5px' }}>{user.xp}</span>
                      <img src="/images/kuro_coin.png" style={{ width: '24px', height: '24px', mixBlendMode: 'multiply' }}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--kuro-gray)' }}>Aún no hay puntuaciones.</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
