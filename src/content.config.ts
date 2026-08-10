import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const disciplines = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/disciplines' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    order: z.number().optional(),
    active: z.boolean().default(true),
  }),
});

const corps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/corps' }),
  schema: z.object({
    name: z.string(),
    abbreviation: z.string().optional(),
    crest: z.string().optional(),
    summary: z.string().optional(),
    website: z.string().url().optional(),
    active: z.boolean().default(true),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    discipline: reference('disciplines'),
    corps: reference('corps').optional(),
    scale: z.enum([
      'unit-garrison',
      'corps',
      'inter-corps',
      'army',
      'inter-service-international',
      'mixed-community',
    ]),
    presenceType: z.enum(['competitive', 'community-outreach', 'mixed']),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.object({
      name: z.string(),
      lat: z.number(),
      long: z.number(),
    }),
    description: z.string().optional(),
    resultsSummary: z.string().optional(),
    externalLink: z.string().url().optional(),
  }),
});

export const collections = { disciplines, corps, events };
