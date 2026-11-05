/** Every page that gets a generated Open Graph image: path and headline. */
import { getConditions, getGuides, conditionHref, guideHref } from './content';

export async function ogPages(): Promise<{ path: string; headline: string }[]> {
  const conditions = await getConditions();
  const guides = await getGuides();
  return [
    { path: '/', headline: 'Knee, shoulder and sports injury care, explained clearly.' },
    { path: '/about', headline: 'About Dr Naveen Govind' },
    { path: '/what-i-treat', headline: 'What I treat' },
    { path: '/guides', headline: 'Plain answers on knees, shoulders and sports injuries' },
    { path: '/videos', headline: 'Videos on knees, shoulders and sports injuries' },
    { path: '/planning-from-abroad', headline: "Planning a parent's knee or shoulder treatment from abroad" },
    { path: '/contact', headline: 'Book a consultation' },
    { path: '/medical-disclaimer', headline: 'Medical disclaimer' },
    { path: '/privacy', headline: 'Privacy' },
    ...conditions.map((c) => ({ path: conditionHref(c), headline: c.data.title })),
    ...guides.map((g) => ({ path: guideHref(g), headline: g.data.title })),
  ];
}
