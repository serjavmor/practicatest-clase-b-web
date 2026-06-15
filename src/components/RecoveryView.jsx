import React, { useState } from 'react';

export default function RecoveryView({ failedQuestions, onRecover }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!failedQuestions || failedQuestions.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Sin errores registrados</h2>
        <button className="duo-btn btn-primary" onClick={onRecover}>Volver</button>
      </div>
    );
  }

  const currentQ = failedQuestions[currentIndex];

  const handleNext = () => {
    if (currentIndex + 1 >= failedQuestions.length) {
      onRecover();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#ebdff7', padding: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img 
          src="/images/kuromi_sad_1781483036083.png" 
          alt="Kuromi" 
          style={{ height: '80px', mixBlendMode: 'multiply', filter: 'contrast(1.1)', marginRight: '15px' }} 
        />
        <div>
          <h2 style={{ color: 'var(--kuro-incorrect-shadow)', margin: 0 }}>Sala de Estudio</h2>
          <p style={{ margin: 0, color: 'var(--kuro-dark)', fontSize: '0.9rem' }}>Repasa tus errores para recuperar 1 vida.</p>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        padding: '20px',
        border: '3px solid var(--kuro-incorrect)',
        boxShadow: '0 8px 0 var(--kuro-incorrect)',
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        <div style={{ color: 'var(--kuro-gray)', fontSize: '0.9rem', marginBottom: '10px', textAlign: 'right' }}>
          Error {currentIndex + 1} de {failedQuestions.length}
        </div>
        
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--kuro-dark)' }}>{currentQ.question}</h3>
        
        {currentQ.local_image && (
          <img 
            src={`/images/${currentQ.local_image}`} 
            alt="Question" 
            style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto 20px auto' }} 
          />
        )}

        <div style={{ 
          backgroundColor: '#fff0f6', 
          padding: '15px', 
          borderRadius: '12px', 
          borderLeft: '4px solid var(--kuro-pink)' 
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: 'var(--kuro-pink)' }}>📖 Lo que dice el manual:</h4>
          <p style={{ margin: 0, color: 'var(--kuro-dark)', lineHeight: '1.5' }}>{currentQ.feedback}</p>
        </div>
      </div>

      <button className="duo-btn btn-primary" onClick={handleNext}>
        {currentIndex + 1 >= failedQuestions.length ? "Entendido, ¡dame mi vida!" : "Entendido, siguiente"}
      </button>

    </div>
  );
}
