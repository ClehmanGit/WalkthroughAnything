/* <app name>: steps.js
   One engine call per row of walkthrough.spec.md, in order. Keep the beat
   numbers in comments so spec and script can be diffed by eye.
   Times are video milliseconds; the engine applies the speed factor. */
window.__walkthroughSteps = async (W) => {
  W.theme({ accent: '#0B4FD6', navy: '#0B1D4A' }); // match the app

  // Hook
  await W.titleCard({ logo: 'assets/logo.png', sub: 'A 90-second walkthrough', instant: true });
  // or: await W.titleCard({ title: 'App name', sub: '...' });

  // Chapter 1 · <caption> (1 / N)
  await W.breathe(1200, '<Caption>', '1 / N');
  // 1.1
  await W.explain('<selector>', { place: 'right', title: '<≤6 words>', body: '<≤28 words>' });
  await W.click('<selector>');
  await W.breathe(1500);
  W.endChapter();

  // Chapter 2 · <caption> (2 / N)
  await W.breathe(900, '<Caption>', '2 / N');
  // 2.1
  await W.explain('<selector>', { place: 'bottom', title: '', body: '' });
  await W.click('<selector>');
  await W.sleep(600);

  // A processing moment (see flow.md "Processing and waiting")
  await W.explain('<progress selector>', { place: 'right', title: '', body: '' });
  W.hideCard();
  await W.park();
  await W.waitFor(() => /* the app's own done signal */ false, 30000);
  W.hideSpot();
  await W.waitFor(() => /* the result is visible */ true, 30000);
  await W.breathe(1800);
  W.endChapter();

  // Payoff
  // 3.1
  await W.explain('<result selector>', { place: 'bottom', title: '', body: '' });
  await W.breathe(700);

  // Outro: keep so the video ends on it
  await W.titleCard({ logo: 'assets/logo.png', flow: ['<Step>', '<Step>', '<Step>'], hold: 3200, keep: true });
};
