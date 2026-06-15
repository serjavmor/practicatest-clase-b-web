import React, { useState, useEffect } from 'react';
import useAudio from '../hooks/useAudio';
export default function RecoveryView({ questions, lives, maxLives, onEarnLife, onExit }) {
  const [cardsRead, setCardsRead] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [currentQ, setCurrentQ] = useState(null);
  
  const CARDS_PER_LIFE = 6;

  const { playReward } = useAudio();

  // Seleccionar pregunta aleatoria inicial
  useEffect(() => {
    if (questions && questions.length > 0 && !currentQ) {
      pickRandomQuestion();
    }
  }, [questions]);

  // Temporizador de 10 segundos
  useEffect(() => {
    if (lives >= maxLives) return; // Si ya está lleno, no correr timer
    
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [secondsLeft, lives, maxLives]);

  const pickRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQ(questions[randomIndex]);
    setSecondsLeft(10);
  };

  const handleNext = () => {
    if (secondsLeft > 0) return; // Bloqueado
    
    const newCardsRead = cardsRead + 1;
    
    if (newCardsRead >= CARDS_PER_LIFE) {
      playReward();
      onEarnLife();
      setCardsRead(0);
    } else {
      setCardsRead(newCardsRead);
    }
    
    pickRandomQuestion();
  };

  useEffect(() => {
    if (lives >= maxLives) {
      import('canvas-confetti').then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ebdff7', '#1a1a1a', '#ffb6c1']
        });
      });
    }
  }, [lives, maxLives]);

  if (lives >= maxLives) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#ebdff7', padding: '20px', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src="/images/kuromi_celebrate_1781483026283.png" 
          alt="Kuromi Happy" 
          style={{ height: '150px', mixBlendMode: 'multiply', filter: 'contrast(1.1)', marginBottom: '20px', animation: 'pulse 2s infinite' }} 
        />
        <h2 style={{ color: 'var(--kuro-dark)', textAlign: 'center' }}>¡Vidas al máximo!</h2>
        <p style={{ color: 'var(--kuro-dark)', textAlign: 'center', marginBottom: '30px' }}>Estudiaste lo suficiente por hoy.</p>
        <button className="duo-btn btn-primary" onClick={onExit} style={{ width: '100%', maxWidth: '300px' }}>Volver al Menú</button>
      </div>
    );
  }

  if (!currentQ) return <div>Cargando...</div>;

  const progressPct = (cardsRead / CARDS_PER_LIFE) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#ebdff7', padding: '20px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/images/kuromi_instructor_1781483016419.png" 
            alt="Kuromi" 
            style={{ height: '60px', mixBlendMode: 'multiply', filter: 'contrast(1.1)', marginRight: '10px' }} 
          />
          <div>
            <h2 style={{ color: 'var(--kuro-dark)', margin: 0, fontSize: '1.2rem' }}>Modo Estudio</h2>
            <p style={{ margin: 0, color: 'var(--kuro-pink)', fontWeight: 'bold' }}>Vidas: {lives}/{maxLives}</p>
          </div>
        </div>
        <button onClick={onExit} style={{ background: 'transparent', border: 'none', color: 'var(--kuro-gray)', fontWeight: 'bold', textDecoration: 'underline' }}>Salir</button>
      </div>

      {/* Progress Bar for current life */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--kuro-gray)', fontWeight: 'bold', marginBottom: '5px' }}>
          <span>Progreso de vida:</span>
          <span>{cardsRead} / {CARDS_PER_LIFE} tarjetas</span>
        </div>
        <div style={{ width: '100%', height: '12px', backgroundColor: '#e5e5e5', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: 'var(--kuro-pink)', transition: 'width 0.3s' }}></div>
        </div>
      </div>

      {/* Study Card */}
      <div style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        padding: '20px',
        border: '3px solid var(--kuro-purple)',
        boxShadow: '0 8px 0 var(--kuro-purple)',
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--kuro-dark)' }}>{currentQ.question}</h3>
        
        {currentQ.local_image && (
          <img 
            src={`/images/${currentQ.local_image}`} 
            alt="Question" 
            style={{ width: '100%', maxWidth: '150px', display: 'block', margin: '0 auto 20px auto' }} 
          />
        )}

        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '12px', 
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 5px 0', color: 'var(--kuro-dark)' }}>Respuesta Correcta:</h4>
          <p style={{ margin: 0, color: 'var(--kuro-pink)', fontWeight: 'bold' }}>
            {currentQ.options.find(o => o.is_correct)?.text}
          </p>
        </div>

        {currentQ.feedback && (
          <div style={{ 
            backgroundColor: '#fff0f6', 
            padding: '15px', 
            borderRadius: '12px', 
            borderLeft: '4px solid var(--kuro-pink)' 
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--kuro-pink)' }}>📖 Libro del Conductor:</h4>
            <p style={{ margin: 0, color: 'var(--kuro-dark)', lineHeight: '1.5' }}>{currentQ.feedback}</p>
          </div>
        )}
      </div>

      {/* Control Button */}
      <button 
        className={`duo-btn ${secondsLeft > 0 ? 'btn-gray-outline' : 'btn-primary'}`} 
        onClick={handleNext}
        disabled={secondsLeft > 0}
        style={{ opacity: secondsLeft > 0 ? 0.8 : 1 }}
      >
        {secondsLeft > 0 ? `Lee para continuar... (${secondsLeft}s)` : "Entendido, siguiente"}
      </button>

    </div>
  );
}
