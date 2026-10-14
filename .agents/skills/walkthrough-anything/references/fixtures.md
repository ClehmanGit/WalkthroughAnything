# Phase 3: Fixtures

Goal: the app shows every storyboarded state, with realistic data, on every take, without a network, a login or a secret.

Deliverables: `walkthrough/setup.js` (runs in the page before the engine) and/or `walkthrough/fixtures.json` (answers HTTP requests). Most apps need one; some need both.

## Pick the strategy from the app, in this order

1. **The app already has a demo or seed mode.** A `?demo` flag, a `SEED=true` env, a Storybook story, a fixtures folder. Use it. Cite it in DISCOVERY.md.
2. **The app keeps state in a global the page can reach** (a store, a window object, a module you can import). `setup.js` seeds it and re-renders. Fastest and most deterministic. RenewalDesk works this way: `setup.js` fills the state object and stubs the four API methods.
3. **The app talks to an HTTP API.** `fixtures.json` answers matching requests through the recorder's route interception. Capture real responses once (with secrets removed), trim them to what the video needs, and add `delay` to the ones that should visibly take time.
4. **The app needs a real local backend with a database.** Seed the database with a script committed to the walkthrough folder. Document the command. Prefer this over fixtures when the UI depends on many coupled endpoints.

If none of these can reach a storyboarded state, the state is cut from the storyboard or the user is asked. Do not record against production.

## Data rules

- Realistic names, amounts and dates. "Veranda Real Estate", not "Test Client 1". Lorem ipsum is never acceptable in a video.
- Enough items to show the pattern, never so many that the list scrolls: three clients, three quotes, two results.
- The data must make the story true. If the card says "ordered by severity", the fixture must be ordered by severity.
- No real customer data, no real credentials, no real tokens, no personal information. Invent everything.
- Dates near the recording date so relative labels ("2 days ago") read sensibly.

## Timing rules

- Anything the viewer should see working takes 3–8 seconds. Set the stub's delay explicitly and multiply by the speed factor (`window.__WA_SPEED`) so it is right after time-stretching.
- Anything the viewer should not wait for (a save, a toast) resolves in under half a second.

## setup.js contract

- Runs after the page's `load` event and before `tour.js`.
- May read `window.__WA_SPEED` (the capture slow factor).
- Must leave the app at the first screen of the storyboard with the first chapter's state ready.
- Must close any modal the app opened on load because of missing config (a login, a token prompt).
- Should inject CSS that multiplies the app's own animation durations by the speed factor, so they look normal after time-stretching:

```js
const SPEED = window.__WA_SPEED || 1;
const s = document.createElement('style');
s.textContent = `.panel.enter { animation-duration: calc(.3s * ${SPEED}); }`;
document.head.appendChild(s);
```

## fixtures.json contract

```json
[
  { "match": "/api/clients$", "body": [ { "id": 1, "name": "Veranda Real Estate" } ] },
  { "match": "/api/evaluate", "delay": 4200, "body": { "verdict": "worse" } },
  { "match": "/api/save", "status": 201, "body": { "ok": true } }
]
```

`match` is a regular expression tested against the full URL. The first match wins. Unmatched requests go to the network, so block what must not leak.

## Verify before scripting

Open the app with the fixtures applied and walk the storyboard by hand. Every beat's target must exist and look right. Fix the data until it does. Only then write `steps.js`.
