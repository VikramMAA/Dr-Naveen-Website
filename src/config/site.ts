/**
 * Single source of truth for every fact on the site.
 * Components read only from here. Nothing below is hard-coded anywhere else.
 *
 * Values written in [SQUARE BRACKETS] are placeholders. They are treated as
 * empty (and hidden from the page) until a real value replaces them.
 * Every placeholder is listed in REVIEW.md.
 */

export interface Video {
  /** YouTube video ID, e.g. "dQw4w9WgXcQ" */
  id: string;
  title: string;
  /** ISO date the video was published, e.g. "2026-11-01" */
  date: string;
  language: string;
  description?: string;
}

export const site = {
  // Identity
  name: 'Dr Naveen Govind',
  honorificPrefix: 'Dr',
  givenName: 'Naveen',
  familyName: 'Govind',
  role: 'Orthopaedic Surgeon',
  title: 'Orthopaedic Surgeon, Kochi',
  qualifications: 'MBBS, MS (Orthopaedics)',
  hashtag: '#AskDrNaveen',
  locale: 'en-IN',

  // Placeholder until the real domain is confirmed (also in astro.config.mjs)
  domain: 'https://www.drnaveengovind.com',

  // Phone: his own number. Never show hospital call-centre numbers.
  phone: {
    display: '96508 59766',
    e164: '+919650859766',
    href: 'tel:+919650859766',
  },

  // WhatsApp: not confirmed yet. Keep false until Dr Naveen confirms.
  whatsappEnabled: false,
  whatsappUrl: 'https://wa.me/919650859766',

  // Where he consults
  hospital: {
    name: 'Welcare Hospital',
    street: 'S. A. Road',
    locality: 'Vyttila',
    city: 'Ernakulam',
    region: 'Kerala',
    country: 'IN',
    countryName: 'India',
    postalCode: '[POSTAL CODE]',
    logoAlt: 'Welcare Hospital, Vyttila',
  },
  /** Google Maps link for the hospital. Placeholder search link until the exact place link is supplied. */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Welcare+Hospital+Vyttila+Ernakulam',
  /** Google Business Profile link for Dr Naveen */
  googleBusinessProfileUrl: '[GOOGLE BUSINESS PROFILE LINK]',
  /** Consultation days and timings. Hidden while it is a placeholder. */
  consultationTimes: '[CONSULTATION DAYS AND TIMES]',

  // Remote family consults
  familyConsultLine:
    'Phone consultations with family members abroad can be scheduled with a prior appointment.',

  // About page details not yet supplied (hidden while a placeholder)
  educationAndTraining: '[EDUCATION AND TRAINING DETAILS]',

  // Social profiles. Empty or placeholder values are hidden everywhere.
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  },

  // Videos (newest first). The first entry is used as "latest video".
  videos: [] as Video[],

  // Malayalam summaries stay hidden until a native speaker and Dr Naveen approve them.
  showMalayalam: false,

  // Optional cookieless analytics. Off by default.
  analytics: {
    provider: 'none' as 'none' | 'plausible' | 'netlify',
    plausibleDomain: '',
  },
} as const;

/** True when a config value is filled in (not empty and not a [PLACEHOLDER]). */
export function isSet(value: string | undefined | null): value is string {
  if (!value) return false;
  const v = value.trim();
  return v.length > 0 && !(v.startsWith('[') && v.endsWith(']'));
}

export const socialLinks = (
  [
    { key: 'facebook', label: 'Facebook', url: site.social.facebook },
    { key: 'instagram', label: 'Instagram', url: site.social.instagram },
    { key: 'youtube', label: 'YouTube', url: site.social.youtube },
    { key: 'linkedin', label: 'LinkedIn', url: site.social.linkedin },
  ] as const
).filter((s) => isSet(s.url));

export const latestVideo: Video | undefined = site.videos[0];

export const hospitalAddressLine = `${site.hospital.name}, ${site.hospital.street}, ${site.hospital.locality}, ${site.hospital.city}, ${site.hospital.region}`;
export const hospitalShort = `${site.hospital.name}, ${site.hospital.locality}, ${site.hospital.city}`;

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/what-i-treat', label: 'What I treat' },
  { href: '/guides', label: 'Patient guides' },
  { href: '/videos', label: 'Videos' },
  { href: '/planning-from-abroad', label: 'Planning from abroad' },
  { href: '/contact', label: 'Contact' },
] as const;

export const DISCLAIMER_TEXT =
  'General education only, not a diagnosis. For advice on your own condition, please see a doctor.';

export const absoluteUrl = (path: string) => {
  const url = new URL(path, site.domain).toString();
  return path === '/' ? url : url.replace(/\/$/, '');
};
