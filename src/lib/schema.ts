import { site, socialLinks, absoluteUrl, latestVideo, isSet, type Video } from '../config/site';

export type JsonLd = Record<string, unknown>;

export const PHYSICIAN_ID = absoluteUrl('/') + '#physician';
export const WEBSITE_ID = absoluteUrl('/') + '#website';

export const knowsAbout = [
  'Knee pain and arthritis',
  'Sports injuries (ACL, meniscus and ligament tears)',
  'Shoulder pain, stiffness and dislocation',
  'Joint replacement',
  'Keyhole (arthroscopic) surgery',
  'Fracture management',
];

export function hospitalAddress(): JsonLd {
  return {
    '@type': 'PostalAddress',
    streetAddress: `${site.hospital.name}, ${site.hospital.street}, ${site.hospital.locality}`,
    addressLocality: site.hospital.city,
    addressRegion: site.hospital.region,
    addressCountry: site.hospital.country,
    ...(isSet(site.hospital.postalCode) ? { postalCode: site.hospital.postalCode } : {}),
  };
}

export function physicianSchema(imageUrl: string): JsonLd {
  return {
    '@type': 'Physician',
    '@id': PHYSICIAN_ID,
    name: site.name,
    honorificPrefix: site.honorificPrefix,
    givenName: site.givenName,
    familyName: site.familyName,
    medicalSpecialty: 'Orthopedic',
    description: `${site.name}, ${site.qualifications}, is an orthopaedic surgeon in Kochi treating knee pain, sports injuries, shoulder problems, fractures and joint replacement. He consults at ${site.hospital.name}, ${site.hospital.locality}.`,
    telephone: site.phone.e164,
    image: imageUrl,
    url: absoluteUrl('/'),
    address: hospitalAddress(),
    hospitalAffiliation: {
      '@type': 'Hospital',
      name: site.hospital.name,
      address: hospitalAddress(),
    },
    knowsAbout,
    ...(socialLinks.length ? { sameAs: socialLinks.map((s) => s.url) } : {}),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: absoluteUrl('/'),
    inLanguage: site.locale,
    publisher: { '@id': PHYSICIAN_ID },
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function medicalWebPageSchema(opts: {
  path: string;
  name: string;
  description: string;
  about: string[];
  reviewStatus: 'pending' | 'approved';
  updated: Date;
}): JsonLd {
  const approved = opts.reviewStatus === 'approved';
  const date = opts.updated.toISOString().slice(0, 10);
  return {
    '@type': 'MedicalWebPage',
    '@id': absoluteUrl(opts.path) + '#webpage',
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: site.locale,
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PHYSICIAN_ID },
    about: opts.about.map((name) => ({ '@type': 'MedicalCondition', name })),
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    dateModified: date,
    ...(approved ? { lastReviewed: date, reviewedBy: { '@id': PHYSICIAN_ID } } : {}),
  };
}

export function videoSchema(video: Video): JsonLd {
  return {
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || `${video.title}. In ${video.language}, by ${site.name}.`,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    uploadDate: video.date,
    inLanguage: 'ml',
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
    author: { '@id': PHYSICIAN_ID },
  };
}

export const latestVideoSchema = () => (latestVideo ? [videoSchema(latestVideo)] : []);
