import type { APIRoute, GetStaticPaths } from 'astro';
import { ogPages } from '../../lib/pages';
import { ogSlug } from '../../lib/og';
import { renderOgImage } from '../../lib/render';

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await ogPages();
  return pages.map((p) => ({ params: { slug: ogSlug(p.path) }, props: { headline: p.headline } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props.headline as string);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
