import { motion } from 'framer-motion'
import levels from '../data/words'
import { unlockAudio } from '../hooks/useAudio'
import { kidConfig, phrases } from '../config'

const levelBg = [
  'bg-primary-container/30',
  'bg-secondary-container/40',
  'bg-tertiary-container/60',
  'bg-surface-container-highest',
  'bg-tertiary-container/30',
]

export default function StartScreen({ onStart }) {
  const handleLevelClick = (i) => {
    unlockAudio()
    onStart(i)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      {/* Floating star decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '18%', left: '8%', size: 16, delay: 0 },
          { top: '55%', left: '88%', size: 22, delay: 1 },
          { top: '35%', left: '22%', size: 12, delay: 2 },
          { top: '75%', left: '75%', size: 18, delay: 0.5 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute bg-tertiary-container rounded-sm opacity-40"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, rotate: 45 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className="bg-surface-container-low/80 backdrop-blur-md sticky top-0 z-50 flex flex-row-reverse justify-between items-center px-6 py-4 w-full rounded-b-[2rem]"
        style={{ boxShadow: '0 4px 40px rgba(183,0,77,0.08)' }}
      >
        <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
          <img src={kidConfig.photo} alt={kidConfig.name} className="w-full h-full object-cover object-top" />
        </div>
        <h1 className="text-xl font-black text-primary tracking-tight">
          עולם המילים של {kidConfig.name}
        </h1>
        <div className="w-10" />
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-8 w-full">
        {/* Hero title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
          style={{ transform: 'rotate(-1deg)' }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tight leading-tight text-glow drop-shadow-xl">
            עולם המילים<br />
            <span className="text-secondary">של {kidConfig.name}</span>
          </h2>
          <p className="mt-3 text-lg text-on-surface-variant font-medium">{phrases.welcomeSubtitle}</p>
        </motion.div>

        {/* Level cards */}
        <div className="flex flex-col gap-4">
          {levels.map((level, i) => (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: 'spring' }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLevelClick(i)}
              className="w-full bg-surface-container-lowest p-5 rounded-[1.5rem] flex items-center justify-between border border-white/40 transition-all cursor-pointer"
              style={{ boxShadow: '0 12px 40px rgba(183,0,77,0.08)' }}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 ${levelBg[i]} rounded-[1rem] flex items-center justify-center text-3xl`}>
                  {level.emoji}
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black text-on-surface">
                    שלב {level.id} — {level.name}
                  </h3>
                  <p className="text-on-surface-variant font-medium text-sm">{level.words.length} משפטים</p>
                </div>
              </div>
              <span className="text-primary font-bold text-sm">▶ קדימה!</span>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  )
}
