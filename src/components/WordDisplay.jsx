import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakEncouragement } from '../hooks/useAudio'
import { phrases } from '../config'

export default function WordDisplay({ word, emoji, index, state }) {
  useEffect(() => {
    if (state === 'incorrect') speakEncouragement(index)
  }, [state, index])

  return (
    <div className="flex flex-col items-center gap-3 w-full px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={word}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-full max-w-lg rounded-[1.5rem] p-8 pt-14 flex flex-col items-center text-center relative overflow-hidden super-shadow"
          style={{ background: 'linear-gradient(135deg, #b7004d 0%, #ff7294 100%)' }}
        >
          {/* Glassy overlays */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

          {/* Floating emoji */}
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl md:text-5xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emoji}
          </motion.div>

          {/* Hebrew sentence */}
          <motion.p
            className="text-white font-black text-3xl md:text-5xl vowel-spacing drop-shadow-lg select-none z-10 text-center"
            style={{ fontFamily: 'Heebo, sans-serif' }}
            animate={state === 'incorrect' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {word}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {state === 'incorrect' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-base font-bold text-on-surface-variant bg-surface-container rounded-full px-5 py-2"
          >
            {phrases.tryAgain}
          </motion.p>
        )}
        {state === 'listening' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm text-on-surface-variant font-medium"
          >
            {phrases.micListeningHint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
