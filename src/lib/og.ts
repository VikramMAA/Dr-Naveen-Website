/** Maps a page path to its generated Open Graph image path. */
export const ogSlug = (path: string) => (path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '--'));
export const ogPath = (path: string) => `/og/${ogSlug(path)}.png`;
