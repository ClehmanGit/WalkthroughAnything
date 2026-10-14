# Phase 5: Recording and encoding

Two commands. Both are deterministic: the same steps file produces the same video every time, so revisions are edits, never re-shoots.

## Setup (once per machine)

```bash
cd recorder
npm run setup        # installs Playwright, Chromium and a static ffmpeg
```

## Record

```bash
node recorder/record.js \
  --url http://localhost:3000 \
  --steps walkthrough/steps.js \
  --setup walkthrough/setup.js \
  --fixtures walkthrough/fixtures.json \
  --out walkthrough/out \
  --slow 2 \
  --size 1440x900
```

What it does: launches headless Chromium at the viewport size, applies fixtures, opens the URL, runs `setup.js`, injects the engine, injects `steps.js`, runs the tour, waits for done, writes `out/<hash>.webm` and `out/record.json` (metadata, console log, errors).

### Why half speed

Playwright captures about 25 frames per second and only on repaint. At `--slow 2` every animation runs at half pace, so twice as many distinct frames are captured per video second. The encoder stretches time back. The result plays at the intended pace at an effective 50 fps and looks smooth. Use `--slow 1` only for a quick headed preview.

### Viewport

1440×900 is the default and reads well on a laptop and in a slide. Use 1920×1080 for a conference screen, 1280×800 for a narrow docs page. The storyboard's card placements assume the chosen size; change it before scripting, not after.

## Encode

```bash
node recorder/encode.js --in walkthrough/out/record.json --name my-app --frames 12 [--gif]
```

What it does: time-stretches by the slow factor, writes `my-app.mp4` (H.264, 60 fps, CRF 19, faststart), extracts `frames/f-<sec>.jpg` at twelve even intervals plus first and last, and optionally a 960px GIF.

## Read record.json before looking at the video

- `error` must be null. A steps exception means the video is incomplete.
- `log` must be empty of `pageerror`. Console warnings from the app are acceptable only if they also occur without the tour.
- `videoSeconds` must be within the budget in SKILL.md.

## Windows

Paths over about 250 characters break git and ffmpeg. The encoder works in a short temp directory automatically. If the recorder fails to install, move the repo closer to the drive root.

## Reproducibility

Commit `steps.js`, `setup.js`, `fixtures.json` and `walkthrough.spec.md`. Do not commit `out/` except the final MP4 if the user wants it in the repo. Anyone with the repo and a running app can regenerate the video with the two commands above.
