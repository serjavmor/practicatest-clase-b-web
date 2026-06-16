import { useState, useEffect } from 'react'
import localforage from 'localforage'
import confetti from 'canvas-confetti'
import LoginView from './components/pages/LoginView'
import HomeView from './components/pages/HomeView'
import TheoryView from './components/pages/TheoryView'
import TestView from './components/pages/TestView'
import RecoveryView from './components/pages/RecoveryView'
import OnboardingView from './components/pages/OnboardingView'
import ShopView from './components/pages/ShopView'
import MissionsView from './components/pages/MissionsView'
import AlbumView from './components/pages/AlbumView'
import useLives from './hooks/useLives'
import useMissions from './hooks/useMissions'
import useAlbum from './hooks/useAlbum'
import useLeaderboard from './hooks/useLeaderboard'
import { auth, onAuthStateChanged, logout } from './services/auth'
import { syncProfileFromCloud, syncProfileToCloud } from './hooks/useCloudSync'

function App() {
  const [questions, setQuestions] = useState([])
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const [currentLevel, setCurrentLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [failedQuestions, setFailedQuestions] = useState([])
  const [savedTestIndex, setSavedTestIndex] = useState(0)
  const [xp, setXp] = useState(0)
  const [inventory, setInventory] = useState({ eraser: 0, shield: 0 })
  
  const { lives, decreaseLife, addLife, refillLives, hasLives, maxLives, timeToNextLife } = useLives(currentUser?.uid)
  const { missions, updateMissionProgress, claimReward } = useMissions(currentUser?.uid)
  const { unlockedCards, checkUnlocks } = useAlbum(currentUser?.uid)
  const { leaderboard, updatePlayerStats } = useLeaderboard();
  
  const [view, setView] = useState('loading') // 'loading', 'login', 'onboarding', 'home', 'theory', 'test', 'recovery', 'shop', 'missions', 'album'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Hydrate from cloud if data exists
        const data = await syncProfileFromCloud(user.uid);
        setCurrentUser({ 
          uid: user.uid, 
          name: user.displayName || (user.isAnonymous ? 'Invitado' : 'Piloto'),
          isAnonymous: user.isAnonymous
        });
        
        setView(prev => {
          if (prev === 'loading' || prev === 'login') {
            if (!data && !user.isAnonymous) return 'onboarding';
            return 'home';
          }
          return prev;
        });
      } else {
        setCurrentUser(null);
        setView('login');
      }
    });
    return () => unsubscribe();
  }, []);

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
      if (currentUser && currentUser.uid) {
        const savedLevel = await localforage.getItem(`kuro_user_${currentUser.uid}_level`)
        const savedStreak = await localforage.getItem(`kuro_user_${currentUser.uid}_streak`)
        const savedErrors = await localforage.getItem(`kuro_user_${currentUser.uid}_errors`)
        const savedIndex = await localforage.getItem(`kuro_user_${currentUser.uid}_test_index`)
        const savedXp = await localforage.getItem(`kuro_user_${currentUser.uid}_xp`)
        const savedInv = await localforage.getItem(`kuro_user_${currentUser.uid}_inventory`)
        
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
      if (currentUser && currentUser.uid) {
        await localforage.setItem(`kuro_user_${currentUser.uid}_level`, currentLevel)
        await localforage.setItem(`kuro_user_${currentUser.uid}_streak`, streak)
        await localforage.setItem(`kuro_user_${currentUser.uid}_errors`, JSON.stringify(failedQuestions))
        await localforage.setItem(`kuro_user_${currentUser.uid}_test_index`, savedTestIndex)
        await localforage.setItem(`kuro_user_${currentUser.uid}_xp`, xp)
        await localforage.setItem(`kuro_user_${currentUser.uid}_inventory`, JSON.stringify(inventory))
        
        // Sync full profile to cloud
        await syncProfileToCloud(currentUser.uid, {
          level: currentLevel,
          streak: streak,
          errors: JSON.stringify(failedQuestions),
          testIndex: savedTestIndex,
          xp: xp,
          inventory: JSON.stringify(inventory),
          name: currentUser.name
        });

        // Update Firebase Leaderboard
        console.log("Firebase sync: updating stats for user", currentUser.uid, "xp:", xp, "level:", currentLevel);
        updatePlayerStats(currentUser.uid, currentUser.name, xp, currentLevel, 'kuro_profile.png');
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
      checkUnlocks({ coinsSpentEvent: cost });
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

  const handleLoginSuccess = (user) => {
    // view routing is now handled safely by onAuthStateChanged
  }

  const handleLogout = async () => {
    await logout();
    // onAuthStateChanged will set view to login
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

  const handleGoToStudy = (currentIndex) => {
    if (currentIndex !== undefined) {
      setSavedTestIndex(currentIndex);
    }
    setView('recovery');
  }

  const finishLevel = (passed) => {
    setSavedTestIndex(0) // Reset saved progress on finish
    if (passed) {
      earnXp(50)
      if (failedQuestions.length === 0) {
        updateMissionProgress('perfect_test', 1)
      }
      checkUnlocks({ 
        levelCompletedEvent: 1, 
        currentLevel: currentLevel + 1,
        perfectLevel: failedQuestions.length === 0 
      })
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
      {view === 'loading' && (
        <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--kuro-bg)' }}>
          <img src="/images/kuromi_instructor_1781483016419.png" style={{ height: '80px', animation: 'float 3s infinite' }} alt="Cargando" />
        </div>
      )}
      {view === 'login' && (
        <LoginView 
          onLoginSuccess={handleLoginSuccess} 
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
          leaderboard={leaderboard}
          onStart={startLevel} 
          timeToNextLife={timeToNextLife}
          onChangeUser={handleLogout}
          onStudy={() => handleGoToStudy()}
          onShop={() => setView('shop')}
          onMissions={() => setView('missions')}
          onAlbum={() => setView('album')}
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
          checkUnlocks={checkUnlocks}
          onStudy={handleGoToStudy}
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
            checkUnlocks({ livesRecoveredEvent: 1 });
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
      {view === 'album' && (
        <AlbumView
          unlockedCards={unlockedCards}
          streak={streak}
          currentLevel={currentLevel}
          onExit={() => setView('home')}
        />
      )}
    </>
  )
}

export default App
