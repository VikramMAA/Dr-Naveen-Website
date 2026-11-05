// Copy lint (brief section 12, checks 2, 3 and 4).
//  - No em dash (U+2014) or en dash (U+2013) anywhere in src/ or dist/.
//  - No banned superlatives, promises or marketing filler in rendered copy or content sources.
//  - Spine check: no spine, spinal, vertebra, back pain or disc.
//  - Phone check: the only phone number is 96508 59766 / +919650859766; no hospital call-centre numbers.
import { existsSync } from 'node:fs';
import { walk, read, visibleCopy, sourceCopy } from './lib.mjs';

const EM = '—';
const EN = '–';

const banned = [
  /\bbest\b/i, /\btop\b/i, /\bleading\b/i, /\bNo\.\s?1\b/i, /\bnumber one\b/i, /\bexpert in\b/i, /\brenowned\b/i,
  /\bworld[- ]class\b/i, /\bpainless\b/i, /\bguarantee(d|s)?\b/i, /\bcutting[- ]edge\b/i, /\bstate[- ]of[- ]the[- ]art\b/i,
  /\bholistic\b/i, /\bseamless(ly)?\b/i, /\bjourney\b/i, /\bempower(s|ing)?\b/i, /\bunlock(s|ing)?\b/i, /\bdelve\b/i,
  /\btestimonials?\b/i, /\breview stars\b/i, /\bstar ratings?\b/i, /\bhappy patients\b/i, /\bsuccess rates?\b/i,
  /\bin today's fast-paced world\b/i, /\bAyurved/i, /\bquacks?\b/i, /\bdiscount/i, /\bpackages?\b/i, /\boffers?\b/i,
];
// Approved exceptions, word for word from Dr Naveen's approved copy (not superlatives or promises):
// "Painless clicking is common and usually normal." and "...leading to irreversible damage."
const allow = [/painless clicking/gi, /leading to irreversible damage/gi];

const spine = [/\bspine\b/i, /\bspinal\b/i, /\bvertebra/i, /\bback pain\b/i, /\bdiscs?\b/i];

const PHONE_OK = '9650859766';
const forbiddenNumbers = ['0484', '4091111', '3518666'];

let hits = 0;
const report = (file, kind, match, context) => {
  hits++;
  console.log(`FAIL [${kind}] ${file}: "${match}" ... ${context.replace(/\s+/g, ' ').trim().slice(0, 110)}`);
};

function scanText(file, text, { words = true, spineCheck = true, phones = true } = {}) {
  // Dashes
  for (const ch of [EM, EN]) {
    let i = text.indexOf(ch);
    while (i !== -1) {
      report(file, ch === EM ? 'em dash' : 'en dash', ch, text.slice(Math.max(0, i - 50), i + 50));
      i = text.indexOf(ch, i + 1);
    }
  }
  let t = text;
  for (const a of allow) t = t.replace(a, '');
  // Source URLs may contain any word
  t = t.replace(/https?:\/\/[^\s"')<]+/g, ' ');
  if (words)
    for (const re of banned) {
      const g = new RegExp(re.source, 'gi');
      for (const m of t.matchAll(g)) report(file, 'banned word', m[0], t.slice(Math.max(0, m.index - 50), m.index + 50));
    }
  if (spineCheck)
    for (const re of spine) {
      const g = new RegExp(re.source, 'gi');
      for (const m of t.matchAll(g)) report(file, 'spine', m[0], t.slice(Math.max(0, m.index - 50), m.index + 50));
    }
  if (phones) {
    const noAssets = text.replace(/\/_astro\/[^\s"')]+/g, ' ');
    for (const n of forbiddenNumbers) {
      const g = new RegExp(`(?<![\\w.-])${n}`, 'g');
      for (const m of noAssets.matchAll(g)) report(file, 'phone', m[0], noAssets.slice(Math.max(0, m.index - 50), m.index + 50));
    }
    // Any Indian mobile-style number must be his
    for (const m of noAssets.matchAll(/(?:\+?91[\s-]?)?(?<![\w.])([6-9]\d{4})\s?(\d{5})(?![\w])/g)) {
      if (m[1] + m[2] !== PHONE_OK) report(file, 'phone', m[0], noAssets.slice(Math.max(0, m.index - 50), m.index + 50));
    }
  }
}

// 1. Every file in src/: dashes and spine words everywhere (code comments, SVG titles, alt text).
for (const f of walk('src')) {
  const raw = read(f);
  const isContent = /\.(mdx?|ts)$/.test(f) && (f.includes('/content/') || f.includes('/config/') || f.includes('/data/'));
  if (isContent) scanText(f, sourceCopy(raw));
  else scanText(f, raw, { words: false });
}

// 2. Root docs: dashes only
for (const f of ['README.md', 'REVIEW.md', 'CONTENT-RULES.md', 'PLAN.md']) if (existsSync(f)) scanText(f, read(f), { words: false, spineCheck: false, phones: false });

// 3. Built site: everything a visitor sees, plus meta tags and JSON-LD.
if (existsSync('dist')) {
  for (const f of walk('dist', ['.html'])) scanText(f, visibleCopy(read(f)));
  for (const f of walk('dist', ['.xml', '.txt', '.webmanifest', '.js', '.css'])) scanText(f, read(f), { words: false, spineCheck: false });
} else {
  console.log('Note: dist/ not found. Run `npm run build` first to lint the built site.');
}

if (hits) {
  console.log(`\nlint:copy found ${hits} problem(s).`);
  process.exit(1);
}
console.log('lint:copy passed: no dashes, banned words, spine terms or wrong phone numbers.');
