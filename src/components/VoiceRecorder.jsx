import { motion } from 'framer-motion'
import { phrases } from '../config'

export default function VoiceRecorder({
  isListening,
  isProcessing,
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
          {phrases.parentPrompt}
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

  const label = isProcessing
    ? phrases.micProcessing
    : isListening
      ? phrases.micListening
      : phrases.micIdle

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        onClick={onRecord}
        disabled={disabled || isProcessing}
        className={`relative w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center
                    text-5xl md:text-6xl shadow-2xl transition-all cursor-pointer
                    ${
                      isProcessing
                        ? 'bg-yellow-300 text-yellow-900'
                        : isListening
                          ? 'bg-red-400 text-white'
                          : 'bg-white text-primary hover:bg-purple-50'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                   `}
      >
        {isListening && !isProcessing && (
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

        {isProcessing ? '⏳' : isListening ? '⏹️' : '🎤'}
      </motion.button>

      {!disabled && (
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base md:text-xl text-white font-bold whitespace-nowrap bg-white/20 backdrop-blur-sm rounded-full px-4 py-1"
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
