import { motion } from 'framer-motion'

export default function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
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
        className="text-8xl"
      >
        📚
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-5xl md:text-7xl font-black text-white drop-shadow-lg text-center leading-tight"
      >
        עולם המילים
        <br />
        <span className="text-accent">של יובל</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-white/80"
      >
        בואי נקרא מילים ביחד! 🎉
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: 'spring' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="mt-4 px-16 py-6 bg-accent text-4xl font-bold rounded-full
                   text-purple-900 shadow-2xl animate-pulse-glow
                   hover:bg-yellow-300 transition-colors cursor-pointer"
      >
        🚀 יאללה!
      </motion.button>
    </div>
  )
}
