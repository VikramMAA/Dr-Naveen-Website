import type { APIRoute } from 'astro';
import { renderFavicon } from '../lib/render';
export const GET: APIRoute = async () => new Response(new Uint8Array(await renderFavicon(180, false)), { headers: { 'Content-Type': 'image/png' } });
