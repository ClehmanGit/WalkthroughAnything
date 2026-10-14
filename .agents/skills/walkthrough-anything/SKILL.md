---
name: walkthrough-anything
description: Produce a narrated, highlighted product walkthrough video of any web application from its repository. Discover the real user job from the code, storyboard it into chapters and beats, script a self-driving tour, record it with Playwright, encode with ffmpeg, and QA from frames. Use when asked for a walkthrough, product tour, demo video, onboarding video, feature explainer or "show how this app works". Do not use for marketing sizzle reels, screen recordings of a human, or apps you cannot run locally.
metadata:
  version: "1"
---

# Walkthrough Anything

You are producing a short video that teaches a first-time viewer how an application does its one main job. The video is driven by a script, not a hand: a cursor moves, a spotlight isolates one element, a card explains it, the page changes, and the viewer is given room to breathe. Every highlight exists because the code proved it matters. Nothing is guessed.

Work in six phases. Each phase has a deliverable and a gate. Do not start a phase until the previous gate is met. If a gate cannot be met, stop and tell the user exactly what is missing.

| Phase | Deliverable | Gate |
|---|---|---|
| 1. Discover | `walkthrough/DISCOVERY.md` | Primary job named with evidence; audience named; every view in the job listed with a selector |
| 2. Storyboard | `walkthrough/walkthrough.spec.md` | 4–6 chapters, 8–16 beats, every beat passes the highlight test; user has approved |
| 3. Fixtures | `walkthrough/setup.js` and/or `fixtures.json` | App renders every storyboarded state with realistic data, no network, no secrets |
| 4. Script | `walkthrough/steps.js` | Runs to completion in the engine with no missing targets |
| 5. Record and encode | `walkthrough/out/<name>.mp4` | Duration within budget, no console errors, last frame is the outro |
| 6. QA | `walkthrough/QA.md` | Every review frame checked against the checklist; revisions listed and applied |

Read the reference for a phase before doing it:

- [discovery.md](references/discovery.md): how to find the job, the audience and the views from the repository, and the evidence ledger.
- [highlighting.md](references/highlighting.md): the test every highlight must pass, and what never earns one.
- [writing.md](references/writing.md): copy rules for cards, captions and title cards.
- [flow.md](references/flow.md): structure, pacing, breathers, transitions, cursor and spotlight rules.
- [fixtures.md](references/fixtures.md): putting the app into a known state without secrets or network.
- [engine.md](references/engine.md): the tour API and the steps file contract.
- [recording.md](references/recording.md): the capture and encode pipeline and its parameters.
- [qa.md](references/qa.md): the frame review checklist and revision loop.
- [adapters.md](references/adapters.md): what changes for SPAs, server-rendered apps, auth walls, Electron and terminals.

## Authority

- The user picks the target. If the request names no app, path or URL, ask. Never pick an example app on the user's behalf.
- The repository is the source of truth for what the app does. Observe it. Separate what you observed (a route, a handler, a label in the DOM) from what you inferred (why a user would care). Write both down and label them.
- You may only narrate what the recording shows. If a card claims a behaviour, the frame under it must show that behaviour.
- Never state a number you did not measure: durations, counts, speeds, prices. "About a minute each" is a guess. Cut it.
- Never run the real backend for a recording. Seed state or answer requests from fixtures. Never type real credentials or tokens.
- Ask before the storyboard, not after the video. A storyboard change costs a minute; a re-record costs five and the user's patience.

## Stop conditions

Stop and ask when any of these is true:

- More than one plausible primary job and the code does not settle it.
- More than one audience with different needs (admin vs end user) and the user named neither.
- The app needs a login and there is no local test account, seed script or demo mode in the repo.
- A storyboarded action is destructive or irreversible against real data.
- A view cannot be reached with fixtures and would need a live service.

## Budgets

- Length: 60–120 seconds. Over 120 is two videos.
- Chapters: 4–6. Beats (explainer cards): 8–16.
- Card copy: title of at most 6 words, body of at most 28 words.
- Hold time: computed from word count by the engine. Override only to let the viewer watch something happen, and say why in the spec.
- Breathers: at least one after every state change, 0.6–1.8 seconds.

## The loop

1. Read the repository until you can write one sentence of the form "A [audience] uses this to [job] by [steps]." Cite files.
2. Walk the job yourself in the running app and record which selector each step touches.
3. Storyboard: chapters are the steps of the job, beats are the decisions inside each step. Apply the highlight test to every beat. Get approval.
4. Build fixtures so the app can show every beat deterministically.
5. Write `steps.js` against the engine API. Run it headed once and watch.
6. Record at half speed, encode, extract frames, review every frame against the checklist, revise, repeat until clean.
7. Deliver the MP4, the spec, and a one-paragraph note on what the video intentionally leaves out.
