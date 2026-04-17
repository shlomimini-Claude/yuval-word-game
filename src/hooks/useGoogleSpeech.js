import { useState, useCallback, useRef } from 'react'

function stripNiqqud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '').trim()
}

function normalize(text) {
  return stripNiqqud(text)
    .replace(/[.,!?״׳"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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

// Pick a mimeType the current browser supports, with encoding Google understands
function pickMimeType() {
  const candidates = [
    { mime: 'audio/webm;codecs=opus', encoding: 'WEBM_OPUS' },
    { mime: 'audio/webm', encoding: 'WEBM_OPUS' },
    { mime: 'audio/mp4', encoding: 'MP4' }, // iOS Safari
    { mime: 'audio/ogg;codecs=opus', encoding: 'OGG_OPUS' },
  ]
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mime)) {
      return c
    }
  }
  return { mime: '', encoding: 'ENCODING_UNSPECIFIED' }
}

export default function useGoogleSpeech() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [heardText, setHeardText] = useState('')
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const stopTimerRef = useRef(null)
  const encodingRef = useRef('WEBM_OPUS')

  const cleanup = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    mediaRecorderRef.current = null
  }, [])

  const startListening = useCallback(async () => {
    setError(null)
    setTranscript('')
    setHeardText('')
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      const { mime, encoding } = pickMimeType()
      encodingRef.current = encoding

      const mediaRecorder = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined
      )

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop())
          streamRef.current = null
        }

        if (chunksRef.current.length === 0) {
          setError('לא שמעתי... נסי שוב!')
          setIsListening(false)
          return
        }

        setIsProcessing(true)
        setIsListening(false)

        try {
          const blob = new Blob(chunksRef.current, {
            type: mime || 'audio/webm',
          })

          // Reject clips that are too short (< 300ms)
          if (blob.size < 2000) {
            setError('לא שמעתי... דברי קצת יותר חזק 🔊')
            setIsProcessing(false)
            return
          }

          const base64Audio = await blobToBase64(blob)

          const response = await fetch('/api/speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio: base64Audio,
              encoding: encodingRef.current,
            }),
          })

          const data = await response.json()

          if (data.error) {
            setError(`שגיאה: ${data.error}`)
          } else if (data.alternatives && data.alternatives.length > 0) {
            // Filter out empty results
            const valid = data.alternatives
              .map(normalize)
              .filter((t) => t.length > 0)
            if (valid.length > 0) {
              // Show what Google heard for debugging
              setHeardText(data.alternatives[0])
              setTranscript(valid.join('|'))
            } else {
              setError('לא שמעתי... נסי שוב!')
            }
          } else {
            setError('לא שמעתי... נסי שוב!')
          }
        } catch (_) {
          setError('אין חיבור לאינטרנט 📡')
        } finally {
          setIsProcessing(false)
          mediaRecorderRef.current = null
        }
      }

      mediaRecorderRef.current = mediaRecorder
      // Request data every 500ms to avoid losing chunks on iOS
      mediaRecorder.start(500)
      setIsListening(true)

      // Auto-stop after 8 seconds (enough for 5-6 word sentences)
      stopTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
      }, 8000)
    } catch (err) {
      cleanup()
      if (err.name === 'NotAllowedError') {
        setError('צריך לאשר גישה למיקרופון 🎤')
      } else if (err.name === 'NotFoundError') {
        setError('לא מצאתי מיקרופון 🎤')
      } else {
        setError('משהו לא עבד, ננסי שוב?')
      }
      setIsListening(false)
    }
  }, [cleanup])

  const stopListening = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const checkMatch = useCallback(
    (targetPhrase) => {
      if (!transcript) return null
      const plainTarget = normalize(targetPhrase)
      const alternatives = transcript.split('|')
      // Exact match OR contains the target (for longer transcriptions)
      return alternatives.some((alt) => {
        const n = normalize(alt)
        return n === plainTarget || n.includes(plainTarget) || plainTarget.includes(n)
      })
    },
    [transcript]
  )

  return {
    isListening: isListening || isProcessing,
    isProcessing,
    transcript,
    heardText,
    error,
    isSupported: true,
    startListening,
    stopListening,
    checkMatch,
  }
}
