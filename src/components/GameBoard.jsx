import { motion } from 'framer-motion'
import WordDisplay from './WordDisplay'
import VoiceRecorder from './VoiceRecorder'
import YuvalAvatar from './YuvalAvatar'

export default function GameBoard({
  word,
  emoji,
  wordIndex,
  totalWordsInLevel,
  state,
  isListening,
  onRecord,
  error,
  levelNumber,
  levelName,
  levelEmoji,
}) {
  const progress = (wordIndex / totalWordsInLevel) * 100

  return (
    <div className="flex flex-col items-center h-full py-3 px-4 gap-2">
      {/* Top bar: level info + progress */}
      <div className="w-full max-w-lg flex flex-col gap-1.5 shrink-0">
        <div className="flex justify-between items-center text-white font-bold">
          <span className="text-sm md:text-lg bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            {levelEmoji} שלב {levelNumber} — {levelName}
          </span>
          <span className="text-xs md:text-sm bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
            מילה {wordIndex + 1} מתוך {totalWordsInLevel}
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Yuval avatar — smaller on mobile */}
      <div className="shrink-0">
        <YuvalAvatar state={state} size="sm" />
      </div>

      {/* Main word area — takes remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <WordDisplay
          word={word}
          emoji={emoji}
          index={wordIndex + levelNumber}
          state={state}
        />
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base md:text-xl text-white bg-candy/80 rounded-2xl px-4 py-1.5 shrink-0"
        >
          {error}
        </motion.p>
      )}

      {/* Mic button */}
      <div className="pb-3 shrink-0">
        <VoiceRecorder
          isListening={isListening}
          onRecord={onRecord}
          disabled={state === 'success'}
        />
      </div>
    </div>
  )
}
