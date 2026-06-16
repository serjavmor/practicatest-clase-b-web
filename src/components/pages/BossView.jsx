import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '../organisms/TopBar';
import useAudio from '../../hooks/useAudio';

export default function BossView({ questions, lives, decreaseLife, streak, setStreak, xp, earnXp, onPause, onFinish, timeToNextLife, onFailQuestion, updateMissionProgress, checkUnlocks, onStudy }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [bossHp, setBossHp] = useState(10);
  const [timeLeft, setTimeLeft] = useState(15);
  const [bossState, setBossState] = useState('idle'); // 'idle', 'hurt', 'laugh', 'defeated'

  const { playCorrect, playIncorrect } = useAudio();

  useEffect(() => {
    let timer;
    if (!showingFeedback && bossHp > 0 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showingFeedback, bossHp, timeLeft]);

  if (!questions || questions.length === 0) {
    return <div>Cargando...</div>;
  }

  const q = questions[currentIndex];
  // El progreso no es por índice, es la salud del jefe
  const progress = (10 - bossHp) / 10;

  const handleTimeOut = () => {
    setIsCorrect(false);
    setShowingFeedback(true);
    setBossState('laugh');
    playIncorrect();
    if (onFailQuestion) onFailQuestion(q);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption.is_correct;
    setIsCorrect(correct);
    setShowingFeedback(true);
    
    if (correct) {
      playCorrect();
      if (earnXp) earnXp(10);
      setBossHp(prev => prev - 1);
      setBossState(bossHp - 1 <= 0 ? 'defeated' : 'hurt');
    } else {
      playIncorrect();
      setBossState('laugh');
      if (onFailQuestion) onFailQuestion(q);
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
      
      // Reiniciar HP del jefe si fallas
      setBossHp(10);
      setCurrentIndex(0);
    } else {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (updateMissionProgress) {
        updateMissionProgress('streak', newStreak);
      }
      if (checkUnlocks) {
        checkUnlocks({ streak: newStreak });
      }
    }

    if (bossHp <= 0) {
      // Jefe derrotado
      if (earnXp) earnXp(300); // 300 XP extra por derrotar al jefe
      if (updateMissionProgress) updateMissionProgress('boss_defeated', 1);
      if (checkUnlocks) checkUnlocks({ bossDefeatedEvent: 1 });
      onFinish(true); // Gana el nivel
      return;
    }

    setShowingFeedback(false);
    setSelectedOption(null);
    setBossState('idle');
    setTimeLeft(15);
    
    // Mover a la siguiente pregunta al azar o en orden
    if (currentIndex + 1 >= questions.length) {
      // Si se quedó sin preguntas (improbable si hay suficientes), reiniciar índice
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getButtonClass = (option) => {
    let base = "duo-btn btn-option ";
    if (showingFeedback) {
      if (option.is_correct) return base + "correct";
      if (selectedOption?.text === option.text && !option.is_correct) return base + "incorrect shake-animation";
    } else {
      if (selectedOption?.text === option.text) return base + "selected";
    }
    return base;
  };

  const getBossImage = () => {
    if (bossState === 'defeated') return "/images/badtz_defeated.png";
    return "/images/badtz_inspector.png";
  };

  const getBossAnimation = () => {
    if (bossState === 'hurt') return { x: [-10, 10, -10, 10, 0], filter: "brightness(2)" };
    if (bossState === 'laugh') return { y: [-10, 0, -10, 0], transition: { duration: 0.5, repeat: 3 } };
    if (bossState === 'defeated') return { rotate: 180, scale: 0.8, opacity: 0.5 };
    // idle animation
    return { y: [0, -5, 0], transition: { duration: 2, repeat: Infinity } };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', backgroundColor: '#3a2b4b' }}>
      {/* TopBar en modo jefe */}
      <TopBar 
        lives={lives} 
        streak={streak} 
        xp={xp}
        progress={0} // Ocultar progreso normal
        onExit={() => onPause(currentIndex)} 
        onStudy={() => onStudy(currentIndex)}
      />
      
      {/* HUD del Jefe */}
      <div style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ color: 'white', margin: 0 }}>Inspector Badtz</h3>
          <span style={{ color: '#ffb300', fontWeight: 'bold' }}>HP: {bossHp}/10</span>
        </div>
        
        <div style={{ width: '100%', height: '16px', backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '2px solid #555' }}>
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${(bossHp / 10) * 100}%` }}
            transition={{ type: 'spring' }}
            style={{ height: '100%', backgroundColor: bossHp > 3 ? '#ff2a2a' : '#ff0000' }}
          />
        </div>

        {/* Temporizador */}
        <div style={{ marginTop: '15px', color: timeLeft <= 5 ? '#ff2a2a' : 'white', fontSize: '2rem', fontWeight: '900', textShadow: '2px 2px 0 #000' }}>
          ⏳ {timeLeft}s
        </div>

        <motion.img 
          src={getBossImage()}
          alt="Boss"
          animate={getBossAnimation()}
          style={{ height: '120px', marginTop: '10px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px 20px', backgroundColor: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', paddingTop: '20px' }}>
        
        {/* Bloqueo de Power-ups (Visual) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
          <div style={{ padding: '5px 10px', backgroundColor: '#ffe5e5', border: '2px dashed #ff9999', borderRadius: '12px', color: '#cc0000', fontSize: '0.8rem', fontWeight: 'bold' }}>
            🔒 Power-Ups Bloqueados por el Jefe
          </div>
        </div>

        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--kuro-dark)' }}>{q.question}</h2>
        
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
              {bossHp <= 0 ? "¡Jefe Derrotado!" : (isCorrect ? "¡Golpe Directo!" : "¡Ataque del Jefe!")}
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
              <strong>Dato Kuromi:</strong> {q.feedback}
            </div>
          )}

          <button 
            className={`duo-btn ${isCorrect ? 'btn-green' : 'btn-red'}`} 
            onClick={handleNext}
          >
            {bossHp <= 0 ? "Reclamar Botín" : "Continuar Combate"}
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px', borderTop: '2px solid var(--kuro-gray)', backgroundColor: 'white' }}>
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
