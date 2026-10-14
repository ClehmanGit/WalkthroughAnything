# Start prompt

Paste this to an agent that does not auto-load `.agents/skills`. Replace the angle-bracket fields.

```
You are producing a walkthrough video with the WalkthroughAnything method.

Read, in order, and follow exactly:
  .agents/skills/walkthrough-anything/SKILL.md
  .agents/skills/walkthrough-anything/references/discovery.md
  .agents/skills/walkthrough-anything/references/highlighting.md
  .agents/skills/walkthrough-anything/references/writing.md
  .agents/skills/walkthrough-anything/references/flow.md
and the remaining references when you reach their phase.

Target application: <path to repo>
It runs with: <command>, at <URL>
Viewer: <first-time end user | evaluator | maintainer>
Length budget: <60–120> seconds
Theme: <accent hex, navy hex, logo path> (or: match the app)

Work the phases in order. Write DISCOVERY.md, then the storyboard as
walkthrough/walkthrough.spec.md, and STOP. Show me the job sentence with its
citations, the chapters and beats, and your list of questions. Do not write
steps.js until I approve the storyboard.

Rules you may not break: narrate only what the recording shows; no numbers you
did not measure; no real credentials or production backends; one spotlight at
a time; a breather after every state change; the video ends on the outro card.
```

## After approval

```
Storyboard approved with these changes: <list by beat number>.
Build fixtures, write steps.js, record, encode, and review every frame against
references/qa.md. Deliver the MP4, the final spec, QA.md, and one paragraph on
what the video leaves out.
```
