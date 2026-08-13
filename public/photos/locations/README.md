# Location photos

Drop hub photos in a subfolder named after the location's file slug —
same id used everywhere else for that hub (its content file, its
`/locations/<id>/request` URL, etc.).

```
public/photos/locations/<location-id>/<anything>.jpg
```

Example, for `src/content/locations/kinloss-barracks.md`:

```
public/photos/locations/kinloss-barracks/gaming-room.jpg
public/photos/locations/kinloss-barracks/pc-row.jpg
```

Then list them in that hub's frontmatter (`photos` field already exists in
the schema, just not populated yet on any hub):

```yaml
photos:
  - "/photos/locations/kinloss-barracks/gaming-room.jpg"
  - "/photos/locations/kinloss-barracks/pc-row.jpg"
```

They show as a small gallery on that hub's `/locations/<id>/request` page.
No fixed size/aspect ratio required — they're cropped to a consistent
4:3 tile on the page, so a normal phone photo is fine. Keep individual
files under a few MB if possible (a phone photo straight off camera can
be 5-10MB+, more than the page needs) — doesn't need to be pixel-perfect,
just reasonably web-sized.

This folder (and any photos in it) becomes part of the public repo and
public site, same PERSEC rule as everywhere else on this site: equipment
and facilities are fine to show, people's faces/names are not — crop or
choose photos accordingly.
