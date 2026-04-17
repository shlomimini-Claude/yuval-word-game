async function callChirpV2({ apiKey, projectId, audio }) {
  const url = `https://speech.googleapis.com/v2/projects/${projectId}/locations/global/recognizers/_:recognize?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: {
        autoDecodingConfig: {},
        languageCodes: ['he-IL'],
        model: 'chirp_2',
        features: {
          maxAlternatives: 5,
        },
      },
      content: audio,
    }),
  })
  return { response: res, data: await res.json() }
}

// Hebrew (iw-IL in Google's backend) only supports: default, latest_short.
// latest_long and useEnhanced are NOT supported for Hebrew.
async function callV1({ apiKey, audio, model = 'default' }) {
  const res = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: {
          languageCode: 'he-IL',
          maxAlternatives: 5,
          model,
          encoding: 'ENCODING_UNSPECIFIED',
          enableAutomaticPunctuation: false,
        },
        audio: { content: audio },
      }),
    }
  )
  return { response: res, data: await res.json() }
}

function extractAlternatives(data) {
  const all = []
  if (data.results) {
    for (const result of data.results) {
      if (result.alternatives) {
        for (const alt of result.alternatives) {
          if (alt.transcript) all.push(alt.transcript)
        }
      }
    }
  }
  return all
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.GOOGLE_SPEECH_API_KEY
  const projectId = process.env.GOOGLE_PROJECT_ID

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'GOOGLE_SPEECH_API_KEY not set',
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

    let result = null
    let modelUsed = null
    let chirpError = null

    // Try Chirp v2 if project ID available
    if (projectId) {
      try {
        const { response, data } = await callChirpV2({
          apiKey,
          projectId,
          audio,
        })
        if (response.ok && !data.error) {
          result = data
          modelUsed = 'chirp_2'
        } else {
          chirpError = data.error?.message || `HTTP ${response.status}`
        }
      } catch (e) {
        chirpError = e.message
      }
    }

    // Fallback to v1 default model (the one Hebrew actually supports)
    if (!result) {
      const { response, data } = await callV1({ apiKey, audio, model: 'default' })
      if (!response.ok || data.error) {
        return new Response(
          JSON.stringify({
            error: data.error?.message || `HTTP ${response.status}`,
            chirpError,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
      result = data
      modelUsed = 'default_v1'
    }

    const alternatives = extractAlternatives(result)

    return new Response(
      JSON.stringify({
        alternatives,
        model: modelUsed,
        chirpError, // Include so we can see if Chirp is failing
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
