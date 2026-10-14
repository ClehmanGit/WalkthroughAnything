# Phase 6: QA

You cannot watch the video from inside an agent, so you review it the way an editor would: frame by frame, against a checklist, with the storyboard beside you. The encoder gives you the frames. Look at every one.

Deliverable: `walkthrough/QA.md` (template in `templates/QA.md`): one row per frame, pass or fail per check, a revision list, and the result of the re-render.

## Per-frame checks

For every file in `out/frames/`:

1. **Nothing lingers.** No card or spotlight over a page that has changed under it. No spotlight on empty space.
2. **The card does not cover its target.** The thing being explained is fully visible.
3. **One idea on screen.** One spotlight, one card, one caption at most.
4. **Copy fits.** The card has no clipped or wrapped-to-four-lines text.
5. **Cursor is out of the way** when a card is up, or on its target when acting.
6. **The page is settled.** No half-faded panels, no mid-scroll blur, no spinner where the storyboard says the result is shown.
7. **Data is plausible.** No placeholder text, no empty lists where the storyboard expects items, no test-looking names.
8. **Theme matches.** The chrome colour matches the app's accent; fonts loaded (no fallback serif).

## Whole-video checks

- Duration within budget. Chapter count and beat count match the spec.
- First frame is the title card, last frame is the outro card.
- Every beat in the spec appears in order; nothing in the video is absent from the spec.
- `record.json` has no error and no page errors.
- Read every card's copy once more against writing.md. Any banned word, any unmeasured number, any meta-narration: fix it.

## Targeted frames

Even intervals miss transitions. Extract extra frames around every state change: 0.3 s before the click, 0.3 s after, and 1 s after. Run the encoder's frame extraction with `--frames 24` or call ffmpeg directly for exact times.

## Revise, do not patch

- A lingering highlight: release it earlier in `steps.js` (hide before the click).
- A sudden transition: add a done state and a fade to the app, then a breather to the script.
- Too fast: raise the stub delay in `setup.js` or `fixtures.json`; never pad with `sleep` alone.
- Copy problems: edit the spec first, then the script, so they never diverge.
- A card covering its target: change `place`, or reduce the target with a more specific selector.

Then re-record and re-review. Two or three rounds is normal. Note each round in QA.md so the user can see what changed and why.

## Deliver

- The MP4.
- The spec, so the user can request changes by beat number.
- One paragraph stating what the video intentionally leaves out and why (from the discovery ledger's "left off the spine" list).
- The exact commands to regenerate.
