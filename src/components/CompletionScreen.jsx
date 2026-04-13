import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function CompletionScreen({ onRestart, onChooseLevel }) {
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration
    const interval = setInterval(() => {
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#6c5ce7', '#fd79a8', '#fdcb6e', '#00b894'],
      })
      if (Date.now() > end) clearInterval(interval)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 180 }}
        className="text-9xl"
      >
        🏆
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl md:text-6xl font-black text-white text-center drop-shadow-lg"
      >
        כל הכבוד יובל!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-2xl md:text-3xl text-white/90 text-center"
      >
        קראת את כל המילים! את אלופה! 🌟
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="flex flex-col gap-3 items-center mt-4"
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="px-12 py-5 bg-accent text-3xl font-bold rounded-full
                     text-purple-900 shadow-2xl hover:bg-yellow-300 transition-colors cursor-pointer"
        >
          🔄 שחקי שוב!
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
