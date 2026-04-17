# How to clone this app for a new child

## What you need to change

1. **Edit `src/config.js`** — update these fields:
   ```js
   export const kidConfig = {
     name: 'שם הילד',        // Hebrew name (e.g. 'נועה', 'אביב')
     gender: 'female',        // 'male' or 'female'
     photo: '/noa.png',       // path to photo in /public folder
     welcomeEmoji: '📚',      // emoji on start screen
     theme: 'ocean-sky',      // see theme options below
   }
   ```

2. **Replace the photo** — copy the child's PNG (transparent background recommended)
   into the `public/` folder with the filename you set in `photo` above.

3. **Update sentences** (optional) — edit `src/data/words.js` to use age-appropriate
   sentences for the new child. Make sure first-person verbs match the child's gender.

That's it — all UI text (greetings, praises, encouragement) auto-derives from `name` and `gender`.

## Theme options

| Theme | Colors |
|-------|--------|
| `purple-pink` | Purple → Pink (default) |
| `ocean-sky` | Blue → Teal |
| `sunset` | Red → Orange |
| `forest` | Mint → Green |
| `candy` | Pink → Yellow |

## Deploy a new instance

1. Fork the repo on GitHub (or duplicate it)
2. Connect the fork to a new Netlify site
3. Add environment variables in Netlify:
   - `GOOGLE_SPEECH_API_KEY` — your Google Cloud Speech API key
   - `GOOGLE_PROJECT_ID` — your Google Cloud project ID (optional, enables Chirp v2)
4. Deploy — done!

## Google Cloud setup (if starting fresh)

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Cloud Speech-to-Text API**
3. Create an **API key** (restrict it to Cloud Speech-to-Text API for security)
4. Add the key as `GOOGLE_SPEECH_API_KEY` in Netlify environment variables
