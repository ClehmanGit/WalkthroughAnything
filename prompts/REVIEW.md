# Storyboard review prompt

Run this as a second pass (a fresh agent or the same one after a break) on a draft `walkthrough.spec.md` before approval. It catches the failures that are cheap to fix now and expensive after recording.

```
Review walkthrough/walkthrough.spec.md against:
  .agents/skills/walkthrough-anything/references/highlighting.md
  .agents/skills/walkthrough-anything/references/writing.md
  .agents/skills/walkthrough-anything/references/flow.md
and DISCOVERY.md for evidence.

For every beat, answer:
  1. Is each of Decision / Consequence / Visible / Novel backed by an Observed or
     Inferred row in DISCOVERY.md? Name the row or mark the beat "unsupported".
  2. Does the title exceed 6 words or the body 28? Does either contain a banned
     word, an unmeasured number, meta-narration or appearance description?
  3. Does the beat follow a state change without a rest? Is its target removed
     by its own action without a release?
  4. Does the same idea appear in an adjacent beat?

Then check the whole:
  - Chapters 4–6, beats 8–16, projected length within budget using
    1.0 s + 0.15 s per word per card plus rests and actions.
  - The sequence is hook → orient → job → payoff → wrap → outro.
  - Every processing moment has a stub delay of 3–8 s and a done signal.
  - "Intentionally left out" lists everything on the view inventory that is
    not in the spec.

Output a table of beats with pass/fail per question and a concrete rewrite for
each failure. Do not approve a spec with an unsupported beat.
```
