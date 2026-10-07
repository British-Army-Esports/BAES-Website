# Organisation logos (About page)

Logos for the governance/ecosystem bodies listed on `/about` (Reports
To, Sister Services, National Governing Body, Wider Recognition).

Drop a file in here named after the org, then add the `logo` path to
its entry in the `govGroups` array in `src/pages/about/index.astro`:

```
public/logos/orgs/<org>.png
```

```ts
{ name: 'British Esports', href: 'https://britishesports.org/', logo: '/logos/orgs/british-esports.png' },
```

All bodies listed on /about now have a logo.

Have: `uk-armed-forces-sport.png` (no website, so no link), `army-sport.png`, `raf-esports.png`, `rn-esports.jpg`,
`british-esports.png`, `ideg.png`, `uk-veterans-gaming.png`, `bfbs-esports.png` (trimmed and
resized to 160px; originals not kept in the repo).

Use each org's own official logo file where possible (media kit,
official site) rather than a screenshot/crop — same reasoning as the
sponsor logos and Corps crests elsewhere in `public/logos/`. No fixed
size needed; they're displayed at a small, consistent thumbnail size
either way.
