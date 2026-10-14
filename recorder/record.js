#!/usr/bin/env node
/* WalkthroughAnything recorder.
   Opens the app in headless Chromium, injects the tour engine and your steps
   file, runs the tour at half speed, and writes a .webm. Then run encode.js.

   node recorder/record.js --url http://localhost:3000 --steps examples/my-app/steps.js [options]

   Options
     --url       page to open (required)
     --steps     steps file; must set window.__walkthroughSteps = async (W) => {...} (required)
     --setup     optional JS file run in the page BEFORE the engine (seed state, stub network)
     --fixtures  optional JSON file: [{ "match": "regex on URL", "status": 200, "body": {...}|"string", "headers": {...} }]
                 every matching request is answered from the fixture instead of the network
     --out       output directory (default: ./out)
     --slow      speed factor (default: 2). Recorded at 1/slow pace; encode.js stretches it back
     --size      WxH viewport (default: 1440x900)
     --timeout   max tour length in real seconds (default: 600)
     --headed    show the browser while recording */
const path = require('path');
const fs = require('fs');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
  if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
  return a;
}, []));
if (!args.url || !args.steps) { console.error('usage: node record.js --url <url> --steps <file> [--setup <file>] [--fixtures <json>] [--out dir] [--slow 2] [--size 1440x900]'); process.exit(2); }

const SLOW = +args.slow || 2;
const [W, H] = String(args.size || '1440x900').split('x').map(Number);
const OUT = path.resolve(args.out || 'out');
const ENGINE = path.join(__dirname, '..', 'engine');

(async () => {
  const { chromium } = require('playwright');
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: !args.headed });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: OUT, size: { width: W, height: H } } });
  const page = await ctx.newPage();
  const log = [];
  page.on('pageerror', e => log.push('pageerror: ' + e.message));
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) log.push(m.type() + ': ' + m.text()); });

  if (args.fixtures) {
    const fixtures = JSON.parse(fs.readFileSync(args.fixtures, 'utf8'));
    await page.route('**/*', async route => {
      const url = route.request().url();
      const f = fixtures.find(x => new RegExp(x.match).test(url));
      if (!f) return route.continue();
      const body = typeof f.body === 'string' ? f.body : JSON.stringify(f.body);
      await new Promise(r => setTimeout(r, (f.delay || 0) * SLOW));
      route.fulfill({ status: f.status || 200, headers: Object.assign({ 'content-type': typeof f.body === 'string' ? 'text/plain' : 'application/json' }, f.headers || {}), body });
    });
  }

  // Speed factor is read by the engine at load time.
  await page.addInitScript(`window.__WA_SPEED = ${SLOW};`);
  const resp = await page.goto(args.url, { waitUntil: 'load' });
  if (!resp || resp.status() >= 400) { console.error(`record failed: ${args.url} answered ${resp ? resp.status() : 'nothing'}. Is the app server running and pointed at the right directory?`); await browser.close(); process.exit(1); }
  if (args.setup) await page.addScriptTag({ path: path.resolve(args.setup) });
  await page.addStyleTag({ path: path.join(ENGINE, 'tour.css') });
  await page.addScriptTag({ path: path.join(ENGINE, 'tour.js') });
  await page.addScriptTag({ path: path.resolve(args.steps) });

  const t0 = Date.now();
  await page.evaluate(() => window.__walkthroughRun());
  const ok = await page.waitForFunction(() => window.__walkthroughDone === true || window.__walkthroughError, null, { timeout: (+args.timeout || 600) * 1000 }).then(() => true).catch(() => false);
  const err = await page.evaluate(() => window.__walkthroughError || null);
  await page.waitForTimeout(600);
  const video = page.video();
  await ctx.close();
  const webm = await video.path();
  const meta = { webm, slow: SLOW, size: [W, H], realSeconds: (Date.now() - t0) / 1000, videoSeconds: (Date.now() - t0) / 1000 / SLOW, log, error: err, timedOut: !ok };
  fs.writeFileSync(path.join(OUT, 'record.json'), JSON.stringify(meta, null, 2));
  console.log(JSON.stringify(meta, null, 2));
  await browser.close();
  if (err || !ok) process.exit(1);
})().catch(e => { console.error('record failed:', e.message); process.exit(1); });
