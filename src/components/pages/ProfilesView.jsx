import React from 'react';
import { motion } from 'framer-motion';
import localforage from 'localforage';
import CompositeAvatar from '../atoms/CompositeAvatar';

export default function ProfilesView({ profiles, onSelectProfile, onAddProfile }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };
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

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '30px',
          justifyContent: 'center',
          maxWidth: '800px'
        }}
      >
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.uid}
            variants={item}
            whileHover={{ scale: 1.1, rotate: 2, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
            whileTap={{ scale: 0.9 }}
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
              {profile.avatarConfig ? (
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
                  <CompositeAvatar config={profile.avatarConfig} size={100} />
                </div>
              ) : (
                <img 
                  src={profile.avatar || "/images/kuro_profile.png"} 
                  alt={profile.name} 
                  style={{ width: '80%', height: '80%', objectFit: 'contain' }} 
                />
              )}
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
          variants={item}
          whileHover={{ scale: 1.1, rotate: -2, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddProfile('avatar')}
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
      </motion.div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
        <button 
          onClick={() => onAddProfile('login')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--kuro-pink)', 
            textDecoration: 'underline', 
            cursor: 'pointer', 
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          ¿Ya tienes cuenta en la nube? Inicia Sesión
        </button>

        <button 
          onClick={() => {
            if (window.confirm("¿Seguro que quieres borrar todos los perfiles y progreso de este dispositivo?")) {
              localforage.clear().then(() => window.location.reload());
            }
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--kuro-gray)', 
            textDecoration: 'underline', 
            cursor: 'pointer', 
            fontSize: '1rem'
          }}
        >
          Borrar Datos Locales
        </button>
      </div>
    </div>
  );
}
