import { useState, useEffect } from 'react'
import UserSelectView from './components/UserSelectView'
import HomeView from './components/HomeView'
import TheoryView from './components/TheoryView'
import TestView from './components/TestView'
import RecoveryView from './components/RecoveryView'
import useLives from './hooks/useLives'

function App() {
  const [questions, setQuestions] = useState([])
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const [currentLevel, setCurrentLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [failedQuestions, setFailedQuestions] = useState([])
  
  const { lives, decreaseLife, addLife, refillLives, hasLives, maxLives, timeToNextLife } = useLives(currentUser?.id)
  
  const [view, setView] = useState('userSelect') // 'userSelect', 'home', 'theory', 'test', 'recovery'

  useEffect(() => {
    // Load data
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Error loading questions", err))
  }, [])

  // Cargar estado cuando se selecciona un usuario
  useEffect(() => {
    if (currentUser) {
      const savedLevel = localStorage.getItem(`kuro_user_${currentUser.id}_level`)
      const savedStreak = localStorage.getItem(`kuro_user_${currentUser.id}_streak`)
      const savedErrors = localStorage.getItem(`kuro_user_${currentUser.id}_errors`)
      
      setCurrentLevel(savedLevel ? parseInt(savedLevel, 10) : 1)
      setStreak(savedStreak ? parseInt(savedStreak, 10) : 0)
      setFailedQuestions(savedErrors ? JSON.parse(savedErrors) : [])
      
      setView('home')
    }
  }, [currentUser])

  // Guardar estado al cambiar
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`kuro_user_${currentUser.id}_level`, currentLevel)
      localStorage.setItem(`kuro_user_${currentUser.id}_streak`, streak)
      localStorage.setItem(`kuro_user_${currentUser.id}_errors`, JSON.stringify(failedQuestions))
    }
  }, [currentLevel, streak, failedQuestions, currentUser])

  const startLevel = () => {
    if (!hasLives) {
      setView('recovery')
      return;
    }
    setView('theory')
  }

  const finishTheory = () => {
    setView('test')
  }

  const finishLevel = (passed) => {
    if (passed) {
      setCurrentLevel(prev => prev + 1)
      setView('home')
    } else {
      setStreak(0)
      setView('home')
    }
  }

  const getQuestionsForLevel = () => {
    const batchSize = 10
    const start = (currentLevel - 1) * batchSize
    const end = start + batchSize
    return questions.slice(start, end)
  }

  const getLessonForLevel = () => {
    const levelQs = getQuestionsForLevel();
    if (levelQs.length === 0) return null;
    
    // Seleccionar 5 conceptos clave de las preguntas que se van a evaluar en este nivel
    const sample = levelQs.slice(0, 5);
    
    return {
      title: `Píldoras del Nivel ${currentLevel}`,
      slides: sample.map((q, i) => ({
        title: `Concepto Clave ${i + 1}`,
        content: q.feedback || q.options.find(o => o.is_correct)?.text
      }))
    };
  }

  return (
    <>
      {view === 'userSelect' && (
        <UserSelectView 
          onSelectUser={(id, name) => setCurrentUser({ id, name })} 
        />
      )}
      {view === 'home' && (
        <HomeView 
          lives={lives} 
          streak={streak} 
          currentLevel={currentLevel} 
          onStart={startLevel} 
          timeToNextLife={timeToNextLife}
          onChangeUser={() => setView('userSelect')}
          onStudy={() => setView('recovery')}
        />
      )}
      {view === 'theory' && (
        <TheoryView 
          lesson={getLessonForLevel()} 
          onComplete={finishTheory} 
        />
      )}
      {view === 'test' && (
        <TestView 
          questions={getQuestionsForLevel()} 
          lives={lives}
          decreaseLife={decreaseLife}
          streak={streak}
          setStreak={setStreak}
          onFinish={finishLevel} 
          timeToNextLife={timeToNextLife}
          onFailQuestion={(q) => setFailedQuestions(prev => {
            // Evitar duplicados
            if (prev.find(item => item.id === q.id)) return prev;
            return [...prev, q];
          })}
        />
      )}
      {view === 'recovery' && (
        <RecoveryView 
          questions={questions}
          lives={lives}
          maxLives={maxLives}
          onEarnLife={addLife}
          onExit={() => setView('home')}
        />
      )}
    </>
  )
}

export default App
