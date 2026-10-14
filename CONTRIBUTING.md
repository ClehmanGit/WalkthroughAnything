# Contributing

## Scope

WalkthroughAnything accepts changes that make walkthrough videos clearer for first-time viewers or make their production more deterministic. It does not accept features that make the output more decorative, add narration the recording cannot back, or trade reproducibility for convenience.

## Rules for rules

Every rule in `references/` carries the failure it prevents. A pull request that adds a rule must describe the walkthrough that went wrong without it. A pull request that removes a rule must show the failure no longer occurs or never occurred.

## Engine changes

- `engine/tour.js` stays dependency-free and injectable into any page.
- New API methods come with a row in `references/engine.md` and a use in an example.
- Timing semantics (video milliseconds, scaled by the speed factor inside the engine) do not change.

## Examples

A new example is a folder under `examples/<app>/` with `DISCOVERY.md`, `walkthrough.spec.md`, `setup.js` or `fixtures.json`, `steps.js`, `QA.md`, a README with the exact commands, and the MP4 those commands produce. CI for examples is a human: regenerate the video from the files before merging.

## Style

Short declarative sentences. Tables for inventories. Numbers as digits. No hedges.
