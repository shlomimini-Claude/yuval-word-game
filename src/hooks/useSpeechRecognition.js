import { useState, useCallback, useRef } from 'react'

function stripNiqqud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '').trim()
}

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  )
}

export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const SpeechRecognitionClass = getSpeechRecognition()
  const isSupported = !!SpeechRecognitionClass

  const startListening = useCallback(() => {
    if (!SpeechRecognitionClass) {
      setError('הדפדפן לא תומך בזיהוי קולי')
      return
    }

    // Stop any existing session first (iOS requires this)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (_) {
        // ignore
      }
      recognitionRef.current = null
    }

    try {
      const recognition = new SpeechRecognitionClass()
      recognition.lang = 'he-IL'
      recognition.continuous = false
      recognition.interimResults = false
      // iOS Safari doesn't support maxAlternatives > 1 well
      recognition.maxAlternatives = 3

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript('')
        setError(null)
      }

      recognition.onresult = (event) => {
        const results = []
        try {
          for (let i = 0; i < event.results[0].length; i++) {
            results.push(event.results[0][i].transcript)
          }
        } catch (_) {
          // iOS sometimes has issues with result iteration
          if (event.results?.[0]?.[0]?.transcript) {
            results.push(event.results[0][0].transcript)
          }
        }
        if (results.length > 0) {
          setTranscript(results.join('|'))
        } else {
          setError('לא שמעתי... נסי שוב!')
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        recognitionRef.current = null
        if (event.error === 'no-speech') {
          setError('לא שמעתי... נסי שוב!')
        } else if (event.error === 'not-allowed') {
          setError('צריך לאשר גישה למיקרופון 🎤')
        } else if (event.error === 'network') {
          setError('אין חיבור לאינטרנט 📡')
        } else {
          setError('משהו לא עבד, ננסי שוב?')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        recognitionRef.current = null
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err) {
      setIsListening(false)
      setError('משהו לא עבד, ננסי שוב?')
    }
  }, [SpeechRecognitionClass])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (_) {
        // ignore
      }
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
    heardText: transcript ? transcript.split('|')[0] : '',
    error,
    isSupported,
    isProcessing: false,
    startListening,
    stopListening,
    checkMatch,
  }
}
