import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Decap CMS serialises a left-blank optional field as an empty string "",
// not as an omitted key — but zod's `.optional()` only accepts `undefined`,
// not `""`. Without this, a lay editor leaving an optional date/number/URL
// field untouched produces a file that fails schema validation and takes
// the whole site's build down for everyone, not just that one entry. Wrap
// any optional field a CMS form can leave blank in `blankable()` so an
// empty string is treated the same as not having provided it at all.
function blankable<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((val) => (val === '' ? undefined : val), schema.optional());
}

const disciplines = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/disciplines' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string().optional(),
    // Short stock-ticker-style code shown on the Disciplines cards, e.g.
    // "COD", "CS2" — same pattern as Corps' `abbreviation` field.
    ticker: z.string().optional(),
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
    // The real taxonomy of British Army esports fixtures: how big/what kind
    // of competition it is. engagement: outreach/festival presence, not a
    // formal competitive bracket. single-service: within the Army only
    // (Corps-vs-Corps, unit-level) — displayed as "Army-Wide", not "Single
    // Service": that label read ambiguously as "one particular unit is
    // entering" rather than its intended meaning of "Army-only, not
    // tri-service". military: UK tri-service, not specifically national or
    // international. uk-national: national level, e.g. representing all
    // four home nations. international-military: military competition
    // against other countries. european: civilian European-level
    // competition (e.g. FACEIT ESEA), not military-specific.
    scale: z.enum([
      'engagement',
      'single-service',
      'military',
      'uk-national',
      'international-military',
      'european',
    ]),
    // Who actually fielded the team, distinct from scale. corps: a specific
    // Corps team (see the `corps` field above for which one). baes: the
    // central British Army Esports team. ukaf: a UK Armed Forces
    // (tri-service) team, not Army/BAES-exclusive. Optional: many
    // engagement-type presences don't have a clean team qualifier.
    team: blankable(z.enum(['corps', 'baes', 'ukaf'])),
    presenceType: z.enum(['competitive', 'community-outreach', 'mixed']),
    // Editorial prominence, not derived from scale — a small-scale-but-huge-
    // audience LAN presence (EPIC, Enclave) is "major" for display purposes
    // even though `scale` calls it "engagement", while an Army-only fixture
    // stays "minor" even at a real competitive scale. Deliberately a
    // separate field rather than inferred, because there's no formula that
    // gets both of those right at once.
    tier: z.enum(['major', 'minor']).default('minor'),
    date: z.coerce.date(),
    endDate: blankable(z.coerce.date()),
    // confirmed: render `date`/`endDate` as-is.
    // provisional: render a "likely [window]" chip, using dateOptions if present.
    // tbc: render a "Date TBC" badge; `date` is an internal sort anchor only,
    // never shown as a real date.
    dateStatus: z.enum(['confirmed', 'provisional', 'tbc']).default('confirmed'),
    dateOptions: z.array(z.string()).optional(),
    // Editorial-only signal, not read anywhere in the rendering code (the
    // pages already infer online-vs-physical from whether `location` is
    // set). Exists purely so the Decap form can put a clear "Online or
    // In-Person" choice right before the Location section, since a lay
    // editor was putting a Discord server name into Venue Name — Decap has
    // no native conditional-field support to actually hide Location when
    // Online is picked, so this is a strong steer via copy instead.
    format: blankable(z.enum(['online', 'in-person'])),
    // Optional: online-only fixtures and unconfirmed internal fixtures have
    // no fixed physical venue. lat/long are themselves optional within it —
    // a lay editor filling this in via the CMS often knows the venue name
    // but not its exact coordinates, and that's still worth recording (shows
    // as text everywhere) even though it can't be plotted on the map without
    // real coordinates. `name` is also left blankable in Decap (a lay
    // editor needs to be able to leave the entire section untouched for an
    // online event) — but a location with no name is meaningless, not a
    // real partial location, so if it comes back empty the whole object is
    // dropped rather than persisting `{ name: "" }` and having pages render
    // an empty "📍 " with nothing after it.
    location: z
      .preprocess(
        (val) => (val && typeof val === 'object' && !('name' in val && val.name) ? undefined : val),
        z.object({
          name: z.string(),
          lat: blankable(z.number()),
          long: blankable(z.number()),
        }),
      )
      .optional(),
    description: z.string().optional(),
    resultsSummary: z.string().optional(),
    externalLink: blankable(z.string().url()),
    // When players need to sign up ahead of the event itself, distinct from
    // the event's own date. Optional: most fixtures (outreach presences,
    // things with no open sign-up) don't have one.
    registrationDeadline: blankable(z.coerce.date()),
    // Real photos from the event itself — team shots, LAN floor, action
    // shots. See public/photos/events/README.md for the folder convention
    // and the PERSEC note on faces/names in this category vs. location
    // photos.
    photos: z.array(z.string()).optional(),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    name: z.string(),
    // Scale of team play the hub can actually support, not a generic room
    // label: arena-venue (biggest, e.g. Minley's 35+ PCs), competition-venue
    // (2x 5-player teams, ~10+ PCs), training-venue (1x 5-player team),
    // limited-setup (console-only or a handful of PCs), unspecified (no
    // equipment count known yet).
    type: z.enum([
      'arena-venue',
      'competition-venue',
      'training-venue',
      'limited-setup',
      'unspecified',
    ]),
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
    // AI-stylised "vision" shots — deliberately a separate field from
    // `photos`, never shown by default, never mixed into the real gallery.
    // The page only offers these behind an explicit "Enhance!" toggle,
    // clearly labelled as an aspirational vision rather than what the space
    // actually looks like today.
    enhancedPhotos: z.array(z.string()).optional(),
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

const standings = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/standings' }),
  schema: z.object({
    discipline: reference('disciplines'),
    season: z.string(),
    // The official tournament: Corps are the teams. Empty until results
    // exist to publish — the UI shows a "not yet published" state rather
    // than fabricated rows.
    rows: z
      .array(
        z.object({
          corps: reference('corps'),
          played: z.number().default(0),
          won: z.number().default(0),
          lost: z.number().default(0),
          gd: z.number().default(0),
          pts: z.number().default(0),
        }),
      )
      .default([]),
  }),
});

export const collections = { disciplines, corps, events, locations, news, sponsors, standings };
