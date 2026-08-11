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
    // Official "download and play" link for the game itself.
    externalLink: z.string().url().optional(),
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
    twitch: z.string().url().optional(),
    active: z.boolean().default(true),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    // Array, not singular: many real fixtures (multi-title leagues,
    // defence-wide festivals) span more than one game. Optional because
    // some fixtures (broad festivals with no fixed game list) have none.
    disciplines: z.array(reference('disciplines')).optional(),
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
    // confirmed: render `date`/`endDate` as-is.
    // provisional: render a "likely [window]" chip, using dateOptions if present.
    // tbc: render a "Date TBC" badge; `date` is an internal sort anchor only,
    // never shown as a real date.
    dateStatus: z.enum(['confirmed', 'provisional', 'tbc']).default('confirmed'),
    dateOptions: z.array(z.string()).optional(),
    // Optional: online-only fixtures and unconfirmed internal fixtures have
    // no fixed physical venue.
    location: z
      .object({
        name: z.string(),
        lat: z.number(),
        long: z.number(),
      })
      .optional(),
    description: z.string().optional(),
    resultsSummary: z.string().optional(),
    externalLink: z.string().url().optional(),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    name: z.string(),
    type: z.enum(['training-facility', 'dedicated-arena', 'garrison-gaming-room']),
    corps: z.array(reference('corps')).optional(),
    address: z.string(),
    location: z.object({
      lat: z.number(),
      long: z.number(),
    }),
    equipment: z.array(z.string()).optional(),
    // Short public operational status/setup note — no personal data.
    status: z.string().optional(),
    pocName: z.string().optional(),
    pocRole: z.string().optional(),
    photos: z.array(z.string()).optional(),
    active: z.boolean().default(true),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    relatedEvent: reference('events').optional(),
    // External press coverage of the same story — outlet name + link.
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sponsors' }),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    website: z.string().url(),
    // When and how the partnership works — real details pending from the
    // programme; leave narrative-body placeholders honest until then.
    active: z.boolean().default(true),
  }),
});

export const collections = { disciplines, corps, events, locations, news, sponsors };
