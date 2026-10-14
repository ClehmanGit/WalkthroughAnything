#!/usr/bin/env node
/* WalkthroughAnything encoder.
   Takes the .webm from record.js, stretches it back to real time, writes an
   H.264 MP4 at 60 fps, and extracts review frames for QA.

   node recorder/encode.js --in out/record.json --name walkthrough [--frames 12] [--gif]

   Reads slow factor from record.json. Writes:
     <out>/<name>.mp4             the deliverable
     <out>/frames/f-<sec>.jpg      evenly spaced review frames (+ first and last)
     <out>/<name>.gif              optional, 960px wide, 15 fps */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => { if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]); return a; }, []));
const metaPath = path.resolve(args.in || 'out/record.json');
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const OUT = path.dirname(metaPath);
const NAME = args.name || 'walkthrough';
const FRAMES = +args.frames || 12;

let ffmpeg;
try { ffmpeg = require('@ffmpeg-installer/ffmpeg').path; } catch (e) { ffmpeg = process.env.FFMPEG || 'ffmpeg'; }

/* Windows tools choke on paths over ~250 chars; work in a short temp dir when needed. */
const longPath = (p) => process.platform === 'win32' && p.length > 200;
const work = longPath(OUT) || longPath(ffmpeg) ? fs.mkdtempSync(path.join(os.tmpdir(), 'wa-')) : OUT;
const ff = longPath(ffmpeg) ? (fs.copyFileSync(ffmpeg, path.join(work, 'ffmpeg.exe')), path.join(work, 'ffmpeg.exe')) : ffmpeg;
const input = path.join(work, 'in.webm'); fs.copyFileSync(meta.webm, input);
const run = (a) => execFileSync(ff, ['-y', '-hide_banner', '-loglevel', 'error', ...a], { stdio: 'inherit' });

const mp4 = path.join(work, NAME + '.mp4');
run(['-i', input, '-vf', `setpts=${1 / meta.slow}*PTS`, '-r', '60', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);

let seconds = meta.videoSeconds;
try { const o = execFileSync(ff, ['-i', mp4, '-hide_banner'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(String(e.stderr || e.stdout)); if (m) seconds = +m[1] * 3600 + +m[2] * 60 + +m[3]; }

const framesDir = path.join(work, 'frames'); fs.mkdirSync(framesDir, { recursive: true });
const times = [0.5, ...Array.from({ length: FRAMES }, (_, i) => (i + 1) * seconds / (FRAMES + 1)), Math.max(0, seconds - 0.2)].map(t => +t.toFixed(1));
for (const t of times) run(['-ss', String(t), '-i', mp4, '-frames:v', '1', '-vf', 'scale=960:-1', path.join(framesDir, `f-${t.toFixed(1).padStart(6, '0')}s.jpg`)]);
if (args.gif) {
  const pal = path.join(work, 'pal.png');
  run(['-i', mp4, '-vf', 'fps=15,scale=960:-1:flags=lanczos,palettegen', pal]);
  run(['-i', mp4, '-i', pal, '-filter_complex', 'fps=15,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse', path.join(work, NAME + '.gif')]);
}
if (work !== OUT) {
  fs.copyFileSync(mp4, path.join(OUT, NAME + '.mp4'));
  if (args.gif) fs.copyFileSync(path.join(work, NAME + '.gif'), path.join(OUT, NAME + '.gif'));
  fs.rmSync(path.join(OUT, 'frames'), { recursive: true, force: true });
  fs.cpSync(framesDir, path.join(OUT, 'frames'), { recursive: true });
  fs.rmSync(work, { recursive: true, force: true });
} else {
  fs.rmSync(input, { force: true }); // scratch copy of the raw capture
}
console.log(JSON.stringify({ mp4: path.join(OUT, NAME + '.mp4'), seconds: +seconds.toFixed(1), frames: path.join(OUT, 'frames'), gif: args.gif ? path.join(OUT, NAME + '.gif') : null }, null, 2));
