# Event photos

Same convention as `public/photos/locations/`, one subfolder per event's
file slug:

```
public/photos/events/<event-id>/<anything>.jpg
```

Example, for `src/content/events/code-bowl-vii.yaml`:

```
public/photos/events/code-bowl-vii/team.jpg
public/photos/events/code-bowl-vii/action.jpg
```

Then list them in that event's frontmatter (`photos` field in the schema):

```yaml
photos:
  - "/photos/events/code-bowl-vii/team.jpg"
```

They show as a small gallery (with click-to-zoom) on that event's
`/events/<id>` page. Resize/compress before adding — 1600px wide,
JPEG quality ~80 is the standard used elsewhere on the site; a phone
photo straight off camera is bigger than the page needs.

For a `news` post instead of (or alongside) an event, you can also embed
a photo directly in the article body with normal markdown image syntax —
no schema field needed there, it just renders in the article text.

## PERSEC note — different from location photos

`public/photos/locations/README.md` says faces/names shouldn't appear in
location photos, because those reveal who's stationed at a specific
barracks day-to-day. Event photos are a different case: these are public
tournaments (Code Bowl, Insomnia, etc.) already covered by outside press
(Forces News, British Esports Federation, and so on), and team/press
photos showing players' faces and gamertags are normal publicity practice
for an esports team, not an OPSEC concern.

That said, still use judgement per photo:
- Gamertags/first-names on shirts (as already used in published press
  coverage) are fine.
- A **full real name** clearly readable in a photo (e.g. a name-plate
  on a desk) is a different, more identifying category — crop it out
  or check before publishing, same as any other full-name PII.
