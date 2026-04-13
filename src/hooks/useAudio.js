// iOS Safari requires AudioContext to be created/resumed from a user gesture.
// This module creates a shared context and unlocks it on first tap.

let audioCtx = null
let unlocked = false

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

export function unlockAudio() {
  if (unlocked) return
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  // Play a silent buffer to unlock on iOS
  const buffer = ctx.createBuffer(1, 1, 22050)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.start(0)
  unlocked = true

  // Also unlock speechSynthesis on iOS
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('')
    utterance.volume = 0
    window.speechSynthesis.speak(utterance)
  }
}

export function playDisappointedSound() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    const notes = [440, 370, 311]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.2)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.2)
      osc.stop(ctx.currentTime + i * 0.2 + 0.4)
    })
  } catch (_) {
    // ignore
  }
}

let cachedVoice = null

function getHebrewVoice() {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis?.getVoices() || []
  cachedVoice = voices.find((v) => v.lang.startsWith('he')) || null
  return cachedVoice
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoice = null
    getHebrewVoice()
  })
}

export function speakPraise(index) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()

  const phrases = [
    'יופי שוש',
    'יופי שוש, מעולה',
    'יופי שוש, כל הכבוד',
    'יופי שוש, מדהימה',
  ]

  const phrase = phrases[index % phrases.length]
  const utterance = new SpeechSynthesisUtterance(phrase)
  utterance.lang = 'he-IL'
  utterance.rate = 0.9
  utterance.pitch = 1.2
  utterance.volume = 1

  const voice = getHebrewVoice()
  if (voice) utterance.voice = voice

  window.speechSynthesis.speak(utterance)
}
