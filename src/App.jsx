import { useState, useEffect } from 'react'
import localforage from 'localforage'
import confetti from 'canvas-confetti'
import UserSelectView from './components/pages/UserSelectView'
import HomeView from './components/pages/HomeView'
import TheoryView from './components/pages/TheoryView'
import TestView from './components/pages/TestView'
import RecoveryView from './components/pages/RecoveryView'
import OnboardingView from './components/pages/OnboardingView'
import ShopView from './components/pages/ShopView'
import MissionsView from './components/pages/MissionsView'
import useLives from './hooks/useLives'
import useMissions from './hooks/useMissions'

function App() {
  const [questions, setQuestions] = useState([])
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const [currentLevel, setCurrentLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [failedQuestions, setFailedQuestions] = useState([])
  const [savedTestIndex, setSavedTestIndex] = useState(0)
  const [xp, setXp] = useState(0)
  const [inventory, setInventory] = useState({ eraser: 0, shield: 0 })
  
  const { lives, decreaseLife, addLife, refillLives, hasLives, maxLives, timeToNextLife } = useLives(currentUser?.id)
  const { missions, updateMissionProgress, claimReward } = useMissions(currentUser?.id)
  
  const [view, setView] = useState('userSelect') // 'userSelect', 'onboarding', 'home', 'theory', 'test', 'recovery', 'shop', 'missions'

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
        const savedInv = await localforage.getItem(`kuro_user_${currentUser.id}_inventory`)
        
        setCurrentLevel(savedLevel ? parseInt(savedLevel, 10) : 1)
        setStreak(savedStreak ? parseInt(savedStreak, 10) : 0)
        setFailedQuestions(savedErrors ? JSON.parse(savedErrors) : [])
        setSavedTestIndex(savedIndex ? parseInt(savedIndex, 10) : 0)
        setXp(savedXp ? parseInt(savedXp, 10) : 0)
        setInventory(savedInv ? JSON.parse(savedInv) : { eraser: 0, shield: 0 })
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
        await localforage.setItem(`kuro_user_${currentUser.id}_inventory`, JSON.stringify(inventory))
      }
    }
    saveUserData()
  }, [currentLevel, streak, failedQuestions, savedTestIndex, xp, inventory, currentUser])

  const earnXp = (amount) => {
    setXp(prev => prev + amount);
  }

  const buyItem = (item, cost) => {
    if (xp >= cost) {
      setXp(prev => prev - cost);
      setInventory(prev => ({ ...prev, [item]: prev[item] + 1 }));
      return true;
    }
    return false;
  }

  const useItem = (item) => {
    if (inventory[item] > 0) {
      setInventory(prev => ({ ...prev, [item]: prev[item] - 1 }));
      return true;
    }
    return false;
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
      if (failedQuestions.length === 0) {
        updateMissionProgress('perfect_test', 1)
      }
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ebdff7', '#1a1a1a', '#ffb6c1'] // Kuromi colors
      })
      setCurrentLevel(prev => prev + 1)
      updateMissionProgress('play_level', 1)
      setView('home')
    } else {
      setStreak(0)
      updateMissionProgress('play_level', 1)
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
          onShop={() => setView('shop')}
          onMissions={() => setView('missions')}
          hasCompletedMission={missions.some(m => m.completed && !m.claimed)}
        />
      )}
      {view === 'shop' && (
        <ShopView
          xp={xp}
          inventory={inventory}
          buyItem={buyItem}
          onExit={() => setView('home')}
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
          inventory={inventory}
          useItem={useItem}
          initialIndex={savedTestIndex}
          onPause={handlePause}
          onFinish={finishLevel} 
          timeToNextLife={timeToNextLife}
          onFailQuestion={(q) => setFailedQuestions(prev => {
            // Evitar duplicados
            if (prev.find(item => item.id === q.id)) return prev;
            return [...prev, q];
          })}
          updateMissionProgress={updateMissionProgress}
        />
      )}
      {view === 'recovery' && (
        <RecoveryView 
          questions={questions}
          lives={lives}
          maxLives={maxLives}
          onEarnLife={() => {
            addLife();
            updateMissionProgress('recover_life', 1);
          }}
          earnXp={earnXp}
          onExit={() => setView('home')}
        />
      )}
      {view === 'missions' && (
        <MissionsView
          missions={missions}
          claimReward={(missionId) => claimReward(missionId, earnXp)}
          onExit={() => setView('home')}
          xp={xp}
        />
      )}
    </>
  )
}

export default App
