import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import SuccessAnimation from './components/SuccessAnimation'
import LevelCompleteScreen from './components/LevelCompleteScreen'
import CompletionScreen from './components/CompletionScreen'
import useSpeechRecognition from './hooks/useSpeechRecognition'
import levels from './data/words'

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function App() {
  // start | game | levelComplete | complete
  const [screen, setScreen] = useState('start')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [levelWords, setLevelWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [wordState, setWordState] = useState('idle')
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    checkMatch,
  } = useSpeechRecognition()

  const currentWord = levelWords[currentWordIndex]
  const level = levels[currentLevel]

  const startLevel = useCallback(
    (levelIdx) => {
      const lvl = levels[levelIdx]
      setLevelWords(shuffleArray(lvl.words))
      setCurrentWordIndex(0)
      setWordState('idle')
      setScreen('game')
    },
    []
  )

  const handleStart = useCallback(() => {
    setCurrentLevel(0)
    startLevel(0)
  }, [startLevel])

  const handleRecord = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      setWordState('listening')
      startListening()
    }
  }, [isListening, startListening, stopListening])

  // Check result when transcript changes
  useEffect(() => {
    if (!transcript || !currentWord) return

    const isCorrect =
      checkMatch(currentWord.word) || checkMatch(currentWord.plain)
    if (isCorrect) {
      setWordState('success')
    } else {
      setWordState('incorrect')
      const timer = setTimeout(() => setWordState('idle'), 2000)
      return () => clearTimeout(timer)
    }
  }, [transcript, currentWord, checkMatch])

  useEffect(() => {
    if (isListening) {
      setWordState('listening')
    }
  }, [isListening])

  const handleSuccessComplete = useCallback(() => {
    if (currentWordIndex + 1 >= levelWords.length) {
      // Level complete
      if (currentLevel + 1 >= levels.length) {
        setScreen('complete')
      } else {
        setScreen('levelComplete')
      }
    } else {
      setCurrentWordIndex((i) => i + 1)
      setWordState('idle')
    }
  }, [currentWordIndex, levelWords.length, currentLevel])

  const handleNextLevel = useCallback(() => {
    const nextLevel = currentLevel + 1
    setCurrentLevel(nextLevel)
    startLevel(nextLevel)
  }, [currentLevel, startLevel])

  if (!isSupported && screen === 'game') {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="bg-white/90 rounded-3xl p-10 text-center max-w-md">
          <p className="text-6xl mb-4">😔</p>
          <h2 className="text-2xl font-bold text-primary mb-2">
            הדפדפן לא תומך בזיהוי קולי
          </h2>
          <p className="text-lg text-gray-600">
            נסי לפתוח את המשחק בדפדפן Chrome במחשב או בטלפון
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative font-heebo">
      {screen === 'start' && <StartScreen onStart={handleStart} />}

      {screen === 'game' && currentWord && level && (
        <GameBoard
          word={currentWord.word}
          emoji={currentWord.emoji}
          wordIndex={currentWordIndex}
          totalWordsInLevel={levelWords.length}
          state={wordState}
          isListening={isListening}
          onRecord={handleRecord}
          error={error}
          levelNumber={currentLevel + 1}
          levelName={level.name}
          levelEmoji={level.emoji}
        />
      )}

      {screen === 'levelComplete' && level && (
        <LevelCompleteScreen
          levelNumber={currentLevel + 1}
          levelName={level.name}
          levelEmoji={level.emoji}
          totalLevels={levels.length}
          onNext={handleNextLevel}
        />
      )}

      {screen === 'complete' && (
        <CompletionScreen onRestart={handleStart} />
      )}

      <AnimatePresence>
        {wordState === 'success' && (
          <SuccessAnimation
            onComplete={handleSuccessComplete}
            wordIndex={currentWordIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
