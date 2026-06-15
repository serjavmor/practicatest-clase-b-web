import { useState, useEffect } from 'react'
import HomeView from './components/HomeView'
import TheoryView from './components/TheoryView'
import TestView from './components/TestView'
import useLives from './hooks/useLives'

function App() {
  const [questions, setQuestions] = useState([])
  const [lessons, setLessons] = useState([])
  
  const [currentLevel, setCurrentLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const { lives, decreaseLife, hasLives, timeToNextLife } = useLives()
  
  const [view, setView] = useState('home') // 'home', 'theory', 'test'

  useEffect(() => {
    // Load data
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Error loading questions", err))

    fetch('/data/lessons.json')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error("Error loading lessons", err))
  }, [])

  const startLevel = () => {
    if (!hasLives) {
      alert("¡Te quedaste sin vidas! Espera a que se recarguen.");
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
    if (lessons.length === 0) return null
    const index = (currentLevel - 1) % lessons.length
    return lessons[index]
  }

  return (
    <>
      {view === 'home' && (
        <HomeView 
          lives={lives} 
          streak={streak} 
          currentLevel={currentLevel} 
          onStart={startLevel} 
          timeToNextLife={timeToNextLife}
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
        />
      )}
    </>
  )
}

export default App
