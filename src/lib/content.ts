import { getCollection, type CollectionEntry } from 'astro:content';

export const getConditions = async () => (await getCollection('conditions')).sort((a, b) => a.data.order - b.data.order);
export const getGuides = async () => (await getCollection('guides')).sort((a, b) => a.data.order - b.data.order);

export const conditionHref = (c: CollectionEntry<'conditions'>) => `/what-i-treat/${c.id}`;
export const guideHref = (g: CollectionEntry<'guides'>) => `/guides/${g.id}`;

export async function guidesBySlug(slugs: string[]) {
  const all = await getGuides();
  return slugs
    .map((s) => all.find((g) => g.id === s))
    .filter((g): g is CollectionEntry<'guides'> => {
      if (!g) throw new Error('Unknown guide slug in relatedGuides');
      return true;
    });
}
