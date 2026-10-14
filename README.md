# WalkthroughAnything

### Point an agent at any web app and get a walkthrough video that teaches its one job.

**See a product. Understand what it is for. Get a 90-second video that shows a first-time viewer how to do the job, with every highlight earned by evidence from the code.**

WalkthroughAnything is a method and a toolkit. The method tells an agent how to discover what an app is for, decide what deserves attention, write copy a viewer can read in one pass, and pace a video so it breathes. The toolkit drives the real app with an animated cursor, a tracking spotlight and explainer cards, records it headlessly, and encodes a smooth MP4. The same steps file produces the same video every time, so a change in wording is an edit, not a re-shoot.

```
"Read .agents/skills/walkthrough-anything/SKILL.md, then make a walkthrough of ./my-app running at http://localhost:3000."
```

## Quick start

### Set up your agent

Clone this repository next to the app you want to walk through, or copy `.agents/skills/walkthrough-anything` into the app's own `.agents/skills`. Agents that read `AGENTS.md` and `.agents/skills` (Claude Code, Codex, Cursor and others) pick it up. Otherwise paste `prompts/START.md`.

### Ask your agent

```
Make a walkthrough of this app. It runs with `npm run dev` on port 5173.
The viewer is a first-time end user. Follow the WalkthroughAnything skill;
stop at the storyboard and show it to me before scripting.
```

The agent discovers the job from the repository, writes a storyboard for your approval, builds fixtures so the app can show every state without a backend, scripts the tour, records it, reviews the frames and delivers the MP4 with the storyboard beside it.

### Use the terminal

```bash
cd recorder && npm run setup
node recorder/record.js --url http://localhost:5173 --steps walkthrough/steps.js --setup walkthrough/setup.js --out walkthrough/out
node recorder/encode.js --in walkthrough/out/record.json --name my-app
```

## How it works

```
repository ──discover──▶ job sentence + evidence ledger
                          │
                          ▼
                     storyboard (chapters, beats, highlight test)   ◀── you approve here
                          │
                          ▼
fixtures ──▶ app in a known state ──▶ steps.js drives the engine
                                           │
                                           ▼
                          Playwright records at half speed ──▶ ffmpeg stretches, encodes, extracts frames
                                                                        │
                                                                        ▼
                                                              frame-by-frame QA ──▶ revise ──▶ MP4
```

Six phases, each with a deliverable and a gate. The agent cannot script before the storyboard is approved, and cannot deliver before every review frame passes the checklist. The full method is in the skill:

| Phase | Reference | What it settles |
|---|---|---|
| Discover | [discovery.md](.agents/skills/walkthrough-anything/references/discovery.md) | The one job, the audience, the screens, with citations |
| Highlight | [highlighting.md](.agents/skills/walkthrough-anything/references/highlighting.md) | The four-question test every spotlight must pass |
| Write | [writing.md](.agents/skills/walkthrough-anything/references/writing.md) | Card and caption copy rules, banned words |
| Flow | [flow.md](.agents/skills/walkthrough-anything/references/flow.md) | Shape, pacing, breathers, transitions, cursor and spotlight behaviour |
| Fixtures | [fixtures.md](.agents/skills/walkthrough-anything/references/fixtures.md) | Known state without secrets or network |
| Engine | [engine.md](.agents/skills/walkthrough-anything/references/engine.md) | The tour API and the steps file contract |
| Record | [recording.md](.agents/skills/walkthrough-anything/references/recording.md) | Half-speed capture, 60 fps encode, frame extraction |
| QA | [qa.md](.agents/skills/walkthrough-anything/references/qa.md) | The per-frame checklist and the revision loop |
| Adapt | [adapters.md](.agents/skills/walkthrough-anything/references/adapters.md) | SPAs, server-rendered apps, auth walls, Electron, mobile, terminals |

## What you can walk through

| Target | How state is controlled | Notes |
|---|---|---|
| Static single-page app | `setup.js` seeds globals, stubs the API client | The example. Simplest case. |
| Framework SPA with a dev server | `fixtures.json` answers the API; the real store fills itself | Ask for `data-testid` selectors |
| Server-rendered multi-page app | Seed the database; one recording per route, concatenated, or a re-injection hook | See adapters |
| App behind a login | Fixture the auth endpoint or set the session in `setup.js` | Never real credentials |
| Mobile layout | Same engine at a phone viewport | Shorter copy, cards top or bottom only |
| Electron | Record the web build in a browser | Window capture is not deterministic |
| CLI or TUI | Out of scope for the engine; the method still applies | Use a terminal recorder |

## Showcase

**RenewalDesk**, an insurance renewal comparison tool: four chapters, thirteen beats, 1:59. The agent found the job in the handler chain (select policy → evaluate quotes → read verdict → rank), cut the interactions list from the storyboard because a first-time viewer cannot act on it, and added a done state and cross-fade to the app itself when QA showed a hard cut from processing to results. Spec, fixtures, steps and output in [examples/renewal-desk](examples/renewal-desk).

## What makes the output good

- **Highlights are earned.** A spotlight appears only where the viewer decides something, the consequence is visible, and a first-time viewer would not have guessed it. Decoration never gets one.
- **Copy is read in one pass.** Six-word titles, 28-word bodies, hold time computed from word count. No hedges, no marketing adjectives, no numbers that were not measured.
- **The video breathes.** A plain-page rest after every state change. Chapter captions between steps. The cursor parks while you read.
- **Transitions are clean.** The spotlight tracks its target every frame and is released before the page changes. Processing shows a done state, pauses, and fades.
- **Nothing is guessed.** The job comes from the code. Unknowns become questions for you, never card copy.
- **Everything is reproducible.** The storyboard, fixtures and steps are text in the repo. Change a word, re-render in four minutes.

## FAQ

**Which agents can use this?** Any agent that can read Markdown, run Node and drive a browser through a script. The skill is written for Claude Code's `.agents/skills` layout and works as a pasted prompt elsewhere.

**Does it need a real backend?** No, and it should not use one. Fixtures put the app into a known state. Recording against production is refused by the method.

**Can I change the wording after the video is made?** Yes. Edit the storyboard, the agent mirrors it in `steps.js`, re-render. Nothing is hand-recorded.

**What about voice-over?** The storyboard is the script. Read it against the video, or feed it to a TTS step and mux the audio with ffmpeg. The method keeps copy short enough to be spoken at the hold time.

**Why half speed?** Headless capture is about 25 frames per second. Running the tour at half pace and stretching the video back doubles the effective frame rate with no other change.

## Documentation

- [SKILL.md](.agents/skills/walkthrough-anything/SKILL.md): the method, phases, gates, budgets and stop conditions.
- [templates/](templates): discovery ledger, storyboard spec and QA sheet.
- [prompts/](prompts): the start prompt and the storyboard review prompt.
- [engine/](engine): the tour runtime and its stylesheet.
- [recorder/](recorder): record and encode scripts.
- [AGENTS.md](AGENTS.md): guidelines for agents working inside this repository.
- [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT. See [LICENSE](LICENSE).
