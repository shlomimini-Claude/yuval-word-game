import { motion } from 'framer-motion'
import levels from '../data/words'
import { unlockAudio } from '../hooks/useAudio'

export default function StartScreen({ onStart }) {
  const handleLevelClick = (i) => {
    unlockAudio()
    onStart(i)
  }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4 overflow-y-auto">
      {/* Floating stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['⭐', '🌟', '✨', '💫', '🌈'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              top: `${15 + i * 18}%`,
              left: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-7xl md:text-8xl"
      >
        📚
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-7xl font-black text-white drop-shadow-lg text-center leading-tight"
      >
        עולם המילים
        <br />
        <span className="text-accent">של יובל</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl md:text-2xl text-white/80"
      >
        בחרי שלב והתחילי לקרוא! 🎉
      </motion.p>

      {/* Level selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col gap-3 w-full max-w-sm relative z-10"
      >
        {levels.map((level, i) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleLevelClick(i)}
            className="flex items-center gap-3 bg-white/20 backdrop-blur-sm
                       rounded-2xl px-5 py-4 text-white font-bold text-xl md:text-2xl
                       hover:bg-white/30 transition-colors cursor-pointer
                       border-2 border-white/20 shadow-lg"
          >
            <span className="text-3xl">{level.emoji}</span>
            <span className="flex-1 text-right">שלב {level.id} — {level.name}</span>
            <span className="text-sm bg-white/20 rounded-full px-3 py-1">
              {level.words.length} מילים
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
