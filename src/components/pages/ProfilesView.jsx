import React from 'react';
import { motion } from 'framer-motion';

export default function ProfilesView({ profiles, onSelectProfile, onAddProfile }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100dvh', 
      backgroundColor: 'var(--kuro-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: 'var(--kuro-dark)', marginBottom: '40px', fontSize: '2.5rem', textShadow: '2px 2px 0 white' }}>
        ¿Quién conduce hoy?
      </h1>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        justifyContent: 'center',
        maxWidth: '800px'
      }}>
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.uid}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectProfile(profile)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: '120px'
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              backgroundColor: 'white',
              border: '4px solid var(--kuro-pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 8px 0 var(--kuro-pink-shadow)',
              marginBottom: '15px'
            }}>
              <img 
                src={profile.avatar || "/images/kuro_profile_1781502061317.png"} 
                alt={profile.name} 
                style={{ width: '80%', height: '80%', objectFit: 'contain' }} 
              />
            </div>
            <span style={{ 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%'
            }}>
              {profile.name}
            </span>
          </motion.div>
        ))}

        {/* Añadir Nuevo Usuario */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddProfile}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            width: '120px'
          }}
        >
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            border: '4px dashed white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '4rem', color: 'white', lineHeight: '100px' }}>+</span>
          </div>
          <span style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '1.2rem',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Nuevo Piloto
          </span>
        </motion.div>
      </div>
    </div>
  );
}
