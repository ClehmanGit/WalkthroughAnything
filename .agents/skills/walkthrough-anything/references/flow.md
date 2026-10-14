# Flow, pacing and transitions

A walkthrough is a sequence of moments with rests between them. The moments teach; the rests let the teaching land. Most bad walkthroughs fail in the rests: a highlight lingers over a page that has changed, a card appears before the screen has settled, the cursor hovers over the text the viewer is trying to read.

## Shape of the video

1. **Hook** (2–3 s). Title card: logo, one line, shown instantly so the first frame is the card and not the app. The viewer learns what they are about to watch.
2. **Orient** (one chapter). Where things live. The map before the journey. One or two beats.
3. **The job** (two to four chapters). Each chapter is one step of the job sentence from discovery. Each beat is one decision inside that step.
4. **The payoff** (one chapter). The result, led by the most important element, then the detail on demand.
5. **Wrap** (optional, short). Settings or admin the viewer needs once. Only if they cannot start without it.
6. **Outro** (3 s). Logo and the steps of the job as a flow. Hold on it; the video ends here.

## The beat

A beat is: spotlight arrives → card fades in → viewer reads → cursor acts (or not) → page responds → rest.

- Spotlight and card appear together. Never a spotlight without a card for more than two seconds, except to let a viewer watch a process complete.
- The hold is computed from word count. Override it only to let something finish on screen, and say why in the spec.
- Act after the viewer has read, not during.

## Breathers

A breather is the page shown plainly with nothing highlighted. Use one:

- After every click that changes the view. The viewer needs to see the new page whole before you point at part of it.
- Before and after a chapter caption.
- After a result appears. Let it be seen before it is explained.
- Whenever two highlights would otherwise be back to back on different parts of the screen.

Length: 0.6 s for a small change, 1.2–1.8 s for a new view, longer with a chapter caption.

## Transitions that must never happen

- A spotlight over a target that has left the page. Release the spotlight before any click that re-renders its target.
- A card whose target scrolled away. The engine's spotlight tracks; the card does not. Hide the card before scrolling.
- A highlight appearing while the page is animating in. Wait for the app's own enter animation to finish, then highlight.
- A hard cut from a processing state to a result. Show a done state, pause, fade out, fade in. If the app does not do this, add it to the app; it improves the product too.
- Two cards in a row on the same target. Merge them.

## Processing and waiting

Real work takes time and the viewer should see it, briefly:

- Show the working state for at least 3 seconds and at most 8. Stub the backend to a fixed delay inside that range.
- Explain what is happening once, then park the cursor and release the card.
- When the app reports done, release the spotlight before the view changes.
- Rest on the result before explaining it.

## Cursor

- Moves on an eased curve, 0.85 s per move. Never teleports.
- Pauses 0.2 s over the target before pressing. The press is visible: a scale and a ripple.
- Parks in the bottom-right corner while the viewer reads. A cursor over text is noise.
- Never moves during a title card or a chapter caption.

## Spotlight

- One at a time. Padding 8 px for controls, 0 for panels that already have a border.
- Animates between targets in 0.6 s, then follows its target every frame through scrolls and re-renders.
- Fades out on its own if the target leaves the page. Do not rely on this; release it deliberately.
- The dim around it is dark enough to isolate, light enough to keep the page readable. Do not black out.

## Scrolling

- Scroll to centre the target, wait for the scroll to finish, then highlight.
- Scroll back to the top before leaving a view so the next beat starts from a known place.
- Never highlight during a scroll.

## Timing budget per chapter

Rough shape for a 90-second video with four chapters: hook 3 s, orient 12 s, job chapters 15–20 s each, payoff 25 s, wrap 10 s, outro 4 s. If a chapter runs past 25 s, it has too many beats or the holds are too long.

## Rhythm

Alternate: explain, act, rest. Three explains in a row is a lecture. Three acts in a row is a speedrun. If two consecutive beats have the same shape, change one.
