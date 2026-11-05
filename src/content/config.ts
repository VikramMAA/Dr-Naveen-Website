import { defineCollection, z } from "astro:content";

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const sharedFields = {
  title: z.string(),
  seoTitle: z.string(),
  description: z.string(),
  slug: z.string(),
  updated: z.date(),
  reviewStatus: z.enum(["pending", "approved"]).default("pending"),
  faqs: z.array(faqSchema).default([]),
  malayalamSummary: z.string().optional(),
  relatedGuides: z.array(z.string()).default([]),
};

const guides = defineCollection({
  type: "content",
  schema: z.object(sharedFields),
});

const conditions = defineCollection({
  type: "content",
  schema: z.object(sharedFields),
});

export const collections = { guides, conditions };
