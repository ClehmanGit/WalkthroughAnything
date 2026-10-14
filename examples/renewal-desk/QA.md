# QA: RenewalDesk

Take: 2 (generic engine)  ·  Video: `out/renewal-desk.mp4`  ·  Duration: 115.3 s  ·  record.json errors: none  ·  page log: empty

## Frame review

Checks: 1 nothing lingers · 2 card clear of target · 3 one idea · 4 copy fits · 5 cursor parked/on target · 6 page settled · 7 data plausible · 8 theme/fonts

| Frame | Beat | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.5 s | hook | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | App visible through the half-faded title card. Fixed in take 3 with `instant: true`. |
| 8.9 s | 1.1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Card overlaps the home lede, not the sidebar target. Acceptable. |
| 17.7 s | 1.2 → 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| 26.6 s | 2.2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Expiring row shows selected; quotes panel highlighted; caption 2 / 4. |
| 35.5 s | 2.3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| 44.4 s | 3.1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Card auto-flipped to the left of the run box; one row done, one running. |
| 53.2 s | 3.2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Card sits over the Expiring id card, which is not the target. |
| 62.1 s | 3.4 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Scrolled; accordion highlighted; card above it. |
| 71.0 s | 3.4 open | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| 79.9 s | 3.5 → 4 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Second quote selected (BETTER); caption 4 / 4. |
| 88.7 s | 4.1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| 97.6 s | 4.2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Report table in view, nothing highlighted, cursor parked. |
| 106.5 s | 5.1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Settings drawer spotlit. |
| 115.1 s | outro | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Logo and flow, held. |

## Whole-video checks

- [x] Duration within budget (115 s of 60–120)
- [x] Chapter and beat count match the spec (4 chapters, 13 beats)
- [x] First frame title card (after take 3), last frame outro
- [x] Every spec beat present, in order; nothing extra
- [x] Copy re-read against writing.md: no banned words, no unmeasured numbers

## Revisions for the next take

| # | Frame / beat | Problem | Fix |
|---|---|---|---|
| 1 | 0.5 s / hook | Title card fades in over the app | engine: `titleCard({ instant: true })`; steps: use it on the hook |

## Result after re-render

Take 3: first frame is the opaque title card. All other frames unchanged. Duration 118.9 s (the MP4 includes about 1.5 s of page load before the tour starts).

## Earlier takes (hand-built engine, before this repository)

- Take 1 (1:37): spotlight lingered on the processing box after results replaced it; processing too fast; hard cut to results. Fixes: spotlight tracking and release on done (engine), 4.2 s stub delay (setup), done state + fade (app).
- Take 2 (1:45): callouts covered their targets on two beats. Fix: auto-flip placement (engine), `bottom` placement for rail beats (steps).
- Take 3 (1:52): copy notes from the user: slogan-like tab card rewritten, unmeasured "about a minute each" removed from the app, outro sign-off line removed.
