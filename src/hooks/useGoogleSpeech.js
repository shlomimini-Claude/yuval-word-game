import { useState, useCallback, useRef } from 'react'

function stripNiqqud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '').trim()
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export default function useGoogleSpeech() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startListening = useCallback(async () => {
    setError(null)
    setTranscript('')
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop())

        if (chunksRef.current.length === 0) {
          setError('לא שמעתי... נסי שוב!')
          setIsListening(false)
          return
        }

        setIsProcessing(true)
        setIsListening(false)

        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const base64Audio = await blobToBase64(blob)

          const response = await fetch('/api/speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64Audio }),
          })

          const data = await response.json()

          if (data.error) {
            setError('משהו לא עבד, ננסי שוב?')
          } else if (data.alternatives && data.alternatives.length > 0) {
            setTranscript(data.alternatives.join('|'))
          } else {
            setError('לא שמעתי... נסי שוב!')
          }
        } catch (_) {
          setError('אין חיבור לאינטרנט 📡')
        } finally {
          setIsProcessing(false)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsListening(true)

      // Auto-stop after 4 seconds (single word)
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
      }, 4000)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('צריך לאשר גישה למיקרופון 🎤')
      } else {
        setError('משהו לא עבד, ננסי שוב?')
      }
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const checkMatch = useCallback(
    (targetWord) => {
      if (!transcript) return null
      const plainTarget = stripNiqqud(targetWord)
      const alternatives = transcript.split('|')
      return alternatives.some((alt) => stripNiqqud(alt) === plainTarget)
    },
    [transcript]
  )

  return {
    isListening: isListening || isProcessing,
    transcript,
    error,
    isSupported: true,
    startListening,
    stopListening,
    checkMatch,
    isProcessing,
  }
}
