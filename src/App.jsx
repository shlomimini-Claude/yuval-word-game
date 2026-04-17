import { useState, useCallback, useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import SuccessAnimation from './components/SuccessAnimation'
import LevelCompleteScreen from './components/LevelCompleteScreen'
import CompletionScreen from './components/CompletionScreen'
import useSpeechRecognition from './hooks/useSpeechRecognition'
import useGoogleSpeech from './hooks/useGoogleSpeech'
import levels from './data/words'

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function detectMobileDevice() {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

// Preload voices for speech synthesis
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
}

export default function App() {
  const [screen, setScreen] = useState('start')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [levelWords, setLevelWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [wordState, setWordState] = useState('idle')

  const isMobile = useMemo(() => detectMobileDevice(), [])

  // Use Google Speech on mobile, native Web Speech on desktop
  const nativeSpeech = useSpeechRecognition()
  const googleSpeech = useGoogleSpeech()
  const speech = isMobile ? googleSpeech : nativeSpeech

  const {
    isListening,
    isProcessing,
    transcript,
    heardText,
    error,
    startListening,
    stopListening,
    checkMatch,
  } = speech

  const currentWord = levelWords[currentWordIndex]
  const level = levels[currentLevel]

  const startLevel = useCallback((levelIdx) => {
    const lvl = levels[levelIdx]
    setLevelWords(shuffleArray(lvl.words))
    setCurrentWordIndex(0)
    setWordState('idle')
    setScreen('game')
  }, [])

  // Called from StartScreen with level index
  const handleStart = useCallback(
    (levelIdx = 0) => {
      setCurrentLevel(levelIdx)
      startLevel(levelIdx)
    },
    [startLevel]
  )

  const handleRecord = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      setWordState('listening')
      startListening()
    }
  }, [isListening, startListening, stopListening])

  // Parent taps ✅
  const handleParentCorrect = useCallback(() => {
    setWordState('success')
  }, [])

  // Parent taps 🔄
  const handleParentRetry = useCallback(() => {
    setWordState('incorrect')
    const timer = setTimeout(() => setWordState('idle'), 1500)
    return () => clearTimeout(timer)
  }, [])

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
    // MUST reset wordState first so SuccessAnimation unmounts
    setWordState('idle')

    if (currentWordIndex + 1 >= levelWords.length) {
      // Level complete!
      if (currentLevel + 1 >= levels.length) {
        setScreen('complete')
      } else {
        setScreen('levelComplete')
      }
    } else {
      setCurrentWordIndex((i) => i + 1)
    }
  }, [currentWordIndex, levelWords.length, currentLevel])

  const handleNextLevel = useCallback(() => {
    const nextLevel = currentLevel + 1
    setCurrentLevel(nextLevel)
    startLevel(nextLevel)
  }, [currentLevel, startLevel])

  const handleChooseLevel = useCallback(() => {
    setWordState('idle')
    setScreen('start')
  }, [])

  // Show parent mode as fallback only if Google Speech also fails
  const showParentMode = isMobile && !!error && error.includes('מיקרופון')

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
          isProcessing={isProcessing}
          heardText={heardText}
          onRecord={handleRecord}
          onParentCorrect={handleParentCorrect}
          onParentRetry={handleParentRetry}
          onBackToMenu={handleChooseLevel}
          error={error}
          levelNumber={currentLevel + 1}
          levelName={level.name}
          levelEmoji={level.emoji}
          useParentMode={showParentMode}
        />
      )}

      {screen === 'levelComplete' && level && (
        <LevelCompleteScreen
          levelNumber={currentLevel + 1}
          levelName={level.name}
          levelEmoji={level.emoji}
          totalLevels={levels.length}
          onNext={handleNextLevel}
          onChooseLevel={handleChooseLevel}
        />
      )}

      {screen === 'complete' && (
        <CompletionScreen
          onRestart={() => handleStart(0)}
          onChooseLevel={handleChooseLevel}
        />
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
