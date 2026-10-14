/* <app name>: setup.js
   Runs in the page after load and before the engine. Put the app into the
   first storyboarded state with realistic data, without network or secrets.
   Delete the strategies you do not use. */
(function () {
  const SPEED = window.__WA_SPEED || 1;

  // 1. Close anything the app opened because config is missing (login, token prompt, cookie banner).
  // document.querySelector('.login-modal .close')?.click();

  // 2a. Seed in-page state (apps that expose a store or state object).
  // window.store.setState({ clients: [ { id: 'c1', name: 'Veranda Real Estate' } ] });
  // window.render();

  // 2b. Stub the API client (apps with a client module reachable from window).
  // Timings the viewer should see: 3–8 s, multiplied by SPEED. Timings they should not: < 500 ms.
  // Api.evaluate = () => new Promise(r => setTimeout(() => r(FIXTURE_RESULT), 4200 * SPEED));
  // Api.save = () => new Promise(r => setTimeout(() => r({ ok: true }), 400 * SPEED));

  // (Apps that fetch over HTTP: use --fixtures fixtures.json instead; see references/fixtures.md.)

  // 3. Slow the app's own animations so they play at normal pace after time-stretching.
  const slow = document.createElement('style');
  slow.textContent = `
    /* .panel.enter { animation-duration: calc(.3s * ${SPEED}); } */
    /* .spinner { animation-duration: calc(.8s * ${SPEED}); } */
  `;
  document.head.appendChild(slow);

  // 4. Hide dev-only chrome (HMR overlays, debug toolbars).
  // document.querySelector('#__next-build-watcher')?.remove();
})();
