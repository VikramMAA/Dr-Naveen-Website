import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

export function walk(dir, exts) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p, exts));
    else if (!exts || exts.includes(extname(p))) out.push(p);
  }
  return out;
}

export const read = (p) => readFileSync(p, 'utf8');

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

/** Everything a reader, search engine or assistant sees in a built HTML page. */
export function visibleCopy(html) {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|content|placeholder|data-label)="([^"]*)"/g)].map((m) => m[1]);
  const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)].map((m) => m[1]);
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decode([text, ...attrs, ...titles, ...jsonLd].join('\n')).replace(/[ \t]+/g, ' ');
}

/** Visible copy from an MDX/Markdown source: frontmatter values and prose, without import lines. */
export function sourceCopy(src) {
  return src
    .split('\n')
    .filter((l) => !/^\s*import\s/.test(l))
    .join('\n');
}
