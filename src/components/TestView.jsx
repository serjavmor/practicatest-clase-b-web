import React, { useState } from 'react';
import TopBar from './TopBar';
import useAudio from '../hooks/useAudio';

export default function TestView({ questions, lives, decreaseLife, streak, setStreak, onFinish, timeToNextLife }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { playCorrect, playIncorrect } = useAudio();

  if (!questions || questions.length === 0) {
    return <div>Cargando...</div>;
  }

  const q = questions[currentIndex];
  const progress = currentIndex / questions.length;

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption.is_correct;
    setIsCorrect(correct);
    setShowingFeedback(true);
    
    // Reproducir sonido
    if (correct) {
      playCorrect();
    } else {
      playIncorrect();
    }
  };

  const handleNext = () => {
    if (!isCorrect) {
      decreaseLife();
      setStreak(0);
      if (lives - 1 <= 0) {
        onFinish(false);
        return;
      }
    } else {
      setStreak(streak + 1);
    }

    setShowingFeedback(false);
    setSelectedOption(null);
    
    if (currentIndex + 1 >= questions.length) {
      onFinish(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getButtonClass = (option) => {
    let base = "duo-btn btn-option ";
    if (showingFeedback) {
      if (option.is_correct) return base + "correct";
      if (selectedOption?.text === option.text && !option.is_correct) return base + "incorrect";
    } else {
      if (selectedOption?.text === option.text) return base + "selected";
    }
    return base;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      <TopBar lives={lives} streak={streak} progress={progress} timeToNextLife={timeToNextLife} />
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px 20px' }}>
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
              onClick={() => !showingFeedback && setSelectedOption(option)}
              style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both', animationName: 'slideUp', animationDuration: '0.4s' }}
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
