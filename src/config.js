/**
 * Kid-specific config — change this file to clone the app for a new kid.
 * See CLONE.md for step-by-step instructions.
 */

export const kidConfig = {
  // Hebrew name (appears in title, praises, success messages)
  name: 'יובל',

  // 'male' or 'female' — controls grammatical forms in UI/praise
  gender: 'female',

  // Path to kid's photo (relative to /public folder)
  photo: '/yuval.png',

  // Emoji shown on start screen
  welcomeEmoji: '📚',

  // Gradient background — pick one preset below, or set custom
  // Presets: 'purple-pink', 'ocean-sky', 'sunset', 'forest', 'candy'
  theme: 'purple-pink',
}

// --- Gender-aware phrases (auto-derived from config.gender) ---

const isFemale = kidConfig.gender === 'female'

export const phrases = {
  // Start screen
  welcomeSubtitle: isFemale
    ? 'בחרי שלב והתחילי לקרוא! 🎉'
    : 'בחר שלב והתחל לקרוא! 🎉',

  // Mic button states
  micIdle: isFemale ? '🎤 לחצי וקראי! 👆' : '🎤 לחץ וקרא! 👆',
  micListening: isFemale ? '⏹️ לחצי כשסיימת' : '⏹️ לחץ כשסיימת',
  micProcessing: isFemale ? '⏳ חושבת...' : '⏳ חושב...',
  micListeningHint: '🎧 מקשיב/ה...',

  // Parent mode
  parentPrompt: isFemale
    ? `${kidConfig.name} קראה נכון? 🤔`
    : `${kidConfig.name} קרא נכון? 🤔`,

  // Encouragement after wrong answer
  tryAgain: isFemale
    ? `כמעט! נסי שוב, ${kidConfig.name}! 💪`
    : `כמעט! נסה שוב, ${kidConfig.name}! 💪`,

  // Completion screen
  completionTitle: `כל הכבוד ${kidConfig.name}!`,
  completionSubtitle: isFemale
    ? 'קראת את כל המשפטים! את אלופה! 🌟'
    : 'קראת את כל המשפטים! אתה אלוף! 🌟',
  playAgain: isFemale ? '🔄 שחקי שוב!' : '🔄 שחק שוב!',

  // Level complete
  nextLevel: isFemale ? '🚀 לשלב הבא!' : '🚀 לשלב הבא!',
  chooseLevel: '📋 בחירת שלב',

  // Praise list (spoken aloud + rotating written praise)
  visualPraises: isFemale
    ? [
        'מדהים! 🌟',
        'יופי של קריאה! 🎉',
        `כל הכבוד ${kidConfig.name}! 👏`,
        'מצוין! את כוכבת! ⭐',
        'וואו! 🚀',
        'נפלא! 💖',
        'את אלופה! 🏆',
      ]
    : [
        'מדהים! 🌟',
        'יופי של קריאה! 🎉',
        `כל הכבוד ${kidConfig.name}! 👏`,
        'מצוין! אתה כוכב! ⭐',
        'וואו! 🚀',
        'נפלא! 💖',
        'אתה אלוף! 🏆',
      ],

  spokenSuccess: isFemale
    ? [
        `יופי ${kidConfig.name}, כל הכבוד`,
        `כל הכבוד ${kidConfig.name}, מעולה`,
        `יופי ${kidConfig.name}, את אלופה`,
        `מדהים ${kidConfig.name}, נהדר`,
        `יופי ${kidConfig.name}, נפלא`,
      ]
    : [
        `יופי ${kidConfig.name}, כל הכבוד`,
        `כל הכבוד ${kidConfig.name}, מעולה`,
        `יופי ${kidConfig.name}, אתה אלוף`,
        `מדהים ${kidConfig.name}, נהדר`,
        `יופי ${kidConfig.name}, נפלא`,
      ],

  spokenFailure: isFemale
    ? ['לא נורא, נסי שוב', 'לא נורא, נסי עוד פעם', 'זה בסדר, נסי שוב']
    : ['לא נורא, נסה שוב', 'לא נורא, נסה עוד פעם', 'זה בסדר, נסה שוב'],
}

// --- Theme gradients ---

export const themes = {
  'purple-pink': {
    start: '#a29bfe',
    end: '#fd79a8',
  },
  'ocean-sky': {
    start: '#74b9ff',
    end: '#00cec9',
  },
  sunset: {
    start: '#ff7675',
    end: '#fdcb6e',
  },
  forest: {
    start: '#55efc4',
    end: '#00b894',
  },
  candy: {
    start: '#fd79a8',
    end: '#ffeaa7',
  },
}

export const activeTheme = themes[kidConfig.theme] || themes['purple-pink']
