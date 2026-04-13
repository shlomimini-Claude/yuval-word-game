import { motion } from 'framer-motion'

export default function VoiceRecorder({
  isListening,
  onRecord,
  onParentCorrect,
  onParentRetry,
  disabled,
  useParentMode,
}) {
  if (useParentMode) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-lg md:text-xl text-white/80 font-bold">
          יובל קראה נכון? 🤔
        </p>
        <div className="flex gap-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onParentCorrect}
            disabled={disabled}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                       text-4xl md:text-5xl shadow-xl bg-green-400 hover:bg-green-300
                       transition-colors cursor-pointer disabled:opacity-50"
          >
            ✅
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onParentRetry}
            disabled={disabled}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                       text-4xl md:text-5xl shadow-xl bg-orange-300 hover:bg-orange-200
                       transition-colors cursor-pointer disabled:opacity-50"
          >
            🔄
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      onClick={onRecord}
      disabled={disabled}
      className={`relative w-20 h-20 md:w-36 md:h-36 rounded-full flex items-center justify-center
                  text-4xl md:text-6xl shadow-2xl transition-all cursor-pointer
                  ${
                    isListening
                      ? 'bg-red-400 text-white'
                      : 'bg-white text-primary hover:bg-purple-50'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                 `}
    >
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-300"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-300"
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}

      {isListening ? '⏹️' : '🎤'}

      {!isListening && !disabled && (
        <motion.span
          className="absolute -bottom-8 text-lg md:text-xl text-white font-bold whitespace-nowrap"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          לחצי וקראי! 👆
        </motion.span>
      )}
    </motion.button>
  )
}
