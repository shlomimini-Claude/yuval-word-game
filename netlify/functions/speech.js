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
    const { audio } = body

    if (!audio) {
      return new Response(JSON.stringify({ error: 'No audio data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const googleResponse = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'he-IL',
            maxAlternatives: 5,
            model: 'default',
          },
          audio: {
            content: audio,
          },
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

    const alternatives =
      data.results?.[0]?.alternatives?.map((a) => a.transcript) || []

    return new Response(JSON.stringify({ alternatives }), {
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
