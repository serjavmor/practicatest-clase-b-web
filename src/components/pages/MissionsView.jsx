import React from 'react';
import TopBar from '../organisms/TopBar';
import useAudio from '../../hooks/useAudio';
import confetti from 'canvas-confetti';
import AnimatedChest from '../atoms/AnimatedChest';
import { motion } from 'framer-motion';

export default function MissionsView({ missions, claimReward, onExit, xp }) {
  const { playMissionComplete } = useAudio();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--kuro-bg)' }}>
      <TopBar onExit={onExit} xp={xp} />
      
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
          ¡Cumple mis misiones y gana recompensas!
        </div>
        <h1 style={{ color: 'var(--duo-text)', fontSize: '2rem', marginBottom: '15px' }}>Misiones Diarias</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {missions.map(mission => (
          <div key={mission.id} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '15px',
            border: '2px solid var(--kuro-gray)',
            boxShadow: '0 4px 0 var(--kuro-gray)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AnimatedChest size={40} isOpen={mission.claimed} />
                <div>
                  <h3 style={{ margin: 0, color: 'var(--kuro-dark)', fontSize: '1.1rem' }}>{mission.title}</h3>
                  <p style={{ margin: 0, color: 'var(--kuro-gray)', fontSize: '0.9rem' }}>{mission.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#ffb300', fontSize: '1.2rem' }}>
                +{mission.reward} <img src="/images/kuro_coin.png" alt="XP" style={{ width: '24px', height: '24px', marginLeft: '5px', mixBlendMode: 'multiply' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '5px' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--duo-gray)', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ 
                  backgroundColor: mission.completed ? 'var(--kuro-correct)' : '#ffb300', 
                  height: '100%', 
                  width: `${(mission.current / mission.target) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ fontWeight: 'bold', color: 'var(--kuro-dark)', minWidth: '40px', textAlign: 'right' }}>
                {mission.current} / {mission.target}
              </span>
            </div>

            {mission.completed && !mission.claimed && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playMissionComplete();
                  claimReward(mission.id);
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ffb300', '#ebdff7']
                  });
                }}
                className="duo-btn"
                style={{ 
                  marginTop: '5px', 
                  backgroundColor: '#ffb300', 
                  borderBottom: '4px solid #cc8f00', 
                  color: 'white' 
                }}
              >
                ¡Reclamar Recompensa!
              </motion.button>
            )}

            {mission.claimed && (
              <button 
                disabled
                className="duo-btn"
                style={{ 
                  marginTop: '5px', 
                  backgroundColor: 'var(--duo-gray)', 
                  borderBottom: '4px solid #b3b3b3', 
                  color: 'gray' 
                }}
              >
                Reclamada ✅
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
