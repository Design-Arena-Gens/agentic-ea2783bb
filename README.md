# AI Dance Coach

Teach dance routines to your own music. Upload a song or capture from the mic; the app estimates BPM, generates an eight-count choreography, shows an animated dancer, and provides optional voice coaching.

## Running locally

- Install dependencies:
  ```bash
  npm install
  ```
- Start dev server:
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build && npm start
  ```

## How it works
- Uses Web Audio in the browser to decode audio and estimate tempo
- Generates choreo blocks from a small library of foundational moves
- Animates a simple SVG dancer synchronized to the beat
- Uses `SpeechSynthesis` to call out moves and counts (toggleable)

## Notes
- Microphone capture requires allowing browser mic permissions
- Beat estimation works best on clear, steady-tempo tracks

---
Made for Vercel deployment with Next.js App Router.
