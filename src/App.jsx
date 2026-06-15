import { useState, useEffect } from 'react'
import localforage from 'localforage'
import confetti from 'canvas-confetti'
import UserSelectView from './components/UserSelectView'
import HomeView from './components/HomeView'
import TheoryView from './components/TheoryView'
import TestView from './components/TestView'
import RecoveryView from './components/RecoveryView'
import OnboardingView from './components/OnboardingView'
import useLives from './hooks/useLives'

function App() {
  const [questions, setQuestions] = useState([])
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const [currentLevel, setCurrentLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [failedQuestions, setFailedQuestions] = useState([])
  const [savedTestIndex, setSavedTestIndex] = useState(0)
  const [xp, setXp] = useState(0)
  
  const { lives, decreaseLife, addLife, refillLives, hasLives, maxLives, timeToNextLife } = useLives(currentUser?.id)
  
  const [view, setView] = useState('userSelect') // 'userSelect', 'onboarding', 'home', 'theory', 'test', 'recovery'

  useEffect(() => {
    // Load data
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Error loading questions", err))
  }, [])

  // Cargar estado cuando se selecciona un usuario
  useEffect(() => {
    async function loadUserData() {
      if (currentUser) {
        const savedLevel = await localforage.getItem(`kuro_user_${currentUser.id}_level`)
        const savedStreak = await localforage.getItem(`kuro_user_${currentUser.id}_streak`)
        const savedErrors = await localforage.getItem(`kuro_user_${currentUser.id}_errors`)
        const savedIndex = await localforage.getItem(`kuro_user_${currentUser.id}_test_index`)
        const savedXp = await localforage.getItem(`kuro_user_${currentUser.id}_xp`)
        
        setCurrentLevel(savedLevel ? parseInt(savedLevel, 10) : 1)
        setStreak(savedStreak ? parseInt(savedStreak, 10) : 0)
        setFailedQuestions(savedErrors ? JSON.parse(savedErrors) : [])
        setSavedTestIndex(savedIndex ? parseInt(savedIndex, 10) : 0)
        setXp(savedXp ? parseInt(savedXp, 10) : 0)
      }
    }
    loadUserData()
  }, [currentUser])

  // Guardar estado al cambiar
  useEffect(() => {
    async function saveUserData() {
      if (currentUser) {
        await localforage.setItem(`kuro_user_${currentUser.id}_level`, currentLevel)
        await localforage.setItem(`kuro_user_${currentUser.id}_streak`, streak)
        await localforage.setItem(`kuro_user_${currentUser.id}_errors`, JSON.stringify(failedQuestions))
        await localforage.setItem(`kuro_user_${currentUser.id}_test_index`, savedTestIndex)
        await localforage.setItem(`kuro_user_${currentUser.id}_xp`, xp)
      }
    }
    saveUserData()
  }, [currentLevel, streak, failedQuestions, savedTestIndex, xp, currentUser])

  const earnXp = (amount) => {
    setXp(prev => prev + amount);
  }

  const handleUserSelect = (id, name, isNew) => {
    setCurrentUser({ id, name });
    if (isNew) {
      setView('onboarding');
    } else {
      setView('home');
    }
  }

  const finishOnboarding = () => {
    setView('home');
  }

  const startLevel = () => {
    if (!hasLives) {
      setView('recovery')
      return;
    }
    if (savedTestIndex > 0) {
      setView('test') // Resume directly
    } else {
      setView('theory')
    }
  }

  const finishTheory = () => {
    setView('test')
  }

  const handlePause = (currentIndex) => {
    setSavedTestIndex(currentIndex);
    setView('home');
  }

  const finishLevel = (passed) => {
    setSavedTestIndex(0) // Reset saved progress on finish
    if (passed) {
      earnXp(50)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ebdff7', '#1a1a1a', '#ffb6c1'] // Kuromi colors
      })
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
          onSelectUser={handleUserSelect} 
        />
      )}
      {view === 'onboarding' && (
        <OnboardingView 
          userName={currentUser?.name}
          onComplete={finishOnboarding}
        />
      )}
      {view === 'home' && (
        <HomeView 
          lives={lives} 
          streak={streak} 
          xp={xp}
          currentLevel={currentLevel} 
          savedTestIndex={savedTestIndex}
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
          xp={xp}
          earnXp={earnXp}
          initialIndex={savedTestIndex}
          onPause={handlePause}
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
          earnXp={earnXp}
          onExit={() => setView('home')}
        />
      )}
    </>
  )
}

export default App
