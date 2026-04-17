// iOS Safari requires AudioContext + SpeechSynthesis to be unlocked from
// a user gesture. This module handles that + provides shared audio helpers.

import { phrases } from '../config'

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
  const buffer = ctx.createBuffer(1, 1, 22050)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.start(0)
  unlocked = true

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('')
    utterance.volume = 0
    window.speechSynthesis.speak(utterance)
  }
}

// --- Hebrew voice caching ---

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

function speakHebrew(phrase, { rate = 0.95, pitch = 1.2 } = {}) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(phrase)
  utterance.lang = 'he-IL'
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = 1

  const voice = getHebrewVoice()
  if (voice) utterance.voice = voice

  window.speechSynthesis.speak(utterance)
}

export function speakPraise(index) {
  const phrase = phrases.spokenSuccess[index % phrases.spokenSuccess.length]
  speakHebrew(phrase, { rate: 0.95, pitch: 1.25 })
}

export function speakEncouragement(index = 0) {
  const phrase = phrases.spokenFailure[index % phrases.spokenFailure.length]
  speakHebrew(phrase, { rate: 0.95, pitch: 1.1 })
}
