import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import YuvalAvatar from './YuvalAvatar'
import { speakPraise } from '../hooks/useAudio'
import { phrases } from '../config'

export default function SuccessAnimation({ onComplete, wordIndex }) {
  const praise = phrases.visualPraises[wordIndex % phrases.visualPraises.length]

  useEffect(() => {
    speakPraise(wordIndex)
    const fire = (opts) =>
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#b7004d', '#ff7294', '#fde800', '#3fff8b', '#ff5484'],
        ...opts,
      })
    fire({ angle: 60, origin: { x: 0 } })
    fire({ angle: 120, origin: { x: 1 } })
    setTimeout(() => fire({ spread: 120 }), 300)
    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete, wordIndex])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/40 backdrop-blur-sm"
      onClick={onComplete}
    >
      {/* Confetti pieces */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { color: '#ff7294', rotate: 12, x: '20%', y: '10%', w: 12, h: 12 },
          { color: '#fde800', rotate: -45, x: '80%', y: '15%', w: 8, h: 16 },
          { color: '#3fff8b', rotate: 90, x: '10%', y: '60%', w: 10, h: 10 },
          { color: '#b7004d', rotate: 150, x: '45%', y: '5%', w: 8, h: 8 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{ background: c.color, left: c.x, top: c.y, width: c.w, height: c.h, transform: `rotate(${c.rotate}deg)` }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 12 }}
        className="bg-surface-container-lowest w-full max-w-md rounded-[1.5rem] p-10 flex flex-col items-center gap-6 text-center relative"
        style={{ boxShadow: '0 40px 80px rgba(183,0,77,0.2)', transform: 'rotate(-1deg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative floating icons */}
        <div className="absolute -top-10 -left-8 -rotate-12 text-5xl">⭐</div>
        <div className="absolute top-1/4 -right-6 rotate-12 text-4xl">💖</div>

        <YuvalAvatar state="success" size="lg" />

        <div>
          <h2
            className="font-black text-5xl md:text-6xl text-primary text-shadow-heroic leading-none"
            style={{ fontFamily: 'Heebo, sans-serif' }}
          >
            {praise}
          </h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onComplete}
          className="w-full h-16 text-white font-black text-2xl rounded-[1rem] flex items-center justify-center gap-3 button-3d cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #b7004d, #ff7294)', fontFamily: 'Heebo, sans-serif' }}
        >
          <span>המשך</span>
          <span>←</span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
