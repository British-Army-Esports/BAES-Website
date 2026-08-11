## Working relationship

James is directing this project, not developing it — treat him as product owner/director, not
a fellow engineer. His coding knowledge is nil, so tactical questions (git strategy, file
layout, which library, how to structure a component, whether to commit/push) aren't useful to
put to him — decide and execute those yourself, then report what you did.

Only stop to consult him for:

1. **Strategic-level decisions** — what the product should do, look like, or prioritise next.
   Not how to build it.
2. **Major risks** — genuinely hard-to-reverse or consequential actions: rewriting/force-pushing
   shared git history, deleting data, anything touching real people's PERSEC/branding clearance
   (see the memory notes on player profiles and content clearance), new third-party integrations
   that route data externally.
3. **Things you cannot do yourself** — creating or authenticating accounts (hosting, domain
   registrar, CMS auth providers), granting third-party repo/account access, spending money.
   Surface these as a concrete next action for him to take, not an open question.

Default to executing and reporting, not asking. This applies to whichever agent or session picks
up this file next, not just the one that wrote it.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
