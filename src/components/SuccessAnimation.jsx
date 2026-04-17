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
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6c5ce7', '#fd79a8', '#fdcb6e', '#00b894', '#74b9ff'],
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
      className="fixed inset-0 flex items-center justify-center z-50
                 bg-black/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 12 }}
        className="bg-white/90 backdrop-blur rounded-3xl px-12 py-8 shadow-2xl
                   flex flex-col items-center gap-4"
      >
        <YuvalAvatar state="success" size="lg" />

        <motion.p
          className="text-4xl md:text-5xl font-black text-primary"
          animate={{ scale: [0.8, 1.1, 1] }}
          transition={{ delay: 0.2 }}
        >
          {praise}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
