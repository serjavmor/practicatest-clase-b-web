import React, { useState } from 'react';
import TopBar from './TopBar';
import useAudio from '../hooks/useAudio';

export default function TestView({ questions, lives, decreaseLife, streak, setStreak, xp, earnXp, inventory, useItem, initialIndex = 0, onPause, onFinish, timeToNextLife, onFailQuestion }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [shieldActive, setShieldActive] = useState(false);
  const [erasedOptions, setErasedOptions] = useState([]);

  const { playCorrect, playIncorrect } = useAudio();

  if (!questions || questions.length === 0) {
    return <div>Cargando...</div>;
  }

  const q = questions[currentIndex];
  const progress = currentIndex / questions.length;

  const handleUseEraser = () => {
    if (inventory?.eraser > 0 && useItem('eraser')) {
      const wrongOptions = q.options.filter(o => !o.is_correct && !erasedOptions.includes(o.text));
      if (wrongOptions.length > 0) {
        // Eliminar una al azar
        const toErase = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        setErasedOptions(prev => [...prev, toErase.text]);
      }
    }
  };

  const handleUseShield = () => {
    if (inventory?.shield > 0 && !shieldActive && useItem('shield')) {
      setShieldActive(true);
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption.is_correct;
    setIsCorrect(correct);
    setShowingFeedback(true);
    
    // Reproducir sonido
    if (correct) {
      playCorrect();
      if (earnXp) earnXp(10);
    } else {
      playIncorrect();
      if (!shieldActive && onFailQuestion) onFailQuestion(q);
    }
  };

  const handleNext = () => {
    if (!isCorrect) {
      if (shieldActive) {
        // El escudo salva la vida y la racha
        setShieldActive(false);
      } else {
        decreaseLife();
        setStreak(0);
        if (lives - 1 <= 0) {
          onFinish(false);
          return;
        }
      }
    } else {
      setStreak(streak + 1);
    }

    setShowingFeedback(false);
    setSelectedOption(null);
    setErasedOptions([]); // Reset eraser
    
    if (currentIndex + 1 >= questions.length) {
      onFinish(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getButtonClass = (option) => {
    if (erasedOptions.includes(option.text)) return "duo-btn btn-option erased"; // Need to add CSS for this
    
    let base = "duo-btn btn-option ";
    if (showingFeedback) {
      if (option.is_correct) return base + "correct";
      if (selectedOption?.text === option.text && !option.is_correct) return base + "incorrect shake-animation";
    } else {
      if (selectedOption?.text === option.text) return base + "selected";
    }
    return base;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      <TopBar 
        lives={lives} 
        streak={streak} 
        xp={xp}
        progress={progress} 
        timeToNextLife={timeToNextLife} 
        onExit={onPause ? () => onPause(currentIndex) : null}
      />
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px 20px' }}>
        
        {/* Power-Ups Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px' }}>
          {inventory?.eraser > 0 && (
            <button 
              onClick={handleUseEraser}
              disabled={showingFeedback || erasedOptions.length >= q.options.length - 1}
              style={{ 
                background: 'white', border: '2px solid var(--kuro-gray)', borderRadius: '12px', padding: '5px 10px', 
                fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', boxShadow: '0 2px 0 var(--kuro-gray)',
                opacity: (showingFeedback || erasedOptions.length >= q.options.length - 1) ? 0.5 : 1
              }}
            >
              <span style={{ marginRight: '5px' }}>🪄</span> {inventory.eraser}
            </button>
          )}
          {inventory?.shield > 0 && (
            <button 
              onClick={handleUseShield}
              disabled={showingFeedback || shieldActive}
              style={{ 
                background: shieldActive ? '#e5ffed' : 'white', 
                border: `2px solid ${shieldActive ? 'var(--kuro-correct)' : 'var(--kuro-gray)'}`, 
                borderRadius: '12px', padding: '5px 10px', 
                fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', 
                boxShadow: `0 2px 0 ${shieldActive ? 'var(--kuro-correct)' : 'var(--kuro-gray)'}`,
                opacity: showingFeedback && !shieldActive ? 0.5 : 1
              }}
            >
              <span style={{ marginRight: '5px' }}>🛡️</span> {inventory.shield}
            </button>
          )}
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{q.question}</h2>
        
        {q.local_image && (
          <img 
            src={`/images/${q.local_image}`} 
            alt="Question" 
            style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} 
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {q.options.map((option, idx) => (
            <button 
              key={idx}
              className={getButtonClass(option)}
              onClick={() => !showingFeedback && !erasedOptions.includes(option.text) && setSelectedOption(option)}
              style={{ 
                animationDelay: `${idx * 0.1}s`, 
                animationFillMode: 'both', 
                animationName: 'slideUp', 
                animationDuration: '0.4s',
                opacity: erasedOptions.includes(option.text) ? 0 : 1,
                pointerEvents: erasedOptions.includes(option.text) ? 'none' : 'auto',
                transition: 'opacity 0.3s'
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {showingFeedback ? (
        <div className="feedback-panel" style={{ 
          position: 'absolute', 
          bottom: 0, 
          width: '100%', 
          backgroundColor: isCorrect ? '#e5ffed' : '#ebdff7',
          padding: '20px',
          borderTop: `3px solid ${isCorrect ? 'var(--kuro-correct)' : 'var(--kuro-incorrect)'}`,
          boxShadow: '0 -4px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img 
              src={isCorrect ? "/images/kuromi_celebrate_1781483026283.png" : "/images/kuromi_sad_1781483036083.png"} 
              style={{ height: '80px', marginRight: '20px', mixBlendMode: 'multiply', filter: 'contrast(1.1)', animation: 'float 2s infinite' }} 
              alt="Kuromi"
            />
            <h2 style={{ color: isCorrect ? 'var(--kuro-correct-shadow)' : 'var(--kuro-incorrect-shadow)' }}>
              {isCorrect ? "¡Excelente!" : "Incorrecto..."}
            </h2>
          </div>
          
          {!isCorrect && q.feedback && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '12px', 
              borderRadius: '16px', 
              marginBottom: '15px',
              borderLeft: '4px solid var(--kuro-incorrect)',
              fontSize: '0.9rem',
              color: 'var(--kuro-dark)',
              fontWeight: 'bold'
            }}>
              <strong>🖤 Dato Kuromi:</strong> {q.feedback}
            </div>
          )}

          <button 
            className={`duo-btn ${isCorrect ? 'btn-green' : 'btn-red'}`} 
            onClick={handleNext}
          >
            Continuar
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px', borderTop: '2px solid var(--kuro-gray)', backgroundColor: 'var(--kuro-bg)' }}>
          <button 
            className="duo-btn btn-primary" 
            onClick={handleCheck}
            disabled={!selectedOption}
          >
            Comprobar
          </button>
        </div>
      )}
    </div>
  )
}
