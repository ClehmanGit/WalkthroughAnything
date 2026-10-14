/* RenewalDesk example: steps.js
   The storyboard in walkthrough.spec.md, expressed as engine calls.
   Every beat below maps to a numbered beat in the spec. Holds are left to the
   engine's reading-time formula unless a beat needs the viewer to watch
   something happen (then `hold` is explicit and the reason is in the spec). */
window.__walkthroughSteps = async (W) => {
  const q = W.q;
  W.theme({ accent: '#0B4FD6', navy: '#0B1D4A' });

  // Hook
  await W.titleCard({ logo: 'assets/logo.png', sub: 'A 90-second walkthrough', hold: 2400, instant: true });

  // Chapter 1: Clients
  await W.breathe(1200, 'Clients', '1 / 4');
  await W.explain('.sidebar', { place: 'right', pad: 0, title: 'Clients come straight from Box', body: 'Every client is a Box folder with four sub-folders. The counts show what is already inside: expiring policies, quotes and finished evaluations.' });
  await W.click('.client-row[data-id="c1"]');
  await W.breathe(1500);
  W.endChapter();

  await W.explain('.tabs', { place: 'bottom', title: 'The tabs are the steps', body: 'Documents, Evaluations, Cross-compare. Work through them in order and the renewal is done.' });
  await W.breathe(900, 'Documents', '2 / 4');

  // Chapter 2: Documents
  await W.explain('.doc-panel:nth-child(1)', { place: 'bottom', title: 'Pick the expiring policy', body: 'One file. Upload it here or import it from anywhere in Box.' });
  await W.click('.doc-row[data-id="e1"]');
  await W.sleep(600);

  await W.explain('.doc-panel:nth-child(2)', { place: 'bottom', title: 'Tick the quotes that came back', body: 'Select as many as you like. Each one gets its own evaluation against the expiring policy.' });
  await W.click('.doc-row[data-id="q1"]');
  await W.click('.doc-row[data-id="q2"]');
  await W.breathe(1200);

  await W.explain('.action-bar', { place: 'top', pad: 0, title: 'The bar tells you what happens next', body: 'If something is missing it says what. When it is ready, it says exactly what will run. One click.' });
  await W.click('[data-act="run"]');
  W.endChapter();
  await W.breathe(1000, 'Evaluate', '3 / 4');

  // Chapter 3: Evaluate
  await W.explain('.run-box', { place: 'right', title: 'Box AI reads each pair', body: 'Each quote is compared with the expiring policy, endorsements first. Results save to Box as they finish, so nothing is lost if a token expires mid-run.' });
  W.hideCard();
  await W.park();
  await W.waitFor(() => !S.run || S.run.done);   // release the spotlight the moment the app says Done
  W.hideSpot();
  await W.waitFor(() => !S.run);
  await W.breathe(1800);
  W.endChapter();

  await W.explain('.verdict', { place: 'bottom', title: 'The verdict comes first', body: 'The first section gives you immediate value: the verdict, the premium movement and the bottom line, before you read a single clause.' });
  await W.breathe(700);

  const changes = () => [...document.querySelectorAll('.ev-detail .change')];
  await W.explain([() => changes()[0], () => changes().slice(-1)[0]], { place: 'left', title: 'Only the changes that matter', body: 'What changed and why it matters, ordered by severity. Renumbering and boilerplate noise is filtered out before you see it.' });
  await W.breathe(600);

  await W.explain('.ev-detail .acc', { scroll: true, place: 'top', title: 'Full detail on demand', body: 'The field-by-field comparison is still here, collapsed until you need it.' });
  await W.click('.ev-detail .acc .acc-head');
  W.hideCard();
  await W.park();
  await W.sleep(2400);
  await W.breathe(600);

  await W.scrollTop('.main');
  await W.explain('.ev-rail', { place: 'bottom', title: 'Switch between quotes', body: 'Every evaluated quote gets a card. The colour is its verdict, so the shortlist reads at a glance.' });
  await W.click('.ev-item[data-i="1"]');
  W.hideCard();
  await W.park();
  await W.sleep(2200);
  await W.breathe(800, 'Compare', '4 / 4');

  // Chapter 4: Compare
  await W.explain('.ev-rail [data-act="compare"]', { place: 'bottom', title: 'Rank them', body: 'Two or more saved evaluations unlock a ranked recommendation across every carrier.' });
  await W.click('.ev-rail [data-act="compare"]');
  W.hideCard(); W.hideSpot();
  await W.park();
  await W.waitFor(() => !S.run);
  await W.breathe(1400);
  W.endChapter();

  await W.explain('.prose', { place: 'left', title: 'A recommendation you can forward', body: 'Who to bind and why, a ranking, a side-by-side table, risks per candidate and negotiation points per carrier. Saved to Box automatically.' });
  W.hideAll();
  await W.scrollTo('.prose table');
  await W.sleep(2200);
  await W.scrollTop('.main');
  await W.breathe(300);

  // Wrap: admin last
  await W.explain('.topbar [data-act="openSettings"]', { place: 'bottom', title: 'One token, pasted once', body: 'The Box token lives in Settings and auto-connects on every launch. No login screen. When it expires, a red bar tells you.' });
  await W.click('.topbar [data-act="openSettings"]');
  W.hideCard();
  await W.sleep(500);
  W.showSpot('.drawer', 0);
  await W.park();
  await W.sleep(2400);
  W.hideSpot();
  closeOverlay();
  await W.breathe(900);

  // Outro: hold on the card so the video ends on it
  await W.titleCard({ logo: 'assets/logo.png', flow: ['Documents', 'Evaluate', 'Verdict', 'Compare'], hold: 3200, keep: true });
};
