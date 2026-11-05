// Runs Lighthouse (mobile, default throttling) against `npm run preview` for the key pages
// and prints the four category scores. Usage: node scripts/lighthouse.mjs
// Needs Chrome/Chromium: set CHROME_PATH if it is not found automatically.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';

const base = process.env.BASE_URL || 'http://localhost:4321';
const pages = ['/', '/guides/knee-pain-by-location', '/contact'];
mkdirSync('qa/lighthouse', { recursive: true });
const rows = [];
for (const p of pages) {
  const name = p === '/' ? 'home' : p.slice(1).replace(/\//g, '--');
  const out = `qa/lighthouse/${name}.json`;
  execFileSync(
    'npx',
    ['-y', 'lighthouse@13.6.0', base + p, '--quiet', '--output=json', `--output-path=${out}`, '--chrome-flags=--headless=new --no-sandbox'],
    { stdio: 'inherit' },
  );
  const r = JSON.parse(readFileSync(out, 'utf8'));
  const s = (k) => Math.round(r.categories[k].score * 100);
  rows.push({ page: p, performance: s('performance'), accessibility: s('accessibility'), bestPractices: s('best-practices'), seo: s('seo'), lcp: r.audits['largest-contentful-paint'].displayValue });
}
console.table(rows);
