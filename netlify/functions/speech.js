export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.GOOGLE_SPEECH_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { audio, encoding = 'WEBM_OPUS' } = body

    if (!audio) {
      return new Response(JSON.stringify({ error: 'No audio data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build the recognition config based on detected encoding.
    // For container formats (MP4/WEBM) Google detects sample rate automatically
    // when we omit sampleRateHertz.
    const audioConfig = {
      languageCode: 'he-IL',
      maxAlternatives: 5,
      model: 'latest_short',
      enableAutomaticPunctuation: false,
    }

    // Known containers — let Google auto-detect sample rate
    if (encoding === 'WEBM_OPUS' || encoding === 'OGG_OPUS' || encoding === 'MP4') {
      audioConfig.encoding = encoding === 'MP4' ? 'ENCODING_UNSPECIFIED' : encoding
    } else {
      audioConfig.encoding = 'ENCODING_UNSPECIFIED'
    }

    const googleResponse = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: audioConfig,
          audio: { content: audio },
        }),
      }
    )

    const data = await googleResponse.json()

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Collect alternatives from all results (sometimes Google splits into multiple results)
    const allAlternatives = []
    if (data.results) {
      for (const result of data.results) {
        if (result.alternatives) {
          for (const alt of result.alternatives) {
            if (alt.transcript) allAlternatives.push(alt.transcript)
          }
        }
      }
    }

    return new Response(JSON.stringify({ alternatives: allAlternatives }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  path: '/api/speech',
}
