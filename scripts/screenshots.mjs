// Takes full-page screenshots at 360, 768 and 1280px and reports horizontal overflow
// and sticky-bar collisions. Run against `npm run preview` (default http://localhost:4321).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL || 'http://localhost:4321';
const out = process.env.OUT_DIR || 'qa/screenshots';
const scale = Number(process.env.SCALE || 1);
const pages = (process.env.PAGES || '/,/what-i-treat/knee-pain-and-arthritis,/guides/knee-pain-by-location,/contact').split(',');
const widths = [360, 768, 1280];
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
let problems = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth > window.innerWidth;
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(el).position !== 'fixed')
        .filter((el) => !el.closest('.visually-hidden, .skip-link'))
        .slice(0, 5)
        .map((el) => el.tagName + '.' + el.className);
      // Sticky call bar must not cover the end of the footer
      window.scrollTo({ top: doc.scrollHeight, behavior: 'instant' });
      const bar = document.querySelector('.call-bar');
      const footer = document.querySelector('.site-footer');
      let collision = false;
      if (bar && footer && getComputedStyle(bar).display !== 'none') {
        const b = bar.getBoundingClientRect();
        const last = footer.querySelector('.site-footer__legal p').getBoundingClientRect();
        collision = last.bottom > b.top;
      }
      return { overflow, wide, collision };
    });
    const name = (p === '/' ? 'home' : p.slice(1).replace(/\//g, '--')) + `-${w}.png`;
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    const bad = r.overflow || r.collision;
    if (bad) problems++;
    console.log(`${bad ? 'FAIL' : 'ok  '} ${w}px ${p}${r.overflow ? ' overflow: ' + r.wide.join(', ') : ''}${r.collision ? ' call-bar collision' : ''}`);
  }
  await ctx.close();
}
await browser.close();
if (problems) process.exit(1);
