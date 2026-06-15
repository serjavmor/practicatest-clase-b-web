import { useState, useEffect } from 'react'
import HomeView from './components/HomeView'
import TheoryView from './components/TheoryView'
import TestView from './components/TestView'

function App() {
  const [questions, setQuestions] = useState([])
  const [lessons, setLessons] = useState([])
  
  const [currentLevel, setCurrentLevel] = useState(1)
  const [lives, setLives] = useState(5)
  const [streak, setStreak] = useState(0)
  
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
      setLives(5)
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
          setLives={setLives}
          streak={streak}
          setStreak={setStreak}
          onFinish={finishLevel} 
        />
      )}
    </>
  )
}

export default App
