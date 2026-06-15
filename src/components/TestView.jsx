import React, { useState } from 'react';
import TopBar from './TopBar';

export default function TestView({ questions, lives, setLives, streak, setStreak, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

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
  };

  const handleNext = () => {
    if (!isCorrect) {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      if (newLives <= 0) {
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
      <TopBar lives={lives} streak={streak} progress={progress} />
      
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
          backgroundColor: isCorrect ? '#d7ffb8' : '#ffdfdf',
          padding: '20px',
          borderTop: `2px solid ${isCorrect ? 'var(--duo-green)' : 'var(--duo-red)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <img 
              src={isCorrect ? "/images/kuromi_celebrate_1781483026283.png" : "/images/kuromi_sad_1781483036083.png"} 
              style={{ height: '80px', marginRight: '20px' }} 
              alt="Kuromi"
            />
            <h2 style={{ color: isCorrect ? 'var(--duo-green-shadow)' : 'var(--duo-red-shadow)' }}>
              {isCorrect ? "¡Excelente!" : "Incorrecto..."}
            </h2>
          </div>
          <button 
            className={`duo-btn ${isCorrect ? 'btn-primary' : 'btn-red'}`} 
            onClick={handleNext}
          >
            Continuar
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px', borderTop: '2px solid var(--duo-gray)', backgroundColor: 'white' }}>
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
