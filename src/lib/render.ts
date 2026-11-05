import sharp from 'sharp';

const NAVY = '#14213D';
const OFFWHITE = '#F7F4EF';
const TEAL = '#1F8A8A';
const FONT = "Manrope, Inter, 'DejaVu Sans', Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** 1200 x 630 Open Graph image: navy background, off-white headline, teal bar, name line. */
export async function renderOgImage(headline: string): Promise<Buffer> {
  let size = 72;
  let lines = wrap(headline, 26);
  if (lines.length > 4) {
    size = 58;
    lines = wrap(headline, 32);
  }
  const lineHeight = Math.round(size * 1.12);
  const top = 150;
  const text = lines
    .map((l, i) => `<text x="80" y="${top + i * lineHeight}" font-family="${FONT}" font-weight="800" font-size="${size}" letter-spacing="-1.5" fill="${OFFWHITE}">${esc(l)}</text>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect x="80" y="70" width="96" height="9" rx="4.5" fill="${TEAL}"/>
  ${text}
  <rect x="80" y="520" width="1040" height="2" fill="${TEAL}" opacity="0.6"/>
  <text x="80" y="574" font-family="${FONT}" font-weight="700" font-size="32" fill="${OFFWHITE}">Dr Naveen Govind | Orthopaedic Surgeon, Kochi</text>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

/** "NG" in teal on navy. Plain letters, not a symbol. */
export function faviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${NAVY}"/><text x="32" y="42" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="28" letter-spacing="-1" fill="${TEAL}">NG</text></svg>`;
}

export async function renderFavicon(size: number, rounded = true): Promise<Buffer> {
  const svg = rounded ? faviconSvg() : faviconSvg().replace('rx="12" ', '');
  return sharp(Buffer.from(svg), { density: Math.max(72, Math.ceil((72 * size) / 64)) })
    .resize(size, size)
    .png()
    .toBuffer();
}
