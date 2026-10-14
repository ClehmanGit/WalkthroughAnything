/* RenewalDesk example: setup.js
   Runs in the page before the engine loads. Its only jobs are to put the app
   into a known, realistic state without touching Box, and to slow the app's
   own animations by the capture speed factor. Everything here is specific to
   RenewalDesk; your app needs its own setup.js (see references/fixtures.md). */
(function () {
  if (typeof closeOverlay === 'function') closeOverlay(); // the app opened Settings because there is no token
  /* ---------- sample data ---------- */
  const EVAL = {
    q1: {
      verdict: 'worse',
      bottomLine: 'Premium drops 8% but the retro date advances two years and defense costs move inside limits. Net exposure goes up. Negotiate the retro date before binding.',
      expiring: { carrier: 'Hartford', policyNumber: 'DO-4471-25', period: '1/1/25 – 1/1/26', premium: '$48,200' },
      candidate: { carrier: 'Travelers', policyNumber: 'Q-99812', period: '1/1/26 – 1/1/27', premium: '$44,300' },
      premiumDelta: '-$3,900 (-8.1%)',
      materialChanges: [
        { name: 'Retroactive date advanced', direction: 'worse', what: 'Retro date moves from 1/1/2018 to 1/1/2020.', impact: 'Wrongful acts between 2018 and 2020 lose coverage entirely.', ref: 'Declarations, Item 6', interaction: 'Compounds with defense-inside-limits: the older claims that do arise also erode the aggregate.' },
        { name: 'Defense costs inside limits', direction: 'worse', what: 'Defense now erodes the $5M aggregate instead of being paid in addition.', impact: 'A single contested claim could exhaust limits before any indemnity is paid.', ref: 'Endorsement 4', interaction: null },
        { name: 'Privacy regulatory carve-back', direction: 'better', what: 'Endorsement 9 grants back a $1M sublimit for privacy regulatory proceedings.', impact: 'Closes a gap the expiring policy excluded outright.', ref: 'Endorsement 9', interaction: null },
      ],
      sections: [
        { num: 1, name: 'Coverage Trigger & Time Architecture', fields: [
          { field: 'Form Type', expiring: 'Claims-made', candidate: 'Claims-made', diff: false, significance: null },
          { field: 'Retroactive Date', expiring: '1/1/2018', candidate: '1/1/2020', diff: true, significance: 'Two-year gap in prior acts coverage.' },
          { field: 'Extended Reporting', expiring: '12 months, 100% premium', candidate: '12 months, 100% premium', diff: false, significance: null } ] },
        { num: 2, name: 'Defense Cost Treatment', fields: [
          { field: 'Defense', expiring: 'Outside limits', candidate: 'Inside limits', diff: true, significance: 'Erodes the aggregate.' },
          { field: 'Duty to Defend', expiring: 'Yes', candidate: 'Yes', diff: false, significance: null } ] },
        { num: 3, name: 'Limits Architecture', fields: [
          { field: 'Aggregate', expiring: '$5,000,000', candidate: '$5,000,000', diff: false, significance: null },
          { field: 'Retention', expiring: '$50,000', candidate: '$50,000', diff: false, significance: null } ] },
        { num: 4, name: 'Exclusions', fields: [
          { field: 'Privacy / Regulatory', expiring: 'Absolute', candidate: 'Carve-back $1M', diff: true, significance: 'Partial grant-back via Endorsement 9.' } ] },
      ],
      interactions: [{ name: 'Retro date + defense inside limits', sections: '1,2', effect: 'Fewer covered years, and the ones that remain burn through limit faster.' }],
    },
    q2: {
      verdict: 'better',
      bottomLine: 'Same form, same retro date, premium up 3% for a $7.5M aggregate instead of $5M. A clean renewal with more runway.',
      expiring: { carrier: 'Hartford', policyNumber: 'DO-4471-25', period: '1/1/25 – 1/1/26', premium: '$48,200' },
      candidate: { carrier: 'Chubb', policyNumber: 'Q-20441', period: '1/1/26 – 1/1/27', premium: '$49,650' },
      premiumDelta: '+$1,450 (+3.0%)',
      materialChanges: [
        { name: 'Aggregate raised to $7.5M', direction: 'better', what: 'Aggregate limit increases from $5M to $7.5M.', impact: 'Fifty percent more capacity for a bad year at a 3% cost.', ref: 'Declarations, Item 3', interaction: null },
      ],
      sections: [
        { num: 1, name: 'Coverage Trigger & Time Architecture', fields: [
          { field: 'Form Type', expiring: 'Claims-made', candidate: 'Claims-made', diff: false, significance: null },
          { field: 'Retroactive Date', expiring: '1/1/2018', candidate: '1/1/2018', diff: false, significance: null } ] },
        { num: 3, name: 'Limits Architecture', fields: [
          { field: 'Aggregate', expiring: '$5,000,000', candidate: '$7,500,000', diff: true, significance: '50% more capacity.' },
          { field: 'Retention', expiring: '$50,000', candidate: '$50,000', diff: false, significance: null } ] },
      ],
      interactions: [],
    },
  };

  const REPORT = `# Recommendation
Bind **Chubb**. It keeps the expiring form and retro date, adds 50% more aggregate, and costs 3% more. Travelers is cheaper but moves the retro date and puts defense inside limits, which is a worse position for the insured. Runner-up: Travelers, only if the retro date is restored.

# Ranking
1. **Chubb** — $49,650 — same coverage architecture, bigger aggregate
2. **Travelers** — $44,300 — 8% saving does not pay for a two-year prior-acts gap

# Side-by-side
| Dimension | Chubb | Travelers |
|---|---|---|
| Premium | $49,650 | $44,300 |
| Aggregate | $7.5M | $5M |
| Retention | $50,000 | $50,000 |
| Retro date | 1/1/2018 | 1/1/2020 |
| Defense costs | Outside limits | Inside limits |
| Privacy regulatory | Excluded | $1M carve-back |

# Risks by candidate
- **Chubb:** no material downside identified. Confirm the privacy exclusion is unchanged from expiring.
- **Travelers:** uncovered wrongful acts 2018–2020; defense erosion of a $5M aggregate; both compound on older claims.

# Negotiation points
- **Chubb:** ask for the $1M privacy regulatory carve-back Travelers offered.
- **Travelers:** restore the 1/1/2018 retro date; move defense outside limits or raise the aggregate to $7.5M.`;

  const SPEED = window.__WA_SPEED || 1;
  /* ---------- stub Box ---------- */
  Box.ask = (ids, prompt) => new Promise(res => setTimeout(() => {
    if (prompt === COMPARE_PROMPT) return res({ answer: REPORT });
    res({ answer: JSON.stringify(EVAL[ids[1]] || EVAL.q1) });
  }, 4200 * SPEED));
  Box.upload = () => new Promise(res => setTimeout(() => res({ entries: [{ id: 'mock-' + Math.random().toString(36).slice(2) }] }), 500 * SPEED));
  Box.del = () => Promise.resolve();
  Box.content = () => Promise.resolve(new Response('Sample document'));

  /* ---------- seed state ---------- */
  S.connected = true; S.user = { name: 'Chris Lehman' };
  S.clients = [
    { id: 'c1', name: 'Veranda Real Estate', folders: { expiring: 'f1', quotes: 'f2', evaluated: 'f3', reports: 'f4' }, counts: { expiring: 1, quotes: 3, evaluated: 0, reports: 0 } },
    { id: 'c2', name: 'Harbor Logistics', folders: { expiring: 'f5', quotes: 'f6', evaluated: 'f7', reports: 'f8' }, counts: { expiring: 1, quotes: 2, evaluated: 2, reports: 1 } },
    { id: 'c3', name: 'Northgate Dental Group', folders: { expiring: 'f9', quotes: 'f10', evaluated: 'f11', reports: 'f12' }, counts: { expiring: 1, quotes: 0, evaluated: 0, reports: 0 } },
  ];
  S.workspaces.c1 = {
    loaded: true,
    expiring: [{ id: 'e1', name: 'Hartford_DO_2025.pdf', modified_at: '2026-09-01T00:00:00Z' }],
    quotes: [
      { id: 'q1', name: 'Travelers_Quote_2026.pdf', modified_at: '2026-09-20T00:00:00Z' },
      { id: 'q2', name: 'Chubb_Quote_2026.pdf', modified_at: '2026-09-21T00:00:00Z' },
      { id: 'q3', name: 'AIG_Indication_2026.pdf', modified_at: '2026-09-22T00:00:00Z' },
    ],
    evals: [], report: null, selExp: null, selQuotes: new Set(), activeEval: 0,
  };
  setConn(true, 'Chris Lehman');
  renderAll();

  // the app's own enter/leave animations and spinner follow the capture speed
  const slow = document.createElement('style');
  slow.textContent = `.ws-body.enter, .home.enter { animation-duration: calc(.3s * ${SPEED}); } .ws-body.leave { animation-duration: calc(.24s * ${SPEED}); } .spinner { animation-duration: calc(.8s * ${SPEED}); }`;
  document.head.appendChild(slow);
})();
