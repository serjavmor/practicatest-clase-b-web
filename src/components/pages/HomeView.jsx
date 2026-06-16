import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import localforage from 'localforage';
import { Joyride, STATUS } from 'react-joyride';
import TopBar from '../organisms/TopBar';
import CompositeAvatar from '../atoms/CompositeAvatar';

export default function HomeView({ lives, streak, currentLevel, savedTestIndex, xp, leaderboard, onStart, timeToNextLife, isAnonymous, onChangeUser, onLinkAccount, onStudy, onShop, onMissions, hasCompletedMission, onAlbum, needsTour, onTourComplete, currentUser }) {
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
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
          <img src="/images/kuro_mission.png" alt="Misiones" style={{ width: '30px', height: '30px' }} />
          <span>Aquí tienes tus Misiones Diarias. ¡Gana XP y recompensas completándolas!</span>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '#tour-album',
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
          <img src="/images/kuro_album.png" alt="Álbum" style={{ width: '30px', height: '30px' }} />
          <span>Este es tu Álbum. Usa tus recompensas para coleccionar cartas.</span>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '#tour-podium',
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
          <img src="/images/kuro_trophy.png" alt="Podio" style={{ width: '30px', height: '30px' }} />
          <span>Revisa el Podio para ver quiénes son los mejores pilotos de la semana.</span>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '#tour-shop',
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
          <img src="/images/kuro_shop.png" alt="Tienda" style={{ width: '30px', height: '30px' }} />
          <span>En la Tienda puedes comprar vidas extra y ayudas para tus exámenes.</span>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '#tour-account',
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
          <img src="/images/kuro_account.png" alt="Cuenta" style={{ width: '30px', height: '30px' }} />
          <span>Guarda tu progreso creando una cuenta, o cambia de perfil desde aquí.</span>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '#tour-level',
      content: '⚔️ Y este es el botón de Batalla. ¡Presiónalo para empezar tu próximo examen y subir de nivel! ¡Demuestra lo que sabes!',
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
      
      <div style={{ position: 'absolute', top: '90px', left: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', zIndex: 10 }}>
        <motion.button id="tour-missions" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onMissions} style={{ position: 'relative', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/kuro_mission.png" alt="Misiones" style={{ width: '45px', height: '45px', mixBlendMode: 'multiply' }} />
          {hasCompletedMission && (
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', backgroundColor: 'var(--kuro-incorrect)', borderRadius: '50%', border: '2px solid white', animation: 'pulse-heartbeat 1s infinite' }} />
          )}
        </motion.button>
        <motion.button id="tour-album" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onAlbum} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/kuro_album.png" alt="Álbum" style={{ width: '45px', height: '45px', mixBlendMode: 'multiply' }} />
        </motion.button>
        <motion.button id="tour-podium" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowPodium(true)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/kuro_trophy.png" alt="Podio" style={{ width: '45px', height: '45px', mixBlendMode: 'multiply' }} />
        </motion.button>
      </div>

      <div style={{ position: 'absolute', top: '90px', right: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', zIndex: 10 }}>
        <motion.button id="tour-shop" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onShop} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/kuro_shop.png" alt="Tienda" style={{ width: '45px', height: '45px', mixBlendMode: 'multiply' }} />
        </motion.button>
        <motion.button id="tour-account" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={isAnonymous ? onLinkAccount : onChangeUser} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isAnonymous ? <img src="/images/kuro_account.png" alt="Crear Cuenta" style={{ width: '45px', height: '45px', mixBlendMode: 'multiply' }} /> : <img src="/images/kuro_profile.png" alt="Salir" style={{ width: '45px', height: '45px' }} />}
        </motion.button>
      </div>
      
      <div style={{ textAlign: 'center', padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src="/images/kuromi_instructor_1781483016419.png" 
          alt="Kuromi Mascot" 
          style={{ height: '120px', marginBottom: '10px', mixBlendMode: 'multiply', filter: 'contrast(1.1)' }} 
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '40px' }}>
        <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '16px',
            boxShadow: '0 4px 0 var(--kuro-gray)',
            fontWeight: 'bold',
            color: 'var(--duo-text)',
            marginBottom: '10px',
            position: 'relative'
          }}>
            ¡Aprobar la Clase B es tu destino!
          </div>
          <h1 style={{ color: 'var(--duo-text)', fontSize: '2rem', margin: 0 }}>Camino al Examen</h1>
        </div>

        <motion.button 
          id="tour-level"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
          whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          style={{
             width: '90%',
             maxWidth: '350px',
             backgroundColor: currentLevel % 5 === 0 ? 'var(--kuro-incorrect)' : 'var(--kuro-pink)',
             border: '4px solid white',
             borderRadius: '24px',
             boxShadow: currentLevel % 5 === 0 
               ? '0 10px 0 var(--kuro-incorrect-shadow), 0 15px 20px rgba(0,0,0,0.2)' 
               : '0 10px 0 var(--kuro-pink-shadow), 0 15px 20px rgba(0,0,0,0.2)',
             padding: '20px 20px 15px 20px',
             display: 'flex',
             flexDirection: 'column',
             position: 'relative',
             overflow: 'hidden',
             cursor: 'pointer',
             animation: 'float 3s infinite'
          }}
        >
          {/* Top text */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '2.5rem', 
              fontWeight: '900', 
              textShadow: '2px 2px 0px rgba(0,0,0,0.3), -1px -1px 0 rgba(0,0,0,0.3), 1px -1px 0 rgba(0,0,0,0.3), -1px 1px 0 rgba(0,0,0,0.3), 1px 1px 0 rgba(0,0,0,0.3)', 
              margin: 0, 
              textTransform: 'uppercase', 
              letterSpacing: '2px' 
            }}>
              {savedTestIndex > 0 ? 'Continuar' : currentLevel % 5 === 0 ? '¡Jefe Final!' : 'Batalla'}
            </h2>
          </div>

          {/* Inner Stats Box */}
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            borderRadius: '16px', 
            padding: '10px 15px', 
            display: 'flex', 
            alignItems: 'center',
            gap: '15px',
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)'
          }}>
             {/* Left side: Avatar */}
             <div style={{ width: '60px', height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentLevel % 5 === 0 ? (
                  <img src="/images/badtz_inspector_1781483016419.png" style={{ height: '60px', filter: 'drop-shadow(2px 2px 0px white)' }} alt="Boss" />
                ) : currentUser?.avatarConfig ? (
                  <div style={{ transform: 'scale(0.8)', pointerEvents: 'none' }}>
                    <CompositeAvatar config={currentUser.avatarConfig} size={80} />
                  </div>
                ) : (
                  <img src="/images/kuro_heart.png" style={{ height: '50px', mixBlendMode: 'screen' }} alt="Play" />
                )}
             </div>

             {/* Right side: Stats */}
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,0.5)', marginBottom: '5px' }}>
                  Nivel {currentLevel}
                </div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ flex: 1, height: '18px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '9px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)' }}>
                     <div style={{ width: `${(((currentLevel - 1) % 5) / 4) * 100}%`, height: '100%', backgroundColor: '#fff', borderRadius: '5px' }} />
                   </div>
                   <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>
                     {((currentLevel - 1) % 5)}/4
                   </span>
                </div>
             </div>
          </div>
        </motion.button>
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
