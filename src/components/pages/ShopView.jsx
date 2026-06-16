import React from 'react';
import confetti from 'canvas-confetti';
import useAudio from '../../hooks/useAudio';
import { motion } from 'framer-motion';

export default function ShopView({ xp, inventory, buyItem, onExit }) {
  const { playBuy } = useAudio();
  
  const handleBuy = (item, cost) => {
    if (buyItem(item, cost)) {
      playBuy();
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#ffb300', '#ebdff7']
      });
    } else {
      // Shake animation effect or simply do nothing since button will be disabled
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#fffdf0', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', marginTop: '10px' }}>
        <h1 style={{ color: 'var(--kuro-dark)', margin: 0, display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>
          <img src="/images/kuro_shop.png" alt="Shop" style={{ width: '30px', height: '30px', marginRight: '10px', mixBlendMode: 'multiply' }} /> Tienda Kuro
        </h1>
        <button onClick={onExit} style={{ background: 'var(--kuro-gray-light)', padding: '8px 15px', borderRadius: '20px', border: 'none', color: 'var(--kuro-dark)', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 0 var(--kuro-gray)' }}>Volver</button>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        padding: '12px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 0 var(--duo-gray)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <span style={{ fontSize: '1.1rem', color: 'var(--kuro-dark)', fontWeight: 'bold', marginRight: '10px' }}>Tu saldo:</span>
        <span style={{ fontSize: '1.3rem', color: '#ffb300', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <img src="/images/kuro_coin.png" alt="Coin" style={{ width: '24px', height: '24px', marginRight: '8px', mixBlendMode: 'multiply' }} /> <span>{xp}</span>
        </span>
      </div>

      <h2 style={{ fontSize: '1.1rem', color: 'var(--kuro-dark)', marginBottom: '10px' }}>Comodines (Power-Ups)</h2>

      <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Eraser */}
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '15px', 
            border: '2px solid var(--kuro-gray)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/kuro_eraser.png" alt="Eraser" style={{ width: '40px', height: '40px', marginRight: '15px', mixBlendMode: 'multiply' }} />
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--kuro-dark)', fontSize: '1.1rem' }}>Borrador Mágico</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--kuro-gray)' }}>Oculta 1 opción incorrecta.</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--kuro-pink)' }}>Tienes: {inventory?.eraser || 0}</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="duo-btn btn-primary"
            style={{ padding: '8px 12px', fontSize: '0.9rem', width: 'auto', backgroundColor: xp >= 50 ? 'var(--kuro-purple)' : 'var(--kuro-gray)' }}
            onClick={() => handleBuy('eraser', 50)}
            disabled={xp < 50}
          >
            <img src="/images/kuro_coin.png" alt="Coin" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '4px' }} /> 50
          </motion.button>
        </motion.div>

        {/* Shield */}
        <motion.div 
          variants={itemVariants}
          style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '15px', 
            border: '2px solid var(--kuro-gray)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/kuro_shield.png" alt="Shield" style={{ width: '40px', height: '40px', marginRight: '15px', mixBlendMode: 'multiply' }} />
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--kuro-dark)', fontSize: '1.1rem' }}>Escudo Kuro</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--kuro-gray)' }}>Te salva de perder una vida.</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--kuro-pink)' }}>Tienes: {inventory?.shield || 0}</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="duo-btn btn-primary"
            style={{ padding: '8px 12px', fontSize: '0.9rem', width: 'auto', backgroundColor: xp >= 100 ? 'var(--kuro-purple)' : 'var(--kuro-gray)' }}
            onClick={() => handleBuy('shield', 100)}
            disabled={xp < 100}
          >
            <img src="/images/kuro_coin.png" alt="Coin" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '4px' }} /> 100
          </motion.button>
        </motion.div>
      </motion.div>

    </div>
  );
}
