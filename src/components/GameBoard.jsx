import { motion } from 'framer-motion'
import WordDisplay from './WordDisplay'
import VoiceRecorder from './VoiceRecorder'
import YuvalAvatar from './YuvalAvatar'

export default function GameBoard({
  word, emoji, wordIndex, totalWordsInLevel,
  state, isListening, isProcessing, heardText,
  onRecord, onParentCorrect, onParentRetry, onBackToMenu,
  error, levelNumber, levelName, levelEmoji, useParentMode,
}) {
  const progress = (wordIndex / totalWordsInLevel) * 100

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-16 right-8 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-32 left-4 w-56 h-56 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header
        className="relative z-10 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-4 py-3 rounded-b-[2rem] shrink-0"
        style={{ boxShadow: '0 20px 40px rgba(183,0,77,0.08)' }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBackToMenu}
          className="text-primary p-2 hover:scale-110 transition-transform cursor-pointer"
        >
          <span className="text-2xl font-black">→</span>
        </motion.button>

        {/* Progress bar */}
        <div className="flex-1 mx-4">
          <div className="bg-surface-container-high h-4 w-full rounded-full overflow-hidden flex items-center p-0.5">
            <motion.div
              className="bg-secondary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-xs text-on-surface-variant mt-1 font-medium">
            {wordIndex + 1} / {totalWordsInLevel}
          </p>
        </div>

        <div className="bg-primary-container/20 px-3 py-1.5 rounded-full">
          <span className="font-black text-primary text-sm">{levelEmoji} שלב {levelNumber}</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4 pb-36 pt-4">
        <YuvalAvatar state={state} size="sm" />

        <WordDisplay
          word={word}
          emoji={emoji}
          index={wordIndex}
          state={state}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-on-error-container bg-error-container/20 rounded-full px-4 py-2 font-medium"
          >
            {error}
          </motion.p>
        )}

        {heardText && state === 'incorrect' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-on-surface-variant bg-surface-container rounded-full px-4 py-2"
          >
            שמעתי: &quot;{heardText}&quot;
          </motion.p>
        )}
      </div>

      {/* Fixed bottom mic */}
      <div className="fixed bottom-0 left-0 w-full z-20 flex flex-col items-center pb-8 pt-4 bg-surface/60 backdrop-blur-sm rounded-t-[2rem]">
        <VoiceRecorder
          isListening={isListening}
          isProcessing={isProcessing}
          onRecord={onRecord}
          onParentCorrect={onParentCorrect}
          onParentRetry={onParentRetry}
          disabled={state === 'success'}
          useParentMode={useParentMode}
        />
      </div>
    </div>
  )
}
