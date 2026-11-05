import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ question: z.string(), answer: z.string() });
const source = z.object({ label: z.string(), url: z.string().url() });

const shared = {
  title: z.string(),
  seoTitle: z.string().max(70),
  description: z.string().max(160),
  slug: z.string(),
  updated: z.coerce.date(),
  reviewStatus: z.enum(['pending', 'approved']),
  faqs: z.array(faq).default([]),
  malayalamSummary: z.string().optional(),
  relatedGuides: z.array(z.string()).default([]),
  /** Conditions this page is about (MedicalWebPage "about") */
  about: z.array(z.string()).default([]),
  sources: z.array(source).default([]),
  order: z.number().default(0),
};

const guides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guides' }),
  schema: z.object({
    ...shared,
    shortAnswer: z.string(),
    /** Path of the matching "What I treat" page (each guide links back to it) */
    conditionPath: z.string(),
    conditionLabel: z.string(),
    printable: z.boolean().default(false),
  }),
});

const conditions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/conditions' }),
  schema: z.object({
    ...shared,
    cardTitle: z.string(),
    cardDescription: z.string(),
    icon: z.enum(['knee', 'football', 'shoulder', 'joint', 'arthroscope', 'fracture']),
    intro: z.string(),
  }),
});

export const collections = { guides, conditions };
