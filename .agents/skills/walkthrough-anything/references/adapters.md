# Adapters: what changes by kind of app

The method is the same everywhere. The fixtures and the hooks differ.

## Static single-page app (one HTML file, vanilla JS)

- State is usually a global. `setup.js` seeds it and calls the app's render function.
- Serve it with any static server (`python -m http.server`). Point `--url` at it.
- Stub the API client's methods directly in `setup.js`.
- Example: `examples/renewal-desk`.

## Framework SPA with a dev server (React, Vue, Svelte, Angular)

- State lives in a store you cannot reach from `window` unless the app exposes it. Prefer `fixtures.json` to answer the API, so the real store fills itself.
- Start the dev server; `--url http://localhost:5173`.
- Disable hot reload overlays and dev toolbars for the recording (environment flag or CSS in `setup.js`).
- Enter animations are usually CSS or a motion library. Slow them with `W.slowHost` or an env flag the app already has.
- Selectors: ask the maintainers for `data-testid`; use them. Class names from CSS modules are hashed and unstable.

## Server-rendered app (Rails, Django, Laravel, Next.js pages)

- Each navigation is a full page load, which destroys the injected engine. Two options:
  - Record one route per recorder run and concatenate the MP4s with ffmpeg's concat demuxer. Title cards go at the start of the first and end of the last.
  - Add a small `?walkthrough` hook to the base layout that re-injects the engine and resumes from a step index stored in `sessionStorage`. More work, one continuous video.
- Seed the database with the app's own seed command. Document it in DISCOVERY.md.

## Auth walls

- Never type real credentials. If the app has a test user and a local login form, `fixtures.json` can answer the auth endpoint, or `setup.js` can set the session cookie or token the app reads on load.
- If there is no local way in, stop and ask. Do not record an app you cannot enter.

## Electron and desktop web views

- Run the renderer in a normal browser if the app supports it (`npm run dev:web`). Record that.
- If it does not, Playwright can launch Electron (`_electron.launch`) but video recording of the window is not supported; use OS-level capture and accept lower determinism. Say so in the deliverable.

## Mobile layouts

- Record at a phone viewport (`--size 390x844`) with the same engine. Cards are narrower; cut body copy to one sentence. Place cards `top` or `bottom` only.

## Terminal and CLI tools

- Out of scope for this engine. Record with asciinema or a terminal recorder, then overlay captions in the editor. The discovery, storyboard, writing and flow rules still apply.

## Multi-page documentation sites

- Usually a static site. The job is "find the answer". Storyboard the search → land → read → copy flow. Fixtures are not needed; use the real content.

## Things that look like walkthroughs but are not

- A marketing sizzle reel: no job, no decisions. Decline or reframe as a walkthrough of one job.
- A bug reproduction: use the recorder without cards for a faithful capture, but the method's highlight rules do not apply.
- A human screen recording with narration: a different medium. Offer the storyboard as a script for it.
