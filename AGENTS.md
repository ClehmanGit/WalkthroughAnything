# Repository Guidelines

## Purpose and authority

WalkthroughAnything turns a running web application plus its repository into a short teaching video. The method lives in `.agents/skills/walkthrough-anything`; the toolkit lives in `engine/` and `recorder/`. When asked to produce a walkthrough, read `SKILL.md` first and follow its phases and gates. Do not skip the storyboard gate to save time; it is where the user's corrections are cheapest.

Distinguish what you observed in the target repository (routes, handlers, selectors, labels) from what you inferred (why a viewer cares) and from what you do not know. Only observed facts may be highlighted; only inferences backed by observations may explain them; unknowns are questions for the user and never become card copy.

The user selects the target application. If no app, path or URL is named, ask. Never choose an example or a sibling project on the user's behalf. Never record against a production backend, never type real credentials, never state a measurement you did not take.

## Working in this repository

- `engine/tour.js` and `engine/tour.css` are the runtime injected into target pages. Keep them dependency-free, namespaced `wa-`, and safe to inject into any page: no globals other than `Walkthrough`, `createWalkthrough`, `__walkthroughRun`, `__walkthroughSteps`, `__walkthroughDone`, `__walkthroughError`, `__WA_SPEED`.
- All engine timings are in video milliseconds and are scaled by the speed factor inside the engine. Steps files never multiply by the factor themselves.
- `recorder/record.js` and `recorder/encode.js` are the only two commands a user needs. Options are flags with defaults; nothing is read from the environment except `FFMPEG` as a fallback binary path.
- Reference documents under `references/` each cover one phase. Keep rules declarative and testable. Prefer "at most 28 words" to "keep it short".
- Examples under `examples/<app>/` contain `DISCOVERY.md`, `walkthrough.spec.md`, `setup.js` or `fixtures.json`, `steps.js`, `QA.md` and the final MP4. An example is only complete when its video regenerates from its files.

## Changing the method

A rule enters a reference file only with the failure it prevents written next to it. Rules without a failure story are removed. When a QA round on a real app reveals a new failure mode, add the rule, the failure and the fix to the matching reference, and if it changed the engine, bump `metadata.version` in `SKILL.md`.

## Style

Short declarative sentences. Imperatives for instructions. Tables for inventories. No hedging language in rules. Cite files with paths and, where useful, line numbers.
