/* WalkthroughAnything tour engine.
   A small runtime that drives a real web page with an animated cursor, a
   spotlight that follows its target, explainer cards, chapter captions and
   title cards. It is injected into the page by the recorder (or by a
   `?walkthrough` hook you add to your app) and then handed a steps script.

   Public API: window.Walkthrough (also returned by createWalkthrough()).
   Every duration is in "video seconds"; the engine multiplies by SPEED so a
   half-speed capture plays back at the intended pace.

   No dependencies. Works in any page; the only assumption is that the app
   renders into the DOM so elements can be found by selector. */
(function () {
  const params = new URLSearchParams(location.search);
  const SPEED = Math.max(1, +(window.__WA_SPEED || params.get('wa_slow')) || 1);
  document.documentElement.style.setProperty('--wa-trs', SPEED);

  /* ---------- DOM chrome ---------- */
  function el(tag, id, html) { let d = document.getElementById(id); if (d) return d; d = document.createElement(tag); d.id = id; if (html) d.innerHTML = html; document.body.appendChild(d); return d; }
  const cursor = el('div', 'wa-cursor', `<svg width="22" height="30" viewBox="0 0 22 30"><path d="M3 2l15 13-7 1 4 9-3 1.5-4-9-5 5z" fill="#fff" stroke="#0B1D4A" stroke-width="1.6" stroke-linejoin="round"/></svg>`);
  const spot = el('div', 'wa-spot');
  const card = el('div', 'wa-card');
  const chapter = el('div', 'wa-chapter');
  const title = el('div', 'wa-title');

  /* ---------- primitives ---------- */
  const sleep = (ms) => new Promise(r => setTimeout(r, ms * SPEED));
  const rawSleep = (ms) => new Promise(r => setTimeout(r, ms));
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const q = (sel) => document.querySelector(sel);
  const resolve = (sels) => [].concat(sels).map(s => typeof s === 'function' ? s() : typeof s === 'string' ? q(s) : s).flat().filter(e => e && e.isConnected);
  const rectOf = (sels) => {
    const list = resolve(sels);
    if (!list.length) return null;
    const rs = list.map(e => e.getBoundingClientRect());
    return { left: Math.min(...rs.map(r => r.left)), top: Math.min(...rs.map(r => r.top)), right: Math.max(...rs.map(r => r.right)), bottom: Math.max(...rs.map(r => r.bottom)) };
  };
  /* Reading time: the engine never guesses a hold. 1.0s to land + 0.15s per word, floor 2.4s.
     (A 6-word title with a 28-word body holds 6.1s; a 20-word card holds 4.0s.) */
  const readTime = (title, body) => Math.max(2400, 1000 + 150 * String(title + ' ' + body).trim().split(/\s+/).length);

  /* ---------- cursor ---------- */
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  cursor.style.transform = `translate(${cx}px, ${cy}px)`;
  async function moveTo(x, y, ms = 850) {
    cx = x; cy = y;
    cursor.style.transitionDuration = (ms * SPEED) + 'ms';
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    await sleep(ms + 60);
  }
  async function pressAt(x, y) {
    cursor.classList.add('press');
    const rip = document.createElement('div'); rip.className = 'wa-ripple'; rip.style.left = x + 'px'; rip.style.top = y + 'px'; document.body.appendChild(rip);
    setTimeout(() => rip.remove(), 700 * SPEED);
    await sleep(110);
    cursor.classList.remove('press');
  }
  async function click(sel, opts = {}) {
    const t = resolve(sel)[0];
    if (!t) { console.warn('[walkthrough] click target missing:', sel); return false; }
    const r = t.getBoundingClientRect();
    const x = r.left + (opts.x != null ? opts.x : Math.min(r.width / 2, 120)), y = r.top + (opts.y != null ? opts.y : r.height / 2);
    await moveTo(x, y);
    await sleep(200);
    await pressAt(x, y);
    t.click();
    await sleep(320);
    return true;
  }
  async function hover(sel) {
    const t = resolve(sel)[0]; if (!t) return false;
    const r = t.getBoundingClientRect();
    await moveTo(r.left + r.width / 2, r.top + r.height / 2);
    t.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    t.dispatchEvent(new MouseEvent('mouseenter'));
    return true;
  }
  /* Types into an input one character at a time so the viewer can read it. */
  async function type(sel, text, perChar = 55) {
    const t = resolve(sel)[0]; if (!t) return false;
    await click(sel);
    t.focus();
    for (const ch of text) {
      t.value += ch;
      t.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(perChar);
    }
    t.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  async function park() { await moveTo(window.innerWidth - 120, window.innerHeight - 90, 700); }

  /* ---------- spotlight (animates to a target, then tracks it every frame) ---------- */
  let spotTarget = null, spotPad = 8, spotFollowAt = 0;
  const applySpot = (r, pad) => Object.assign(spot.style, { left: (r.left - pad) + 'px', top: (r.top - pad) + 'px', width: (r.right - r.left + pad * 2) + 'px', height: (r.bottom - r.top + pad * 2) + 'px' });
  function showSpot(sels, pad = 8) {
    const r = rectOf(sels); if (!r) { hideSpot(); return null; }
    spotTarget = sels; spotPad = pad;
    spot.classList.remove('track');
    applySpot(r, pad);
    spot.style.opacity = 1;
    spotFollowAt = performance.now() + 650 * SPEED;
    return r;
  }
  function hideSpot() { spotTarget = null; spot.style.opacity = 0; }
  (function follow() {
    if (spotTarget && performance.now() > spotFollowAt) {
      const r = rectOf(spotTarget);
      if (r) { spot.classList.add('track'); applySpot(r, spotPad); }
      else spot.style.opacity = 0;
    }
    requestAnimationFrame(follow);
  })();

  /* ---------- explainer card ---------- */
  let stepNo = 0;
  function placeCard(sels, place) {
    const r = rectOf(sels);
    const W = card.offsetWidth || 330, H = card.offsetHeight || 120, m = 18 + spotPad, vw = window.innerWidth, vh = window.innerHeight;
    let left, top;
    if (!r) { left = (vw - W) / 2; top = (vh - H) / 2; }
    else {
      if (place === 'right' && r.right + m + W > vw - 16) place = (r.left - m - W >= 16) ? 'left' : 'bottom';
      else if (place === 'left' && r.left - m - W < 16) place = (r.right + m + W <= vw - 16) ? 'right' : 'bottom';
      else if (place === 'top' && r.top - m - H < 16) place = 'bottom';
      else if (place === 'bottom' && r.bottom + m + H > vh - 16) place = 'top';
      if (place === 'right') { left = r.right + m; top = r.top; }
      else if (place === 'left') { left = r.left - m - W; top = r.top; }
      else if (place === 'top') { left = r.left; top = r.top - m - H; }
      else { left = r.left; top = r.bottom + m; }
    }
    left = Math.max(16, Math.min(left, vw - W - 16)); top = Math.max(16, Math.min(top, vh - H - 16));
    card.style.left = left + 'px'; card.style.top = top + 'px';
  }
  async function showCard(sels, place, h, p) {
    card.classList.remove('show');
    await sleep(140);
    card.style.transition = 'none';
    card.innerHTML = `<div class="n">${String(++stepNo).padStart(2, '0')}</div><h3>${esc(h)}</h3><p>${esc(p)}</p>`;
    placeCard(sels, place);
    card.offsetHeight; // commit position before fading in
    card.style.transition = '';
    card.classList.add('show');
  }
  const hideCard = () => card.classList.remove('show');

  /* ---------- composite moves ---------- */
  /* One explained moment: spotlight + card, held for reading time (or an explicit hold). */
  async function explain(target, { place = 'right', title: h = '', body: p = '', hold, pad = 8, scroll = false } = {}) {
    if (scroll) { hideCard(); hideSpot(); await scrollTo(target); }   // clear the previous beat first: a long scroll would carry its card over unrelated content
    showSpot(target, pad);
    await showCard(target, place, h, p);
    await sleep(hold != null ? hold : readTime(h, p));
  }
  /* A breather: nothing highlighted, the page shown plainly, with an optional chapter caption. */
  async function breathe(ms = 1400, label, k) {
    hideCard(); hideSpot();
    if (label) { chapter.innerHTML = `${k ? `<span class="k">${esc(k)}</span>` : ''}${esc(label)}`; chapter.classList.add('show'); }
    await sleep(ms);
  }
  const endChapter = () => chapter.classList.remove('show');
  const hideAll = () => { hideCard(); hideSpot(); endChapter(); };

  async function scrollTo(sel, block = 'center') {
    const t = resolve(sel)[0]; if (!t) return false;
    t.scrollIntoView({ behavior: 'smooth', block });
    await sleep(800);
    return true;
  }
  async function scrollTop(container = document.scrollingElement) {
    const c = typeof container === 'string' ? q(container) : container;
    if (c) c.scrollTo({ top: 0, behavior: 'smooth' });
    await sleep(800);
  }

  /* Title card: logo image or text title, optional subtitle, optional flow row.
     keep=true leaves it on screen so the video can end on it. */
  async function titleCard({ logo, title: h = '', sub = '', flow, hold = 2400, keep = false, instant = false } = {}) {
    title.innerHTML = `${logo ? `<img src="${esc(logo)}" alt="">` : `<h1>${esc(h)}</h1>`}${sub ? `<p>${esc(sub)}</p>` : ''}${flow ? `<div class="flow">${flow.map((f, i) => (i ? '<i>→</i>' : '') + `<span style="transition-delay:${i * .25 * SPEED}s">${esc(f)}</span>`).join('')}</div>` : ''}`;
    if (logo) await new Promise(r => { const i = new Image(); i.onload = r; i.onerror = r; i.src = logo; });
    if (instant) { title.style.transition = 'none'; title.classList.add('show'); title.offsetHeight; title.style.transition = ''; }
    else title.classList.add('show');
    await sleep(900);
    const f = title.querySelector('.flow'); if (f) f.classList.add('go');
    await sleep(hold);
    if (keep) return;
    title.classList.remove('show');
    await sleep(700);
  }

  const waitFor = async (fn, max = 60000) => { const t0 = Date.now(); while (!fn() && Date.now() - t0 < max * SPEED) await rawSleep(100); return !!fn(); };
  const theme = (vars) => { for (const k of Object.keys(vars || {})) document.documentElement.style.setProperty('--wa-' + k, vars[k]); };
  /* Inject CSS that slows the host app's own animations by the speed factor, e.g.
     W.slowHost('.panel.enter { animation-duration: calc(.3s * var(--wa-trs)) }'). */
  const slowHost = (css) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };

  const W = {
    SPEED, sleep, click, hover, type, park, moveTo,
    explain, breathe, endChapter, hideCard, hideSpot, hideAll, showSpot, showCard,
    scrollTo, scrollTop, titleCard, waitFor, theme, slowHost, readTime, resolve, q,
    done() { window.__walkthroughDone = true; },
    fail(msg) { window.__walkthroughError = msg; console.error('[walkthrough]', msg); },
  };
  window.Walkthrough = W;
  window.createWalkthrough = () => W;

  /* Run a steps module when one is registered: window.__walkthroughSteps = async (W) => {...} */
  window.__walkthroughRun = async function () {
    const steps = window.__walkthroughSteps;
    if (typeof steps !== 'function') { W.fail('No steps registered (window.__walkthroughSteps)'); return; }
    try { await document.fonts.ready; await steps(W); W.done(); }
    catch (e) { W.fail(e && e.stack || String(e)); }
  };
})();
