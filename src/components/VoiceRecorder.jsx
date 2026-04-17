import { motion } from 'framer-motion'
import { phrases } from '../config'

export default function VoiceRecorder({
  isListening, isProcessing, onRecord,
  onParentCorrect, onParentRetry, disabled, useParentMode,
}) {
  if (useParentMode) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-bold text-on-surface-variant">{phrases.parentPrompt}</p>
        <div className="flex gap-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onParentCorrect}
            disabled={disabled}
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl bg-secondary text-white cursor-pointer disabled:opacity-50"
          >
            ✅
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onParentRetry}
            disabled={disabled}
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl bg-surface-container-high cursor-pointer disabled:opacity-50"
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
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {isListening && !isProcessing && (
          <>
            <div className="absolute inset-0 rounded-full mic-pulse" />
            <div className="absolute inset-0 rounded-full mic-pulse-delay" />
          </>
        )}

        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={onRecord}
          disabled={disabled || isProcessing}
          className="relative bg-white w-28 h-28 rounded-full flex items-center justify-center shadow-2xl disabled:opacity-50 cursor-pointer"
        >
          <div
            className={`rounded-full flex items-center justify-center p-6 button-3d-lip
              ${isProcessing ? 'bg-tertiary-container' : isListening ? 'bg-primary-dim' : 'bg-primary'}`}
          >
            <span className="text-4xl">
              {isProcessing ? '⏳' : isListening ? '⏹️' : '🎤'}
            </span>
          </div>
        </motion.button>
      </div>

      {!disabled && (
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold text-primary tracking-widest uppercase"
          style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
