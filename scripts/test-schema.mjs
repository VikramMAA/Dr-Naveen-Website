// JSON-LD and page-structure checks across dist/:
//  - every page has valid JSON-LD with a Physician (name, telephone, address, hospitalAffiliation), no ratings or reviews
//  - condition and guide pages have MedicalWebPage; lastReviewed/reviewedBy only when approved
//  - FAQPage text matches the visible FAQ text exactly
//  - BreadcrumbList on every inner page; VideoObject has the required fields
//  - one H1 per page; unique titles and descriptions; length warnings
//  - condition pages link to 2+ guides and /contact; guides link back to their condition page
import { relative } from 'node:path';
import { walk, read } from './lib.mjs';

const DIST = 'dist';
const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

let fails = 0;
const warn = [];
const fail = (page, msg) => {
  fails++;
  console.log(`FAIL ${page}: ${msg}`);
};

const titles = new Map();
const descs = new Map();
const pages = walk(DIST, ['.html']);

for (const file of pages) {
  const page = '/' + relative(DIST, file).replace(/\.html$/, '').replace(/^index$/, '');
  const html = read(file);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) fail(page, `expected 1 JSON-LD block, found ${blocks.length}`);
  let graph = [];
  try {
    const data = JSON.parse(blocks[0][1]);
    if (data['@context'] !== 'https://schema.org') fail(page, 'missing @context');
    graph = data['@graph'] || [];
  } catch (e) {
    fail(page, 'JSON-LD does not parse: ' + e.message);
  }
  const byType = (t) => graph.filter((n) => n['@type'] === t);
  const raw = JSON.stringify(graph);
  if (/aggregateRating|"review"|"Review"|ratingValue/.test(raw)) fail(page, 'JSON-LD contains ratings or reviews');

  const [phys] = byType('Physician');
  if (!phys) fail(page, 'no Physician');
  else {
    for (const k of ['name', 'honorificPrefix', 'medicalSpecialty', 'telephone', 'address', 'hospitalAffiliation', 'knowsAbout', 'url', 'image'])
      if (!phys[k]) fail(page, `Physician missing ${k}`);
    if (phys.telephone !== '+919650859766') fail(page, 'Physician telephone is not +919650859766');
    if (phys.name !== 'Dr Naveen Govind') fail(page, 'Physician name mismatch');
  }

  const isInner = page !== '/' && page !== '/404';
  if (isInner && byType('BreadcrumbList').length !== 1) fail(page, 'missing BreadcrumbList');
  for (const b of byType('BreadcrumbList'))
    b.itemListElement.forEach((it, i) => {
      if (it.position !== i + 1 || !it.name || !/^https:\/\//.test(it.item)) fail(page, 'bad breadcrumb item');
    });

  const isClinical = /^\/(what-i-treat|guides)\/.+/.test(page);
  const mwp = byType('MedicalWebPage');
  if (isClinical && mwp.length !== 1) fail(page, 'missing MedicalWebPage');
  for (const m of mwp) {
    const approved = /Reviewed by Dr Naveen Govind/.test(html);
    if (!approved && (m.lastReviewed || m.reviewedBy)) fail(page, 'lastReviewed/reviewedBy set on a pending page');
    if (approved && !(m.lastReviewed && m.reviewedBy)) fail(page, 'approved page missing lastReviewed/reviewedBy');
    if (!m.about?.length) fail(page, 'MedicalWebPage has no about');
  }

  // FAQ schema must match visible FAQ exactly
  const visibleFaq = [...html.matchAll(/<details[^>]*>\s*<summary[^>]*>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => ({
    q: decode(m[1]),
    a: decode(m[2]),
  }));
  const faqNodes = byType('FAQPage');
  if (visibleFaq.length && faqNodes.length !== 1) fail(page, 'visible FAQ but no FAQPage schema');
  if (faqNodes.length) {
    const schemaFaq = faqNodes[0].mainEntity.map((q) => ({ q: q.name, a: q.acceptedAnswer.text }));
    if (JSON.stringify(schemaFaq) !== JSON.stringify(visibleFaq)) fail(page, 'FAQPage text does not match the visible FAQ');
  }

  for (const v of byType('VideoObject'))
    for (const k of ['name', 'description', 'thumbnailUrl', 'uploadDate', 'embedUrl']) if (!v[k]) fail(page, `VideoObject missing ${k}`);

  // Structure
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(page, `expected one H1, found ${h1s}`);
  if (!/<html lang="en-IN"/.test(html)) fail(page, 'html lang is not en-IN');
  if (!/<main[\s>]/.test(html) || !/<nav[\s>]/.test(html) || !/<footer[\s>]/.test(html)) fail(page, 'missing main/nav/footer');
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '');
  if (!title) fail(page, 'missing title');
  if (!desc) fail(page, 'missing meta description');
  if (!/<link rel="canonical" href="https:\/\//.test(html)) fail(page, 'missing canonical');
  if (!/<meta property="og:image" content="https:\/\/[^"]+\/og\/[^"]+\.png"/.test(html)) fail(page, 'missing og:image');
  if (titles.has(title)) fail(page, `duplicate title with ${titles.get(title)}`);
  if (descs.has(desc)) fail(page, `duplicate description with ${descs.get(desc)}`);
  titles.set(title, page);
  descs.set(desc, page);
  if (title.length > 60) warn.push(`${page}: title is ${title.length} characters`);
  if (desc.length > 155) warn.push(`${page}: description is ${desc.length} characters`);

  // Internal linking rules
  if (/^\/what-i-treat\/.+/.test(page)) {
    const guideLinks = new Set([...html.matchAll(/href="(\/guides\/[^"#]+)"/g)].map((m) => m[1]));
    if (guideLinks.size < 2) fail(page, 'condition page links to fewer than 2 guides');
    if (!/href="\/contact"/.test(html)) fail(page, 'condition page does not link to /contact');
  }
  if (/^\/guides\/.+/.test(page) && !/href="\/what-i-treat(\/[^"]*)?"/.test(html)) fail(page, 'guide does not link back to its condition page');
  if (isClinical && !/General education only, not a diagnosis\. For advice on your own condition, please see a doctor\./.test(html))
    fail(page, 'missing disclaimer');
}

if (warn.length) console.log('Length notes (not failures):\n  ' + warn.join('\n  '));
if (fails) {
  console.log(`\ntest:schema found ${fails} problem(s).`);
  process.exit(1);
}
console.log(`test:schema passed: JSON-LD, FAQ text match, breadcrumbs and page structure OK on ${pages.length} pages.`);
