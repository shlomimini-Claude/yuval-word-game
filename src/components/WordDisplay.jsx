import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakEncouragement } from '../hooks/useAudio'
import { phrases } from '../config'

const bgColors = [
  'from-purple-400 to-pink-400',
  'from-sky-400 to-cyan-300',
  'from-orange-400 to-yellow-300',
  'from-green-400 to-emerald-300',
  'from-rose-400 to-pink-300',
]

export default function WordDisplay({ word, emoji, index, state }) {
  const bg = bgColors[index % bgColors.length]
  const isLong = word.length > 8

  useEffect(() => {
    if (state === 'incorrect') {
      speakEncouragement(index)
    }
  }, [state, index])

  return (
    <div className="flex flex-col items-center gap-3 md:gap-5 w-full px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={word}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`relative bg-gradient-to-br ${bg} rounded-3xl
                      px-6 py-4 md:px-14 md:py-10 shadow-2xl max-w-full`}
        >
          {/* Emoji floating above */}
          <motion.div
            className="absolute -top-7 md:-top-10 left-1/2 -translate-x-1/2 text-4xl md:text-6xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emoji}
          </motion.div>

          {/* The sentence */}
          <motion.p
            className={`font-black text-white drop-shadow-lg select-none text-center leading-snug
                        ${isLong ? 'text-3xl md:text-6xl' : 'text-4xl md:text-7xl'}`}
            animate={
              state === 'incorrect'
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
            transition={{ duration: 0.4 }}
          >
            {word}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Encouraging text based on state */}
      <AnimatePresence>
        {state === 'incorrect' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-lg md:text-2xl text-white font-bold bg-white/20
                       backdrop-blur-sm rounded-2xl px-4 py-2"
          >
            {phrases.tryAgain}
          </motion.p>
        )}
        {state === 'listening' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl text-white/80 font-medium"
          >
            {phrases.micListeningHint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
