import React from 'react';
import confetti from 'canvas-confetti';

export default function ShopView({ xp, inventory, buyItem, onExit }) {
  
  const handleBuy = (item, cost) => {
    if (buyItem(item, cost)) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#fffdf0', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--kuro-dark)', margin: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>🛒</span> Tienda Kuro
        </h1>
        <button onClick={onExit} style={{ background: 'transparent', border: 'none', color: 'var(--kuro-gray)', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1rem' }}>Volver</button>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        padding: '15px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 0 var(--duo-gray)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <span style={{ fontSize: '1.2rem', color: 'var(--kuro-dark)', fontWeight: 'bold', marginRight: '10px' }}>Tu saldo:</span>
        <span style={{ fontSize: '1.5rem', color: '#ffb300', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '5px' }}>🌟</span> {xp}
        </span>
      </div>

      <h2 style={{ fontSize: '1.2rem', color: 'var(--kuro-dark)', marginBottom: '15px' }}>Comodines (Power-Ups)</h2>

      {/* Eraser */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '20px', 
        marginBottom: '15px',
        border: '2px solid var(--kuro-gray)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginRight: '15px' }}>🪄</div>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: 'var(--kuro-dark)' }}>Borrador Mágico</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--kuro-gray)' }}>Oculta 1 opción incorrecta durante el examen.</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--kuro-pink)' }}>Tienes: {inventory?.eraser || 0}</p>
          </div>
        </div>
        <button 
          className="duo-btn btn-primary"
          style={{ padding: '10px 15px', fontSize: '0.9rem', width: 'auto', backgroundColor: xp >= 50 ? 'var(--kuro-purple)' : 'var(--kuro-gray)' }}
          onClick={() => handleBuy('eraser', 50)}
          disabled={xp < 50}
        >
          🌟 50
        </button>
      </div>

      {/* Shield */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '20px', 
        marginBottom: '15px',
        border: '2px solid var(--kuro-gray)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginRight: '15px' }}>🛡️</div>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: 'var(--kuro-dark)' }}>Escudo Kuro</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--kuro-gray)' }}>Te salva de perder una vida si te equivocas.</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--kuro-pink)' }}>Tienes: {inventory?.shield || 0}</p>
          </div>
        </div>
        <button 
          className="duo-btn btn-primary"
          style={{ padding: '10px 15px', fontSize: '0.9rem', width: 'auto', backgroundColor: xp >= 100 ? 'var(--kuro-purple)' : 'var(--kuro-gray)' }}
          onClick={() => handleBuy('shield', 100)}
          disabled={xp < 100}
        >
          🌟 100
        </button>
      </div>

    </div>
  );
}
