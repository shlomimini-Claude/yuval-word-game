import { motion } from 'framer-motion'
import { kidConfig } from '../config'

const stateAnimations = {
  idle: {
    y: [0, -6, 0],
    rotate: 0,
    scale: 1,
    transition: { y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  },
  listening: {
    y: [0, -4, 0],
    rotate: [0, -2, 2, 0],
    scale: 1.02,
    transition: {
      y: { duration: 1.5, repeat: Infinity },
      rotate: { duration: 2, repeat: Infinity },
    },
  },
  success: {
    y: [0, -25, 0, -15, 0],
    rotate: [0, -12, 12, -8, 8, 0],
    scale: [1, 1.2, 0.9, 1.15, 1],
    transition: { duration: 0.8, ease: 'easeOut' },
  },
  incorrect: {
    x: [-4, 4, -4, 4, 0],
    rotate: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
}

export default function YuvalAvatar({ state = 'idle', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28 md:w-32 md:h-32',
    lg: 'w-36 h-36 md:w-44 md:h-44',
  }

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={stateAnimations[state] || stateAnimations.idle}
    >
      {state === 'success' && (
        <div
          className="absolute inset-[-6px] rounded-full rainbow-ring rainbow-spin"
          style={{ filter: 'blur(2px)', opacity: 0.9 }}
        />
      )}

      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-4
          ${state === 'success' ? 'border-surface-container-lowest' : 'border-white/80'}
          shadow-xl bg-white/30 relative z-10`}
      >
        <img
          src={kidConfig.photo}
          alt={kidConfig.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.innerHTML =
              '<span class="text-5xl flex items-center justify-center h-full">👧</span>'
          }}
        />
      </div>

      {state === 'success' && (
        <>
          {['💖', '⭐', '✨'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              initial={{ opacity: 1, y: 0, x: 0 }}
              animate={{ opacity: 0, y: -50 - i * 15, x: (i - 1) * 25 }}
              transition={{ duration: 1, delay: i * 0.15 }}
            >
              {emoji}
            </motion.span>
          ))}
        </>
      )}
    </motion.div>
  )
}
