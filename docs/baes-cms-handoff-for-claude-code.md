# BAES Website — Decap CMS Setup for Claude Code

Context: follows the earlier project handoff + fixtures data handoff. This
covers adding a Git-based CMS so the non-technical content team can add/edit
Events, Corps pages, Players, and Content Creators through a login + form
interface, with every save landing as a commit in
`British-Army-Esports/BAES-Website` and triggering the existing auto-deploy.

## Why Decap CMS specifically
- Free, open source, no separate database or hosting cost — the GitHub repo
  is the datastore
- Content team never touches Git directly — they see a form matching the
  schema, hit publish, it commits to the repo automatically
- Fits directly on top of the Astro Content Collections already in place —
  same markdown + frontmatter files, no migration needed
- Access is per-person via GitHub OAuth or Netlify Identity — individually
  revocable, important given personnel turnover

## 1. Install and mount the admin
```
npm install decap-cms-app
```
Create `/public/admin/index.html`:
```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Content Manager</title></head>
<body>
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```
This becomes reachable at `yourdomain.org.uk/admin` once deployed.

## 2. Auth backend
Simplest path given hosting is Netlify/Cloudflare Pages: use **Netlify
Identity + Git Gateway** (no separate OAuth app to register), or **GitHub
backend** if you'd rather grant access via GitHub org membership directly.
Recommend GitHub backend since the team already has org-level access control
set up — one less system to manage.

In `/public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: British-Army-Esports/BAES-Website
  branch: main

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "events"
    label: "Events"
    folder: "src/content/events"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - label: "Discipline"
        name: "discipline"
        widget: "select"
        multiple: true
        options: ["CS2", "Valorant", "Rocket League", "Call of Duty", "League of Legends", "FIFA/EAFC", "Other"]
      - label: "Scale"
        name: "scale"
        widget: "select"
        options: ["Unit/Garrison", "Corps", "Inter-Corps", "Army (National)", "Inter-Service", "International", "Mixed/Community"]
      - { label: "Corps (if applicable)", name: "corps", widget: "relation", collection: "corps", search_fields: ["title"], value_field: "title", required: false }
      - label: "Presence Type"
        name: "presenceType"
        widget: "select"
        options: ["Competitive", "Community/Outreach", "Mixed"]
      - label: "Media Priority"
        name: "mediaPriority"
        widget: "select"
        options: ["P1", "P2", "P3"]
        default: "P3"
      - label: "Date Status"
        name: "dateStatus"
        widget: "select"
        options: ["confirmed", "provisional", "tbc"]
        default: "confirmed"
      - { label: "Date", name: "date", widget: "datetime", required: false }
      - { label: "Possible Dates (if provisional)", name: "dateOptions", widget: "list", field: { label: "Date", name: "option", widget: "datetime" }, required: false }
      - { label: "Format", name: "format", widget: "select", options: ["Online", "LAN", "In-person"] }
      - { label: "Location Name", name: "locationName", widget: "string", required: false }
      - { label: "Latitude", name: "lat", widget: "number", required: false, value_type: "float" }
      - { label: "Longitude", name: "lng", widget: "number", required: false, value_type: "float" }
      - { label: "Description", name: "body", widget: "markdown" }

  - name: "corps"
    label: "Corps Pages"
    folder: "src/content/corps"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Corps Name", name: "title", widget: "string" }
      - { label: "Crest/Logo", name: "logo", widget: "image", required: false }
      - { label: "Short Description", name: "description", widget: "text" }
      - { label: "Contact Email", name: "contact", widget: "string", required: false }
      - { label: "Body", name: "body", widget: "markdown", required: false }

  - name: "players"
    label: "Players (admin-curated roster)"
    folder: "src/content/players"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Gamertag", name: "gamertag", widget: "string" }
      - label: "Disclosure Tier"
        name: "disclosureTier"
        widget: "select"
        options: ["Gamertag only", "Gamertag + Corps", "Full profile"]
        default: "Gamertag only"
      - { label: "Real Name (only if Full profile tier)", name: "realName", widget: "string", required: false }
      - { label: "Corps (only if tier allows)", name: "corps", widget: "relation", collection: "corps", search_fields: ["title"], value_field: "title", required: false }
      - { label: "Discipline(s)", name: "discipline", widget: "select", multiple: true, options: ["CS2", "Valorant", "Rocket League", "Call of Duty", "League of Legends", "FIFA/EAFC", "Other"] }
      - { label: "Role", name: "role", widget: "string", required: false }
      - { label: "Photo (only if consented)", name: "photo", widget: "image", required: false }
      - label: "PERSEC/Branding Clearance Confirmed"
        name: "clearanceConfirmed"
        widget: "boolean"
        default: false
        hint: "Do not publish until this is ticked — confirms DDC/PERSEC sign-off has happened for this entry"

  - name: "creators"
    label: "Content Creators"
    folder: "src/content/creators"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Handle", name: "handle", widget: "string" }
      - label: "Platform(s)"
        name: "platforms"
        widget: "select"
        multiple: true
        options: ["Twitch", "YouTube", "TikTok", "Instagram", "X"]
      - { label: "Channel Link", name: "link", widget: "string" }
      - { label: "What they stream/create", name: "description", widget: "text" }
      - label: "Opt-in Confirmed"
        name: "optInConfirmed"
        widget: "boolean"
        default: false
        hint: "Creator has explicitly agreed to be listed and confirmed current handle/links"
      - label: "Disclaimer shown"
        name: "disclaimerShown"
        widget: "boolean"
        default: true
        hint: "Should always be true — 'views are the individual's own' disclaimer, not official Army output"

  - name: "locations"
    label: "Permanent Locations"
    folder: "src/content/locations"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Name", name: "title", widget: "string" }
      - label: "Type"
        name: "type"
        widget: "select"
        options: ["Training facility", "Dedicated arena", "Garrison gaming room"]
      - { label: "Corps (if applicable)", name: "corps", widget: "relation", collection: "corps", search_fields: ["title"], value_field: "title", required: false }
      - { label: "Latitude", name: "lat", widget: "number", value_type: "float" }
      - { label: "Longitude", name: "lng", widget: "number", value_type: "float" }
      - { label: "Equipment", name: "equipment", widget: "text", required: false }
      - { label: "Booking Contact", name: "contact", widget: "string", required: false }
      - { label: "Photos", name: "photos", widget: "list", field: { label: "Image", name: "image", widget: "image" }, required: false }

  - name: "news"
    label: "News Posts"
    folder: "src/content/news"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Cover Image", name: "image", widget: "image", required: false }
      - { label: "Body", name: "body", widget: "markdown" }
```

