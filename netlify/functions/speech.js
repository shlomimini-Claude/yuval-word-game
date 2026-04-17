export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.GOOGLE_SPEECH_API_KEY
  const projectId = process.env.GOOGLE_PROJECT_ID

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'GOOGLE_SPEECH_API_KEY not set in Netlify env vars',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
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

    // Prefer Chirp v2 if we have a project ID, fall back to v1
    let googleResponse
    let modelUsed

    if (projectId) {
      // --- Chirp v2 API (much better for Hebrew) ---
      modelUsed = 'chirp_2'
      const url = `https://speech.googleapis.com/v2/projects/${projectId}/locations/global/recognizers/_:recognize?key=${apiKey}`

      googleResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            autoDecodingConfig: {},
            languageCodes: ['he-IL'],
            model: 'chirp_2',
            features: {
              maxAlternatives: 5,
              enableAutomaticPunctuation: false,
            },
          },
          content: audio,
        }),
      })
    } else {
      // --- Fallback: v1 API ---
      modelUsed = 'latest_short'
      googleResponse = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: {
              languageCode: 'he-IL',
              maxAlternatives: 5,
              model: 'latest_short',
              encoding: 'ENCODING_UNSPECIFIED',
              enableAutomaticPunctuation: false,
            },
            audio: { content: audio },
          }),
        }
      )
    }

    const data = await googleResponse.json()

    if (!googleResponse.ok || data.error) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || `HTTP ${googleResponse.status}`,
          model: modelUsed,
          status: googleResponse.status,
          details: data.error?.details,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Collect alternatives from all results
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

    return new Response(
      JSON.stringify({
        alternatives: allAlternatives,
        model: modelUsed,
        raw: allAlternatives.length === 0 ? data : undefined,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Function error: ${err.message}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export const config = {
  path: '/api/speech',
}
