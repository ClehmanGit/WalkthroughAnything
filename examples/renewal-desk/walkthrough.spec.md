# Walkthrough spec: RenewalDesk

Audience: first-time broker  ·  Target length: 90–120 s  ·  Viewport: 1440×900  ·  Theme: accent #0B4FD6, navy #0B1D4A, logo `assets/logo.png`

Status: approved 2026-10-12 · recorded 2026-10-12

## Hook

Title card: logo. Subtitle: "A 90-second walkthrough". Hold 2.4 s.

## Chapters

### Chapter 1 · Clients (1 / 4)

| Beat | Target | Place | Title | Body | Action after | Rest | D / C / V / N |
|---|---|---|---|---|---|---|---|
| 1.1 | `.sidebar` (pad 0) | right | Clients come straight from Box | Every client is a Box folder with four sub-folders. The counts show what is already inside: expiring policies, quotes and finished evaluations. | click `.client-row[data-id="c1"]` | 1.5 s | pick a client / workspace opens / yes / folder-as-client is not obvious |
| 1.2 | `.tabs` | bottom | The tabs are the steps | Documents, Evaluations, Cross-compare. Work through them in order and the renewal is done. | none | 0.9 s + caption 2/4 | know the order / none / yes / tabs as a sequence |

### Chapter 2 · Documents (2 / 4)

| Beat | Target | Place | Title | Body | Action after | Rest | D / C / V / N |
|---|---|---|---|---|---|---|---|
| 2.1 | `.doc-panel:nth-child(1)` | bottom | Pick the expiring policy | One file. Upload it here or import it from anywhere in Box. | click `.doc-row[data-id="e1"]` | 0.6 s | choose the baseline / row selects, bar updates / yes / single-select rule |
| 2.2 | `.doc-panel:nth-child(2)` | bottom | Tick the quotes that came back | Select as many as you like. Each one gets its own evaluation against the expiring policy. | click q1, q2 | 1.2 s | choose candidates / multi-select, bar counts / yes / one eval per quote |
| 2.3 | `.action-bar` (pad 0) | top | The bar tells you what happens next | If something is missing it says what. When it is ready, it says exactly what will run. One click. | click `[data-act="run"]` | caption 3/4, 1.0 s | run or not / evaluation starts / yes / bar explains prerequisites |

### Chapter 3 · Evaluate (3 / 4)

| Beat | Target | Place | Title | Body | Action after | Rest | D / C / V / N |
|---|---|---|---|---|---|---|---|
| 3.1 | `.run-box` | right | Box AI reads each pair | Each quote is compared with the expiring policy, endorsements first. Results save to Box as they finish, so nothing is lost if a token expires mid-run. | park; wait for done; release spotlight; wait for results | 1.8 s | wait / results appear / yes (progress list) / per-quote save |
| 3.2 | `.verdict` | bottom | The verdict comes first | The first section gives you immediate value: the verdict, the premium movement and the bottom line, before you read a single clause. | none | 0.7 s | bind or not / none / yes / judgement before data |
| 3.3 | first..last `.ev-detail .change` | left | Only the changes that matter | What changed and why it matters, ordered by severity. Renumbering and boilerplate noise is filtered out before you see it. | none | 0.6 s | what to negotiate / feeds report / yes / noise filtering is the product |
| 3.4 | `.ev-detail .acc` (scroll) | top | Full detail on demand | The field-by-field comparison is still here, collapsed until you need it. | click `.acc-head`; park; 2.4 s | 0.6 s; scroll top | dig in / section opens / yes / collapsed by design |
| 3.5 | `.ev-rail` | bottom | Switch between quotes | Every evaluated quote gets a card. The colour is its verdict, so the shortlist reads at a glance. | click `.ev-item[data-i="1"]`; park; 2.2 s | caption 4/4, 0.8 s | compare quotes / detail switches / yes / colour = verdict |

### Chapter 4 · Compare (4 / 4)

| Beat | Target | Place | Title | Body | Action after | Rest | D / C / V / N |
|---|---|---|---|---|---|---|---|
| 4.1 | `.ev-rail [data-act="compare"]` | bottom | Rank them | Two or more saved evaluations unlock a ranked recommendation across every carrier. | click; release; park; wait | 1.4 s | rank / report generated / yes / unlock rule |
| 4.2 | `.prose` | left | A recommendation you can forward | Who to bind and why, a ranking, a side-by-side table, risks per candidate and negotiation points per carrier. Saved to Box automatically. | hide all; scroll to table; 2.2 s; scroll top | 0.3 s | act on it / saved / yes / fixed report sections |

### Wrap

| Beat | Target | Place | Title | Body | Action after | Rest | D / C / V / N |
|---|---|---|---|---|---|---|---|
| 5.1 | `.topbar [data-act="openSettings"]` | bottom | One token, pasted once | The Box token lives in Settings and auto-connects on every launch. No login screen. When it expires, a red bar tells you. | click; spotlight `.drawer`; park; 2.4 s; close | 0.9 s | get started / connected / yes / no login screen |

## Processing moments

| Where | What the viewer sees | Stub delay | Done signal | Release spotlight when |
|---|---|---|---|---|
| 2.3 → 3.1 | run box, two rows go queued → running → done | 4.2 s per quote (`Box.ask` stub) | `S.run.done` | on done, before the app fades to results |
| 4.1 | run box, one row | 4.2 s | `S.run === null` | immediately after click |

## Outro

Logo + flow: Documents → Evaluate → Verdict → Compare. Hold 3.2 s and keep.

## Intentionally left out

- Interactions list: expert detail, not actionable for a first-time viewer.
- New client, import from Box, preview, delete: housekeeping.
- Agent selection: advanced configuration.

## Open questions

None.
