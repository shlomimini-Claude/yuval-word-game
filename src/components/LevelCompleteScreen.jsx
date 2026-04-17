import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import YuvalAvatar from './YuvalAvatar'
import { phrases } from '../config'

export default function LevelCompleteScreen({
  levelNumber, levelName, levelEmoji, totalLevels,
  onNext, onChooseLevel,
}) {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#b7004d', '#ff7294', '#fde800', '#3fff8b'],
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background px-4 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-32 left-4 w-56 h-56 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="bg-surface-container-lowest w-full max-w-md rounded-[1.5rem] p-8 flex flex-col items-center gap-5 text-center relative"
        style={{ boxShadow: '0 40px 80px rgba(183,0,77,0.15)', transform: 'rotate(-1deg)' }}
      >
        <div className="absolute -top-10 -left-8 -rotate-12 text-5xl">⭐</div>
        <div className="absolute top-1/4 -right-6 rotate-12 text-4xl text-primary">💖</div>

        <div className="text-6xl">{levelEmoji}</div>

        <YuvalAvatar state="success" size="md" />

        <div>
          <h2
            className="font-black text-4xl md:text-5xl text-primary leading-none text-shadow-heroic"
            style={{ fontFamily: 'Heebo, sans-serif' }}
          >
            כל הכבוד!
          </h2>
          <p className="text-on-surface-variant font-bold text-lg mt-1">
            סיימת שלב {levelNumber} — &quot;{levelName}&quot;
          </p>
        </div>

        {/* Stats chips */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-surface-container-low rounded-[1rem] p-4 flex flex-col items-center gap-1 border-b-4 border-surface-container">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-on-surface text-sm">שלב {levelNumber}</span>
          </div>
          <div className="bg-surface-container-low rounded-[1rem] p-4 flex flex-col items-center gap-1 border-b-4 border-surface-container">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-on-surface text-sm">{levelNumber * 10} כוכבים</span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: totalLevels }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < levelNumber ? 'bg-secondary' : i === levelNumber ? 'bg-primary-container' : 'bg-surface-container-high'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="w-full h-16 text-white font-black text-xl rounded-[1rem] flex items-center justify-center gap-3 button-3d cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #b7004d, #ff7294)', fontFamily: 'Heebo, sans-serif' }}
        >
          <span>{phrases.nextLevel}</span>
          <span>←</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onChooseLevel}
          className="w-full h-12 font-bold text-primary text-base rounded-[1rem] bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
        >
          {phrases.chooseLevel}
        </motion.button>
      </motion.div>
    </div>
  )
}
