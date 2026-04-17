import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import YuvalAvatar from './YuvalAvatar'
import { phrases } from '../config'

export default function CompletionScreen({ onRestart, onChooseLevel }) {
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration
    const interval = setInterval(() => {
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#b7004d', '#ff7294', '#fde800', '#3fff8b'],
      })
      if (Date.now() > end) clearInterval(interval)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background px-4 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-32 left-4 w-56 h-56 bg-tertiary-container/30 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 180 }}
        className="bg-surface-container-lowest w-full max-w-md rounded-[1.5rem] p-8 flex flex-col items-center gap-6 text-center"
        style={{ boxShadow: '0 40px 80px rgba(183,0,77,0.2)' }}
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl"
        >
          🏆
        </motion.div>

        <YuvalAvatar state="success" size="md" />

        <div>
          <h1
            className="font-black text-5xl text-primary text-shadow-heroic"
            style={{ fontFamily: 'Heebo, sans-serif' }}
          >
            {phrases.completionTitle}
          </h1>
          <p className="text-on-surface-variant font-bold text-lg mt-2">
            {phrases.completionSubtitle}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          className="w-full h-16 text-white font-black text-xl rounded-[1rem] flex items-center justify-center gap-3 button-3d cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #b7004d, #ff7294)', fontFamily: 'Heebo, sans-serif' }}
        >
          {phrases.playAgain}
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
