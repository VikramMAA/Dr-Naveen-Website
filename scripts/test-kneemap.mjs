// Knee map check: Outer side (3) renders left of Inner side (2), Back (4) is right of
// and below the joint, and the keyboard-only flow works (Tab to a zone, press Enter/Space).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.env.BASE_URL || 'http://localhost:4321';
const browser = await chromium.launch();
let failed = 0;
const check = (ok, msg) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
  if (!ok) failed++;
};

for (const width of [360, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(base + '/guides/knee-pain-by-location', { waitUntil: 'networkidle' });
  const box = async (n) => page.locator(`#knee-map [data-zone-btn="${n}"]`).boundingBox();
  const [b1, b2, b3, b4, b5] = await Promise.all([1, 2, 3, 4, 5].map(box));
  const cx = (b) => b.x + b.width / 2;
  check(cx(b3) < cx(b1) && cx(b1) < cx(b2), `${width}px: Outer (3) left, Front (1) centre, Inner (2) right`);
  check(cx(b4) > cx(b2) && b4.y > b2.y, `${width}px: Back (4) on the right, below the joint line`);
  check(Math.abs(cx(b5) - cx(b1)) < 4 && b5.y > b1.y, `${width}px: Whole knee (5) centred below the kneecap`);

  // Keyboard: focus the first zone button via Tab from the element before it
  await page.locator('#knee-map').scrollIntoViewIfNeeded();
  await page.focus('#knee-map [data-zone-btn="1"]');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-zone-btn'));
  check(focused === '2', `${width}px: Tab moves from zone 1 to zone 2`);
  await page.keyboard.press('Enter');
  check((await page.getAttribute('#knee-map [data-zone-btn="2"]', 'aria-pressed')) === 'true', `${width}px: Enter selects zone 2`);
  check(await page.isVisible('#knee-map-zone-2'), `${width}px: zone 2 text is visible`);
  check(!(await page.isVisible('#knee-map-zone-1')), `${width}px: other zone text is hidden`);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  check(await page.isVisible('#knee-map-zone-3'), `${width}px: Space selects zone 3`);
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement.querySelector('.knee-map__num')).boxShadow);
  check(outline && outline !== 'none', `${width}px: visible focus ring`);
  await page.close();
}

// No JavaScript: all five texts show as a list
const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 900 } });
const p2 = await ctx.newPage();
await p2.goto(base + '/guides/knee-pain-by-location');
const visible = await Promise.all([1, 2, 3, 4, 5].map((n) => p2.isVisible(`#knee-map-zone-${n}`)));
check(visible.every(Boolean), 'No JS: all five zone texts visible');
await browser.close();
if (failed) process.exit(1);
