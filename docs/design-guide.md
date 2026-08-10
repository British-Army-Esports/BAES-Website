# British Army Esports — Design Guide

Derived from approved mockups (Discipline hub, Corps page, Events calendar, Homepage).

## Brand
- **Wordmark**: "BRITISH ARMY" in white + "ESPORTS" in crimson, stacked or inline
- **Tagline**: "EXCELLENCE. ADAPTABILITY. TOGETHER." — small caps, letter-spaced, used under wordmark sitewide
- **Union Jack** used as a small badge/icon next to the wordmark, top-left of every page

## Colour Palette
| Role | Value | Usage |
|---|---|---|
| Background (base) | `#0A0A0A` – `#0D0D0D` | Page background |
| Surface (card) | `#141414` – `#1A1A1A` | Cards, panels, table rows |
| Primary accent (crimson) | `#C8102E` – `#DC1430` | CTAs, active nav state, live indicators, highlight text, top-standings row |
| Text primary | `#FFFFFF` / `#F2F2F2` | Headings, key data |
| Text secondary | `#8A8A8A` – `#9E9E9E` | Labels, meta text, timestamps |
| Border/divider | `#262626` | Card borders, table dividers |

Crimson is used sparingly and deliberately: CTAs, live/active states, score highlights, one section-divider line under active nav item. It is never used as a large background fill.

## Typography
- **Headings**: bold, condensed, uppercase sans-serif (Rajdhani / Oswald / Bebas Neue family). Large scale contrast between hero headline and body.
- **Body/UI**: clean geometric sans (Inter / Manrope), regular weight, sentence case
- **Labels/meta**: uppercase, small size, letter-spaced (nav items, stat labels, table headers, filter labels)
- Headline words are sometimes split across lines with one word in crimson for emphasis (e.g. "COMPETE. REPRESENT. **VICTORY.**")

## Layout & Components

**Navigation**
- Fixed top bar: logo left, nav links centre, social icons + crimson "JOIN US" CTA right
- Active nav item: crimson text + thin crimson underline
- CTA buttons use a clipped/angular corner (one corner cut at 45°), never fully rounded

**Live ticker**
- Thin horizontal bar directly under nav, crimson "LIVE NOW" pill with pulsing dot, live score/match info inline, "WATCH LIVE" link right-aligned

**Hero section**
- Full-bleed darkened photography (arena/gameplay), gradient overlay left-to-right or bottom-up for text legibility
- Large condensed headline, one line/word in crimson
- Primary CTA button bottom-left of text block

**Cards (news, teams, events)**
- Dark surface, angular corner cut (top-left or bottom-right), thin crimson accent flag/corner marker
- Category label top (small, crimson or grey), heading, meta row (date/location), CTA link with arrow

**Tables (standings)**
- Dark rows, header row in grey uppercase labels
- Leader/highlighted row gets full crimson fill with white text
- Compact columns: P / W / L / GD / PTS pattern

**Stat blocks**
- Icon + number + label, laid out in a horizontal row (e.g. EST. / PLAYERS / EVENTS / WINS)

**Player/roster cards**
- Greyscale silhouette placeholder until photo provided, thin crimson underline, name in caps, role/rank in grey beneath

**Filters**
- Dark bordered pill/dropdown, uppercase label above or inline, "RESET FILTERS" as a separate ghost button with icon

**Map (Events)**
- Dark-styled map (custom dark tile theme, not default light basemap)
- Crimson pin markers with pulsing ring for live/upcoming events
- Toggle between "View as Map" / "View as List"

**Buttons**
- Primary: crimson fill, white text, angular clipped corner, trailing arrow icon
- Secondary/ghost: transparent with crimson border and text

**Footer**
- Logo + tagline repeated, partner/sponsor logo row (greyscale, evenly spaced), legal links row, copyright line

## Motion (not yet in static mockups, apply during build)
- Pulsing dot for "LIVE" indicators
- Subtle hover lift/glow on cards
- Animated count-up for stat numbers on scroll into view
- Horizontal auto-scroll for ticker bar

## Consistent naming conventions seen in mockups
- Corps pages: "[CORPS NAME] ESPORTS" as page title
- Discipline pages: game name as title, "DISCIPLINE FOCUS" sidebar with values (Teamwork, Adaptability, Discipline, Integrity)
- Scale tags on events: NATIONAL / CORPS / REGIONAL / INTERNATIONAL (confirms the scale ladder discussed separately)
