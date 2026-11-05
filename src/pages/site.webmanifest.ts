import type { APIRoute } from 'astro';
import { site } from '../config/site';
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: `${site.name} | ${site.title}`,
      short_name: site.name,
      start_url: '/',
      display: 'browser',
      background_color: '#F7F4EF',
      theme_color: '#14213D',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
