// Internal link and anchor check across dist/. External links are not fetched.
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { walk, read } from './lib.mjs';

const DIST = 'dist';
if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const pages = walk(DIST, ['.html']);
const idsCache = new Map();
const ids = (file) => {
  if (!idsCache.has(file)) idsCache.set(file, new Set([...read(file).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return idsCache.get(file);
};

/** Resolve a site path to a file in dist (build.format "file": /about -> about.html). */
function resolve(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/$/, '') || '/';
  const candidates =
    clean === '/'
      ? ['index.html']
      : [clean.slice(1), `${clean.slice(1)}.html`, join(clean.slice(1), 'index.html')];
  return candidates.map((c) => join(DIST, c)).find((c) => existsSync(c) && !c.endsWith('/'));
}

let broken = 0;
let checked = 0;
for (const page of pages) {
  const html = read(page);
  const pagePath = '/' + relative(DIST, page).replace(/index\.html$/, '').replace(/\.html$/, '');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    checked++;
    const url = new URL(ref, 'https://x.test' + pagePath);
    const target = url.pathname === new URL('https://x.test' + pagePath).pathname && ref.startsWith('#') ? page : resolve(url.pathname);
    if (!target) {
      broken++;
      console.log(`FAIL ${relative(DIST, page)}: ${ref} (no such page or file)`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!ids(target).has(id)) {
        broken++;
        console.log(`FAIL ${relative(DIST, page)}: ${ref} (missing anchor #${id})`);
      }
    }
  }
}

if (broken) {
  console.log(`\ntest:links found ${broken} broken link(s) out of ${checked}.`);
  process.exit(1);
}
console.log(`test:links passed: ${checked} internal links and anchors across ${pages.length} pages, none broken.`);
