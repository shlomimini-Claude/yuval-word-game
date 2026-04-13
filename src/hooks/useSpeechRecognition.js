import { useState, useCallback, useRef } from 'react'

function stripNiqqud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '').trim()
}

export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('הדפדפן לא תומך בזיהוי קולי')
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.lang = 'he-IL'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 5

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
      setError(null)
    }

    recognition.onresult = (event) => {
      const results = []
      for (let i = 0; i < event.results[0].length; i++) {
        results.push(event.results[0][i].transcript)
      }
      setTranscript(results.join('|'))
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'no-speech') {
        setError('לא שמעתי... נסי שוב!')
      } else {
        setError('משהו לא עבד, ננסה שוב?')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const checkMatch = useCallback(
    (targetWord) => {
      if (!transcript) return null
      const plainTarget = stripNiqqud(targetWord)
      const alternatives = transcript.split('|')
      return alternatives.some(
        (alt) => stripNiqqud(alt) === plainTarget
      )
    },
    [transcript]
  )

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    checkMatch,
  }
}
