import React, { useState } from 'react';
import './TheoryView.css';

export default function TheoryView({ lesson, onComplete }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!lesson) {
    return (
      <div className="theory-container" style={{ justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>No hay lección para este nivel.</h2>
        <button className="duo-btn btn-blue" onClick={onComplete} style={{ width: '80%' }}>
          Comenzar Test
        </button>
      </div>
    );
  }

  return (
    <div className="theory-container">
      {/* Header */}
      <h1 className="theory-title">{lesson.title}</h1>

      {/* Kuromi Chat Bubble */}
      <div className="kuromi-chat-container">
        <img 
          src="/images/kuromi_instructor_1781483016419.png" 
          alt="Kuromi Instructora" 
          className="kuromi-avatar"
        />
        <div className="chat-bubble">
          ¡Hola! Antes de empezar el test, quiero enseñarte algo muy importante del Libro del Conductor. 👇
        </div>
      </div>

      {/* Flashcard 3D */}
      <div className="flashcard-scene" onClick={() => setIsFlipped(true)}>
        <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
          {/* Frente de la tarjeta */}
          <div className="flashcard-face flashcard-front">
            <h2 style={{ color: '#1cb0f6', marginBottom: '10px' }}>💡 Concepto Clave</h2>
            <p className="concept-text">{lesson.concept}</p>
            <div className="tap-to-reveal">
              <span className="pulse-animation">👆 Toca para revelar el Tip Secreto</span>
            </div>
          </div>

          {/* Reverso de la tarjeta */}
          <div className="flashcard-face flashcard-back">
            <h2 style={{ color: '#ff4b4b', marginBottom: '10px' }}>⭐ Tip del Libro</h2>
            <p className="tip-text">{lesson.tip}</p>
            <div className="success-icon">✨</div>
          </div>
        </div>
      </div>

      {/* Botón de Acción */}
      <button 
        className={`duo-btn ${isFlipped ? 'btn-green' : 'btn-gray'}`} 
        onClick={onComplete}
        disabled={!isFlipped}
        style={{ marginTop: 'auto' }}
      >
        {isFlipped ? '¡Estoy listo para el Test!' : 'Lee la tarjeta primero'}
      </button>
    </div>
  );
}
