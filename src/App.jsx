import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import localforage from 'localforage'
import confetti from 'canvas-confetti'
import LoginView from './components/pages/LoginView'
import ProfilesView from './components/pages/ProfilesView'
import HomeView from './components/pages/HomeView'
import TheoryView from './components/pages/TheoryView'
import TestView from './components/pages/TestView'
import RecoveryView from './components/pages/RecoveryView'
import ShopView from './components/pages/ShopView'
import MissionsView from './components/pages/MissionsView'
import AlbumView from './components/pages/AlbumView'
import BossView from './components/pages/BossView'
import AvatarCreatorView from './components/pages/AvatarCreatorView'
import useLives from './hooks/useLives'
import useMissions from './hooks/useMissions'
import useAlbum from './hooks/useAlbum'
import useLeaderboard from './hooks/useLeaderboard'
import { auth, onAuthStateChanged, logout } from './services/auth'
import { syncProfileFromCloud, syncProfileToCloud } from './hooks/useCloudSync'
import { useGameStore } from './store/useStore'

function App() {
  const [questions, setQuestions] = useState([])
  const [needsTour, setNeedsTour] = useState(false)
  const [deviceProfiles, setDeviceProfiles] = useState([])
  
  const currentUser = useGameStore(s => s.currentUser)
  const setCurrentUser = useGameStore(s => s.setCurrentUser)
  const currentLevel = useGameStore(s => s.currentLevel)
  const setCurrentLevel = useGameStore(s => s.setCurrentLevel)
  const streak = useGameStore(s => s.streak)
  const setStreak = useGameStore(s => s.setStreak)
  const failedQuestions = useGameStore(s => s.failedQuestions)
  const setFailedQuestions = useGameStore(s => s.setFailedQuestions)
  const savedTestIndex = useGameStore(s => s.savedTestIndex)
  const setSavedTestIndex = useGameStore(s => s.setSavedTestIndex)
  const xp = useGameStore(s => s.xp)
  const setXp = useGameStore(s => s.setXp)
  const earnXpStore = useGameStore(s => s.earnXp)
  const inventory = useGameStore(s => s.inventory)
  const setInventory = useGameStore(s => s.setInventory)
  const view = useGameStore(s => s.view)
  const setView = useGameStore(s => s.setView)
  
  const { lives, decreaseLife, addLife, refillLives, hasLives, maxLives, timeToNextLife } = useLives(currentUser?.uid)
  const { missions, updateMissionProgress, claimReward } = useMissions(currentUser?.uid)
  const { unlockedCards, checkUnlocks } = useAlbum(currentUser?.uid)
  const { leaderboard, updatePlayerStats } = useLeaderboard();

  // Load device profiles initially
  useEffect(() => {
    async function initProfiles() {
      const savedProfiles = await localforage.getItem('kuro_device_profiles') || [];
      setDeviceProfiles(savedProfiles);
      
      // Si hay perfiles y no estamos en medio de un login forzado, mostramos selector
      if (savedProfiles.length > 0) {
        setView('profiles');
      }
    }
    initProfiles();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // We use Promise.race to avoid hanging the UI if network is blocked
        const syncPromise = syncProfileFromCloud(user.uid);
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 4000));
        
        let data = await Promise.race([syncPromise, timeoutPromise]);
        if (data === 'timeout') {
            console.warn('Sync timed out, continuing with local data');
            data = null;
        }
        
        const newProfile = { 
          uid: user.uid, 
          name: user.displayName || (user.isAnonymous ? 'Invitado' : 'Piloto'),
          isAnonymous: user.isAnonymous,
          avatar: '/images/kuro_profile.png'
        };

        // Add to device profiles if not there
        setDeviceProfiles(prev => {
          const exists = prev.find(p => p.uid === user.uid);
          if (!exists) {
            const updated = [...prev, newProfile];
            localforage.setItem('kuro_device_profiles', updated);
            return updated;
          }
          return prev;
        });
        
        // No auto-login to home, we wait for profile selection if we are in 'profiles' view
        // Unless it's a new login/register (view === 'login')
        setView(prev => {
          if (prev === 'loading') {
            return 'profiles'; // Or home if we decided to skip
          }
          if (prev === 'login') {
            setCurrentUser(newProfile);
            return 'home';
          }
          return prev;
        });
      } else {
        // Only go to login if we don't have profiles
        setView(prev => {
          if (prev === 'loading') return 'profiles'; // It will render login if deviceProfiles is empty
          return prev;
        });
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
        
        // Auto-complete tour if user has already progressed
        const hasProgressed = (savedLevel && parseInt(savedLevel, 10) > 1) || (savedXp && parseInt(savedXp, 10) > 0);
        if (hasProgressed) {
          setNeedsTour(false);
          await localforage.setItem(`kuro_user_${currentUser.uid}_onboarding`, true);
        }
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
    earnXpStore(amount);
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

  const handleLoginSuccess = async (user) => {
    // handled by onAuthStateChanged, which will set view='home' if we are in 'login'
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setView('profiles');
  }

  const handleSelectProfile = async (profile) => {
    setCurrentUser(profile);
    
    // Check onboarding for this profile
    const hasSeenOnboarding = await localforage.getItem(`kuro_user_${profile.uid}_onboarding`);
    if (!hasSeenOnboarding) {
      setNeedsTour(true);
    } else {
      setNeedsTour(false);
    }
    
    setView('home');
  }

  const handleSaveNewLocalProfile = async (data) => {
    const profile = {
      uid: 'guest_' + Date.now() + Math.random().toString(36).substring(7),
      name: data.name || 'Piloto ' + Math.floor(Math.random() * 1000),
      isAnonymous: true,
      avatarConfig: data.config
    };
    const updated = [...deviceProfiles, profile];
    setDeviceProfiles(updated);
    await localforage.setItem('kuro_device_profiles', updated);
    handleSelectProfile(profile);
  };

  const finishTour = async () => {
    if (currentUser && currentUser.uid) {
      await localforage.setItem(`kuro_user_${currentUser.uid}_onboarding`, true);
      syncProfileToCloud(currentUser.uid, { onboarding: true });
    }
    setNeedsTour(false);
  }

  const startLevel = () => {
    if (!hasLives) {
      setView('recovery')
      return;
    }
    
    // Si inicia un nivel, terminamos el tour automáticamente para que se guarde el progreso del onboarding
    if (needsTour) {
      finishTour();
    }
    
    // Nivel Jefe (Cada 5 niveles)
    if (currentLevel % 5 === 0) {
      setView('boss');
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

  const pageVariants = {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -40, scale: 1.02 }
  };
  
  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    mass: 0.8
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {view === 'loading' && (
          <motion.div key="loading" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--kuro-bg)' }}>
            <img src="/images/kuromi_instructor_1781483016419.png" style={{ height: '80px', animation: 'float 3s infinite' }} alt="Cargando" />
          </motion.div>
        )}
        {view === 'profiles' && deviceProfiles.length > 0 && (
          <motion.div key="profiles" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <ProfilesView 
              profiles={deviceProfiles} 
              onSelectProfile={handleSelectProfile}
              onAddProfile={(action) => setView(action === 'login' ? 'login' : 'avatar_creator')}
            />
          </motion.div>
        )}
        {view === 'avatar_creator' && (
          <motion.div key="avatar_creator" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <AvatarCreatorView 
              onSave={handleSaveNewLocalProfile} 
              onCancel={() => setView(deviceProfiles.length > 0 ? 'profiles' : 'login')} 
            />
          </motion.div>
        )}
        {(view === 'login' || (view === 'profiles' && deviceProfiles.length === 0)) && (
          <motion.div key="login" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <LoginView 
              onLoginSuccess={handleLoginSuccess} 
              onGuestLogin={() => setView('avatar_creator')}
            />
          </motion.div>
        )}
        {view === 'link_account' && (
          <motion.div key="link_account" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <LoginView 
              isLinking={true}
              onLoginSuccess={() => setView('home')} 
              onCancel={() => setView('home')}
            />
          </motion.div>
        )}
        {view === 'home' && (
          <motion.div key="home" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <HomeView 
              lives={lives} 
              streak={streak} 
              xp={xp}
              currentLevel={currentLevel} 
              savedTestIndex={savedTestIndex}
              leaderboard={leaderboard}
              currentUser={currentUser}
              onStart={startLevel} 
              timeToNextLife={timeToNextLife}
              isAnonymous={currentUser?.isAnonymous}
              onChangeUser={handleLogout}
              onLinkAccount={() => setView('link_account')}
              onStudy={() => handleGoToStudy()}
              onShop={() => setView('shop')}
              onMissions={() => setView('missions')}
              onAlbum={() => setView('album')}
              hasCompletedMission={missions.some(m => m.completed && !m.claimed)}
              needsTour={needsTour}
              onTourComplete={finishTour}
            />
          </motion.div>
        )}
        {view === 'shop' && (
          <motion.div key="shop" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <ShopView
              xp={xp}
              inventory={inventory}
              buyItem={buyItem}
              onExit={() => setView('home')}
            />
          </motion.div>
        )}
        {view === 'theory' && (
          <motion.div key="theory" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <TheoryView 
              lesson={getLessonForLevel()} 
              onComplete={finishTheory} 
            />
          </motion.div>
        )}
        {view === 'test' && (
          <motion.div key="test" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
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
          </motion.div>
        )}
        {view === 'recovery' && (
          <motion.div key="recovery" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
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
          </motion.div>
        )}
        {view === 'missions' && (
          <motion.div key="missions" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <MissionsView
              missions={missions}
              claimReward={(missionId) => claimReward(missionId, earnXp)}
              onExit={() => setView('home')}
              xp={xp}
            />
          </motion.div>
        )}
        {view === 'album' && (
          <motion.div key="album" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <AlbumView
              unlockedCards={unlockedCards}
              streak={streak}
              currentLevel={currentLevel}
              onExit={() => setView('home')}
            />
          </motion.div>
        )}
        {view === 'boss' && (
          <motion.div key="boss" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <BossView
              questions={getQuestionsForLevel()} 
              lives={lives}
              decreaseLife={decreaseLife}
              streak={streak}
              setStreak={setStreak}
              xp={xp}
              earnXp={earnXp}
              onPause={handlePause}
              onFinish={finishLevel} 
              timeToNextLife={timeToNextLife}
              onFailQuestion={(q) => setFailedQuestions(prev => {
                if (prev.find(item => item.id === q.id)) return prev;
                return [...prev, q];
              })}
              updateMissionProgress={updateMissionProgress}
              checkUnlocks={checkUnlocks}
              onStudy={handleGoToStudy}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
