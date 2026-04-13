import { motion, AnimatePresence } from 'framer-motion'

const bgColors = [
  'from-purple-400 to-pink-400',
  'from-sky-400 to-cyan-300',
  'from-orange-400 to-yellow-300',
  'from-green-400 to-emerald-300',
  'from-rose-400 to-pink-300',
]

export default function WordDisplay({ word, emoji, index, state }) {
  const bg = bgColors[index % bgColors.length]

  return (
    <div className="flex flex-col items-center gap-3 md:gap-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={word}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`relative bg-gradient-to-br ${bg} rounded-3xl px-8 py-5 md:px-20 md:py-12
                      shadow-2xl`}
        >
          {/* Emoji floating above */}
          <motion.div
            className="absolute -top-7 md:-top-10 left-1/2 -translate-x-1/2 text-4xl md:text-6xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emoji}
          </motion.div>

          {/* The word */}
          <motion.span
            className="text-6xl md:text-9xl font-black text-white drop-shadow-lg select-none"
            animate={
              state === 'incorrect'
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
            }
            transition={{ duration: 0.4 }}
          >
            {word}
          </motion.span>
        </motion.div>
      </AnimatePresence>

      {/* Encouraging text based on state */}
      <AnimatePresence>
        {state === 'incorrect' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-lg md:text-3xl text-white font-bold bg-white/20
                       backdrop-blur-sm rounded-2xl px-4 py-2 md:px-6 md:py-3"
          >
            כמעט! נסי שוב, יובל המדליקה! 💪
          </motion.p>
        )}
        {state === 'listening' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl text-white/80 font-medium"
          >
            🎧 מקשיבה...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
