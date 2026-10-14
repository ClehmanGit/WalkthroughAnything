# Discovery: RenewalDesk

Date: 2026-10-12  ·  Repository: `../../..` (single file `index.html`, assets in `assets/`)  ·  Runs at: `python -m http.server 8791`, http://127.0.0.1:8791/index.html

## The job sentence

> A **commercial insurance broker** uses this to **decide which renewal quote to bind** by **selecting the expiring policy** → **evaluating each quote against it** → **reading the verdict and material changes** → **ranking all quotes in one report**.

Citations: `renderDocs` (index.html, Documents tab, selection of expiring and quotes) · `runEvaluations` (index.html, calls `Box.ask` per selected quote, saves each result) · `renderEvalDetail` (index.html, verdict banner, material changes, full comparison) · `runCompare` (index.html, one `Box.ask` over all saved evaluations, saves the report).

## Audience

First-time end user (a broker opening the tool for the first time). The request said "walkthrough", named no other audience, and the app has no admin role.

## View inventory (the spine)

| # | View | Reached by | Selector(s) | States | On the spine? |
|---|---|---|---|---|---|
| 1 | Home: client cards and the four-step strip | load | `.home`, `.client-card`, `.steps` | with clients / none | orient only |
| 2 | Sidebar client list | always | `.sidebar`, `.client-row[data-id]` | with counts | yes |
| 3 | Workspace header and tabs | click client | `.ws-head`, `.tabs`, `.tab[data-tab]` | docs / evals / compare | yes |
| 4 | Documents: expiring panel | tab docs | `.doc-panel:nth-child(1)`, `.doc-row[data-id]` | empty / files / one selected | yes |
| 5 | Documents: quotes panel | tab docs | `.doc-panel:nth-child(2)`, `.doc-row[data-id]` | empty / files / n selected | yes |
| 6 | Action bar | tab docs | `.action-bar`, `[data-act="run"]` | missing expiring / missing quotes / ready | yes |
| 7 | Running box | click Evaluate | `.run-box`, `.run-item` | queued / running / done / failed; `S.run.done` | yes |
| 8 | Evaluation detail | after run | `.verdict`, `.id-row`, `.change`, `.acc`, `.ix-row` | better / worse / mixed / error / markdown | yes |
| 9 | Candidate rail | tab evals | `.ev-rail`, `.ev-item[data-i]`, `[data-act="compare"]` | 1..n evals; compare enabled at 2 saved | yes |
| 10 | Cross-compare report | click compare | `.prose`, `.cmp-head` | running / report / empty | yes |
| 11 | Settings drawer | gear | `.drawer`, `#tokenInput`, `#agentSelect` | token present / absent | wrap only |
| 12 | New client modal | sidebar New | `.modal`, `#ncName` | | off |
| 13 | Box file picker | Import from Box | `.picker` | | off |
| 14 | File preview | eye icon | `.preview` | pdf / md / json / image | off |

## Primary action trace

`[data-act="run"]` → `A.run` → `runEvaluations()` → `Box.ask([expiring, quote], EVAL_PROMPT)` per quote → `normalize()` → `w.evals` → `S.run.done` + 1.1 s + `leaveView()` → `S.tab = 'evals'` → `renderEvals` → `renderEvalDetail`. Each result is then uploaded by `saveEval` and gets a `fileId`, which `runCompare` requires (two or more).

## Evidence ledger

| Kind | Fact | Where |
|---|---|---|
| Observed | Clients are folders under a root Box folder with four fixed sub-folders | `CONFIG.FOLDERS`, `loadClients` |
| Observed | Sidebar rows show counts of expiring, quotes, evals | `renderSidebar` |
| Observed | Exactly one expiring file can be selected; many quotes | `A.selectExp`, `A.toggleQuote` |
| Observed | The action bar explains the missing prerequisite or what will run | `renderDocs`, `status` branches |
| Observed | Evaluation runs sequentially and renders progress per quote | `runEvaluations` loop, `renderRunning` |
| Observed | Results save to Box automatically after the run | `saveEval` called for each fresh eval |
| Observed | Detail leads with verdict, premium delta, bottom line; then material changes; then collapsed sections | `renderEvalDetail` order |
| Observed | Material changes carry direction, what, impact, ref, interaction | `EVAL_PROMPT` schema, `.change` render |
| Observed | Cross-compare needs two saved evals and produces Markdown with five fixed sections | `runCompare`, `COMPARE_PROMPT` |
| Observed | Token is stored in localStorage and auto-connects; 401 shows a banner | `resolveToken`, `onAuthFail` |
| Inferred | The product's value is filtering noise to the changes a broker must negotiate | prompt rules on materiality; `.change` first in detail |
| Inferred | The processing wait should be shown briefly: results arrive per quote and save as they go | sequential loop + per-eval save |
| Unknown | How long a real Box AI evaluation takes | not measured; no durations in copy |

## Left off the spine, and why

- Interactions list: expert detail a first-time viewer cannot act on.
- New client, Box picker, file preview, delete: housekeeping, not the job.
- Agent selection in Settings: advanced configuration.

## Questions for the user

None blocking. The audience and job were unambiguous in the request and the code.