## 3. Access control
- Add content team members as GitHub collaborators on the org repo with
  **Write** (not Admin) role — enough to let Decap commit, not enough to
  change repo settings or delete it
- Decap's GitHub backend will prompt them to authorise via GitHub OAuth on
  first login — no separate password system to manage
- To revoke someone, remove their GitHub org/repo access — immediate, no
  separate CMS user database to clean up

## 4. Editorial workflow (recommended, not default)
Decap supports an **Editorial Workflow** mode, which turns every save into a
draft PR rather than a direct commit to `main`:
```yaml
publish_mode: editorial_workflow
```
Given the PERSEC/branding clearance gate already established for Players and
Content Creators, this is worth turning on — it means nothing goes live
until someone (you, or a designated approver) reviews and merges, rather than
the content team publishing directly. Costs a small amount of friction for a
meaningful safety net on exactly the content types that need it.

## 5. Next steps for Claude Code
1. Create `/public/admin/index.html` and `/public/admin/config.yml` as above
2. Confirm the Astro Content Collections schema (`src/content/config.ts`)
   matches these field names exactly, including the `dateStatus`/
   `dateOptions`/`mediaPriority` fields from the fixtures handoff doc
3. Enable `publish_mode: editorial_workflow`
4. Add content team members as GitHub org collaborators with Write role
5. Test: log in at `/admin` on the deployed preview URL, create a test
   Event, confirm it commits to the repo and triggers a redeploy
6. Document the `/admin` login process as a one-pager for the content team
   separately — non-technical, screenshot-based, not a Git tutorial
