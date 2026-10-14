# Phase 1: Discovery

Goal: know the app well enough to say what its one job is, who does it, and which screens and controls the job passes through. Write it down with evidence before you storyboard anything.

Deliverable: `walkthrough/DISCOVERY.md` (template in `templates/DISCOVERY.md`).

## Read in this order

Each layer tells you something the previous one cannot. Stop early only if a layer makes the job unambiguous.

1. **README and docs.** The stated purpose and audience. Treat it as a claim, not a fact. Note the words the author uses for things; the video should use the same words.
2. **Entry points and routing.** `index.html`, the router, the top-level views or pages, the navigation component. This is the map of screens. List every route or view with the file that renders it.
3. **State and data model.** The main store, the types, the API client. The nouns here are the nouns of the job. The thing that gets created, transformed and finished is the job's subject.
4. **The primary action.** Find the handler that does the most consequential thing: the submit, the run, the publish, the save. Trace it backwards to the control that triggers it and forwards to the view that shows its result. That trace is the spine of the video.
5. **Empty, loading, error and done states.** Each conditional render is a state the viewer may need to see. Note the ones on the spine.
6. **Settings, auth, admin.** Note them. They go last in a video or not at all.
7. **Run it.** Walk the spine yourself in the browser. Record the CSS selector of every element you touch and every element that changes. Selectors are evidence; "the blue button" is not.

## What you must be able to write

A single sentence in this exact shape, with a file reference for each clause:

> A **[audience]** uses this to **[job]** by **[step] → [step] → [step]**.

Example: "A broker uses this to decide which renewal quote to bind by selecting the expiring policy (`renderDocs`, `index.html:1130`) → evaluating quotes against it (`runEvaluations`, `index.html:842`) → reading the verdict (`renderEvalDetail`, `index.html:1203`) → ranking all quotes (`runCompare`, `index.html:898`)."

If you cannot write this sentence, you are not done discovering. If you can write two different sentences and the code does not settle which is primary, stop and ask.

## The evidence ledger

Every row in the ledger is one fact about the app with where you saw it. Label each row as one of:

- **Observed**: present in code or DOM. Cite file and line, or selector.
- **Inferred**: a conclusion about intent or value. Cite the observations it rests on.
- **Unknown**: something the video might want to say but you could not verify. These never become card copy.

The storyboard may only highlight things backed by Observed rows and may only explain them with Inferred rows. Unknown rows are the list of questions for the user.

## Audience

Decide who the viewer is before writing a word. The same screen is explained differently to:

- **A first-time end user**: what to click, in what order, what they get.
- **An evaluator or buyer**: what the product does for them, what makes it different.
- **A teammate or maintainer**: where things live, how data flows.

Default to the first-time end user unless the request says otherwise. If the request is ambiguous and the audiences would produce materially different videos, ask.

## Output of this phase

- The job sentence with citations.
- A view inventory: every screen on the spine, its selector, how to reach it, which states it has.
- The evidence ledger.
- A list of Unknowns, phrased as questions for the user.
- A note of anything you deliberately left off the spine and why (settings, secondary features, admin).
