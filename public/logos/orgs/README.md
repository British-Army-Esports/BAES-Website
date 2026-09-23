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

Still needed (unset `logo` for now, renders as plain text until added):

- UK Armed Forces Sport
- Army Sport
- RAF Esports
- British Esports
- International Defence Esports Games (IDEG)
- BFBS Esports
- UK Veterans Gaming

Already have one: `rn-esports.jpg` (moved here from `logos/teams/`,
where it was unused).

Use each org's own official logo file where possible (media kit,
official site) rather than a screenshot/crop — same reasoning as the
sponsor logos and Corps crests elsewhere in `public/logos/`. No fixed
size needed; they're displayed at a small, consistent thumbnail size
either way.
