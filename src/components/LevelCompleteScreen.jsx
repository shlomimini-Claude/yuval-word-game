import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import YuvalAvatar from './YuvalAvatar'

export default function LevelCompleteScreen({
  levelNumber,
  levelName,
  levelEmoji,
  totalLevels,
  onNext,
  onChooseLevel,
}) {
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#6c5ce7', '#fd79a8', '#fdcb6e', '#00b894'],
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      {/* Level badge */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="text-8xl"
      >
        {levelEmoji}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-black text-white text-center drop-shadow-lg"
      >
        עברת את שלב {levelNumber}!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl text-white/80 font-bold"
      >
        &quot;{levelName}&quot;
      </motion.p>

      {/* Stars earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="flex gap-2 text-5xl"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ rotate: -30, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}
          >
            ⭐
          </motion.span>
        ))}
      </motion.div>

      {/* Yuval celebrating */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <YuvalAvatar state="success" size="lg" />
      </motion.div>

      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3 items-center"
      >
        {Array.from({ length: totalLevels }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${
              i < levelNumber
                ? 'bg-accent scale-110'
                : i === levelNumber
                  ? 'bg-white/60 animate-pulse'
                  : 'bg-white/30'
            }`}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: 'spring' }}
        className="flex flex-col gap-3 items-center"
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-12 py-5 bg-accent text-3xl font-bold rounded-full
                     text-purple-900 shadow-2xl hover:bg-yellow-300 transition-colors cursor-pointer"
        >
          🚀 לשלב הבא!
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onChooseLevel}
          className="px-8 py-3 bg-white/20 text-xl font-bold rounded-full
                     text-white hover:bg-white/30 transition-colors cursor-pointer"
        >
          📋 בחירת שלב
        </motion.button>
      </motion.div>
    </div>
  )
}
