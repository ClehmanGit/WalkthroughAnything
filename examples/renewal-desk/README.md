# Example: RenewalDesk

A single-file insurance renewal tool that compares an expiring policy with renewal quotes through Box AI. Four chapters, thirteen beats, 1:59.

The app's own source lives in a separate private repository and is not included here. This folder shows every artifact the method produces for a real app, so you can read the discovery, storyboard, fixtures, script and QA side by side with the finished video.

Files:

- `DISCOVERY.md`: the job sentence, view inventory and evidence ledger.
- `walkthrough.spec.md`: the approved storyboard, beat by beat.
- `setup.js`: seeds the app's state with three clients and stubs the Box API, so no token or network is needed. Slows the app's own animations by the capture speed factor.
- `steps.js`: the storyboard as engine calls.
- `QA.md`: the frame review of the final take.
- `out/renewal-desk.mp4`: the result.

## Regenerate

Regenerating needs a copy of the app. With the app's folder served on port 8791:

```bash
python -m http.server 8791 --bind 127.0.0.1 --directory path/to/renewal-desk-app
```

From the root of this repository:

```bash
cd recorder && npm run setup && cd ..
```

```bash
node recorder/record.js --url http://127.0.0.1:8791/index.html --steps examples/renewal-desk/steps.js --setup examples/renewal-desk/setup.js --out examples/renewal-desk/out --slow 2
```

```bash
node recorder/encode.js --in examples/renewal-desk/out/record.json --name renewal-desk --frames 12
```

## What the QA rounds changed

- Round 1: the spotlight stayed on the processing box after the results replaced it. Fix: release on the app's `done` signal (steps) and add a done state with a fade to the app itself.
- Round 2: the processing felt instant. Fix: stub delay 4.2 s per quote, scaled by the speed factor.
- Round 3: "Three tabs. One direction." read as a slogan. Rewritten to say what the tabs are. "About a minute each" removed from the app because it was never measured.
