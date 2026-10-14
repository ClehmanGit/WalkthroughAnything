# Phase 4: The engine and the steps file

The engine (`engine/tour.js` + `engine/tour.css`) is injected into the running page. Your `steps.js` registers one async function that drives it. The function is the storyboard, beat for beat.

## Steps file contract

```js
window.__walkthroughSteps = async (W) => {
  await W.titleCard({ logo: 'assets/logo.png', sub: 'A 90-second walkthrough' });
  await W.breathe(1200, 'Clients', '1 / 4');
  await W.explain('.sidebar', { place: 'right', title: 'Clients come from Box', body: '...' });
  await W.click('.client-row[data-id="c1"]');
  await W.breathe(1500);
  // ...
  await W.titleCard({ logo: 'assets/logo.png', flow: ['Documents', 'Evaluate', 'Verdict', 'Compare'], keep: true });
};
```

The recorder calls `window.__walkthroughRun()`, which awaits fonts, runs your function, and sets `window.__walkthroughDone`. An exception sets `window.__walkthroughError` and fails the recording.

All times are in video milliseconds. The engine multiplies by the speed factor; do not.

## Targets

A target is a CSS selector, an element, a function returning an element, or an array of those (the spotlight covers their union). Use a function when the element is created after the step starts:

```js
await W.explain([() => rows()[0], () => rows().slice(-1)[0]], { ... });
```

Prefer stable selectors: `data-*` attributes, ids, semantic classes. Never `:nth-of-type` across mixed siblings; never selectors that depend on text.

## API

| Call | What it does |
|---|---|
| `titleCard({ logo \| title, sub, flow, hold, keep, instant })` | Full-screen card. `flow` animates a step list. `keep: true` leaves it on screen (use for the outro). `instant: true` shows it without a fade-in (use for the hook, so the first frame is the card, not the app). |
| `breathe(ms, label?, k?)` | Hides card and spotlight, shows the plain page. With `label` and `k`, shows a chapter caption ("2 / 4 Documents"). |
| `endChapter()` | Hides the chapter caption. |
| `explain(target, { place, title, body, hold, pad, scroll })` | Spotlight + card. `place`: right, left, top, bottom (auto-flips if it would cover the target). `hold` defaults to reading time. `scroll: true` centres the target first. |
| `click(target, { x, y })` | Moves the cursor on an eased curve, pauses, presses with a ripple, dispatches a real click. |
| `hover(target)` | Moves the cursor and fires mouseover/mouseenter. |
| `type(target, text, perChar)` | Clicks, then types character by character firing input events. |
| `park()` | Moves the cursor to the bottom-right corner. |
| `scrollTo(target)` / `scrollTop(container)` | Smooth scroll, then waits. |
| `showSpot(target, pad)` / `hideSpot()` | Spotlight without a card. |
| `showCard(target, place, title, body)` / `hideCard()` | Card without changing the spotlight. |
| `hideAll()` | Card, spotlight and caption off. |
| `waitFor(fn, maxMs)` | Polls a predicate. Use it to wait for the app's own state. |
| `sleep(ms)` | Speed-scaled wait. |
| `theme({ accent, navy, card, ink, display, body, mono })` | Sets the `--wa-*` CSS variables. Match the app's palette. |
| `slowHost(css)` | Injects CSS that slows the host app's animations by the speed factor. |
| `readTime(title, body)` | The hold formula: 1.0 s + 0.15 s per word, minimum 2.4 s. A full 34-word card holds 6.1 s. |

## Patterns

**Act then rest.** Every click that changes the view is followed by `breathe`.

**Release before the page changes.** Before a click that removes the spotlight's target, call `hideCard()` and `hideSpot()`.

**Watch a process.** Explain once, then:

```js
W.hideCard(); await W.park();
await W.waitFor(() => app.done);  // the app's own signal
W.hideSpot();
await W.waitFor(() => app.resultVisible);
await W.breathe(1800);
```

**Open something, then let it be seen.** `click`, `hideCard`, `park`, `sleep`, `breathe`. No second card for the same target.

**Theme first.** Call `W.theme` at the top so the chrome matches the app.

## Running it by hand

Add a hook to the app, or use the recorder with `--headed`:

```bash
node recorder/record.js --url http://localhost:3000 --steps walkthrough/steps.js --setup walkthrough/setup.js --headed --slow 1
```

Watch it once at full speed before recording. Missing targets are logged as `[walkthrough] click target missing` and must be fixed, not ignored.
