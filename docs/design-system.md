# British Army Esports Website Design System
Version 1.0  
Purpose: visual and UX specification for AI-assisted website development

## Design vision

Create a premium esports website that feels like a **military command interface for competitive gaming**. The experience should combine the professionalism of British military branding, the production quality of a top-tier esports broadcast, and the clarity of a modern editorial sports platform.

The website should communicate:

- discipline
- precision
- performance
- hierarchy
- readiness
- authority

The design should feel **engineered rather than decorative**.

---

# Core design principles

## Command interface aesthetic

The UI should resemble a tactical operations dashboard rather than a gaming fan site.

Avoid:

- neon cyberpunk styling
- excessive glow effects
- rounded playful interfaces
- cluttered gaming aesthetics

Prefer:

- angular geometry
- structured information hierarchy
- restrained colour usage
- high contrast
- modular panels

## Professional esports production

The site should feel comparable to:

- ESL
- BLAST
- Valorant Champions broadcast graphics
- Formula 1 timing interfaces
- military operations displays

The visual language should suggest competitive excellence.

---

# Colour system

## Primary palette

| Token | Colour |
|-------|--------|
| Background | #08090B |
| Surface | #111418 |
| Surface Elevated | #181C22 |
| Border | #2A2F38 |
| Text Primary | #FFFFFF |
| Text Secondary | #A7B0BB |
| Text Muted | #6F7782 |
| Accent Crimson | #C1121F |
| Accent Crimson Hover | #D11F2D |

## Usage

Backgrounds should be predominantly black and charcoal.

Crimson should be used selectively for:

- active navigation
- buttons
- highlights
- borders
- status indicators
- section accents

Red should never dominate the interface.

---

# Typography

## Primary heading

Bold condensed sans-serif.

Recommended:

- Bebas Neue
- DIN Condensed
- Agency-style condensed fonts

Characteristics:

- uppercase
- tight letter spacing
- large scale
- strong vertical rhythm

## Body typography

Clean modern sans-serif.

Recommended:

- Inter
- Geist
- IBM Plex Sans
- Source Sans

Hierarchy:

- H1: 64-80px
- H2: 40-48px
- H3: 28-32px
- H4: 20-24px
- Body: 16-18px
- Metadata: 12-14px uppercase

---

# Layout system

## Grid

Desktop-first.

Use a strict 12-column grid.

Max width:

1440-1600px

Section spacing:

80-120px vertical

Component spacing:

24-40px

## Information hierarchy

Pages should be highly scannable.

Structure:

1. Hero
2. Primary content
3. Supporting data
4. Secondary widgets
5. Footer

---

# Geometry

## Design language

Everything should feel **machined and tactical**.

Use:

- sharp corners
- chamfered edges
- diagonal cuts
- segmented borders
- angular buttons
- asymmetric panel breaks

Avoid:

- rounded cards
- soft shadows
- organic shapes

## Corner treatment

Preferred:

4px chamfer

or

angled corner cuts

---

# Component system

## Cards

Cards are the primary organisational unit.

Style:

- dark surface
- thin border
- subtle red accent edge
- minimal shadow
- generous internal padding

Common card types:

- event
- news
- roster
- standings
- match result
- discipline
- recruitment

Example:

┌──────────────────────╲
│ EVENT TITLE          │
│                      │
│ Metadata             │
│                      │
│ CTA →                │
└──────────────────────┘

---

## Buttons

### Primary

- solid crimson
- white text
- angular shape
- uppercase
- arrow indicator

### Secondary

- transparent
- red outline
- white text

### Hover

- slight brightness increase
- border intensification
- 150-200ms transition

---

## Navigation

Top horizontal navigation.

Characteristics:

- compact height
- uppercase labels
- active red underline
- subtle separators
- persistent CTA on right

Example:

HOME TEAMS EVENTS DISCIPLINES NEWS ABOUT

---

# Hero sections

Heroes should be cinematic.

## Composition

Left third:

- heading
- supporting text
- CTA

Right two-thirds:

- esports arena imagery
- tournament stage
- players
- military/esports crossover

## Overlay

Use:

- dark gradient
- red directional lighting
- subtle geometric texture

---

# Data visualisation

## Standings tables

Treat standings as command data.

Requirements:

- compact rows
- strong contrast
- highlighted leader row
- minimal decoration
- condensed typography

Example columns:

- Rank
- Team
- Played
- Wins
- Losses
- Points

---

## Match results

Use segmented list rows.

Include:

- date
- team logos
- score
- result state
- link

Winning scores should use crimson emphasis.

---

# HUD-inspired details

Apply sparingly.

## Acceptable elements

- corner brackets
- fine grid textures
- diagonal dividers
- coordinate labels
- technical metadata
- segmented outlines

Opacity should remain subtle.

These elements should support structure, not become decoration.

---

# Imagery

## Style

Photography should be:

- cinematic
- high contrast
- slightly desaturated
- darkened
- accented with red lighting

Subjects:

- esports stages
- players
- command environments
- military training
- technology
- teamwork

Avoid overly saturated gaming artwork.

---

# Motion

Animations should feel mechanical.

## Timing

Fast.

150-250ms

## Preferred motion

- horizontal wipes
- panel reveals
- underline expansion
- card lift
- border illumination
- directional transitions

Avoid:

- bounce
- elastic motion
- playful scaling

---

# Page templates

## Homepage

- cinematic hero
- live ticker
- featured teams
- upcoming events
- latest news
- recruitment
- partners

## Events

- filter bar
- calendar
- interactive map
- event cards
- host event CTA

## Discipline

- hero banner
- standings
- recent matches
- next fixture
- roster
- news

## Corps

- crest
- overview
- roster placeholders
- auto event feed
- news widget
- recruitment panel

---

# Empty state strategy

Stub pages should never appear empty.

Use auto-populated widgets:

- upcoming events
- latest news
- recent matches
- recruitment
- social feed

Placeholder roster cards should maintain visual balance.

---

# Responsive behaviour

Desktop is the reference experience.

Tablet:

- reduce columns
- preserve hierarchy

Mobile:

- stack cards
- simplify tables
- collapse navigation
- maintain angular styling

Do not replace the visual identity with generic mobile UI.

---

# Accessibility

Contrast ratio:

Minimum 4.5:1

Focus states:

Crimson outline

Typography:

Minimum 16px body text

Interactive targets:

Minimum 44px height

Animations:

Respect prefers-reduced-motion

---

# AI implementation prompt

Design a premium British Army esports website that combines the visual language of a tactical command interface, a professional esports broadcast package, and a high-end editorial sports website. Use a near-black and gunmetal palette with deep crimson accents, bold condensed uppercase typography, angular geometric UI components, strict grid alignment, data-rich dashboard layouts, cinematic arena photography, and subtle HUD-inspired interface detailing. The aesthetic should feel disciplined, engineered, and authoritative rather than flashy or cyberpunk. Prioritise sharp edges, modular cards, standings tables, event feeds, and high-contrast readability with desktop-first responsive layouts.