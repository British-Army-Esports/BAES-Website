# BAES Fixtures Data — Update for Claude Code

Context: this follows the earlier project handoff (sitemap, data model, design
guide, GitHub repo `British-Army-Esports/BAES-Website`, Astro scaffold). This
doc covers two things: (1) a schema change needed to handle fixtures with
unconfirmed or multiple possible dates, and (2) real, web-verified dates for
several fixtures from the annual programme calendar.

## 1. Schema change: add date-confidence fields to Events

The existing Events content collection (discipline / scale / corps /
presenceType / date / location) needs two additional fields, because several
recurring fixtures (C.O.D.E Bowl is the clearest example — its real-world date
has moved every year: 5 Oct 2023, 30 Sep 2025, 20 Jun 2026) are genuinely not
fixed at the time the fixtures list is built.

```yaml
dateStatus: "confirmed" | "provisional" | "tbc"
dateOptions: ["2026-09-XX", "2026-10-XX"]  # only populated when dateStatus is "provisional"
```

UI behaviour:
- `confirmed` → render the normal date as-is
- `provisional` → render a "likely [month/quarter]" chip instead of a hard
  date, using `dateOptions` if more than one window is plausible
- `tbc` → render a "date TBC" badge, still filterable by scale/discipline,
  just not sortable by date until confirmed

This keeps fixtures visible and filterable without asserting false precision
— important given how many of these events don't finalise dates until months
out.

## 2. Verified real-world dates (web-researched, not from the original chart)

These replace the month-level placeholders from the earlier chart-derived
fixtures list. Cite the source when entering into the CMS/content files so
whoever maintains this later can re-verify next cycle.

| Fixture | Status | Date(s) | Source note |
|---|---|---|---|
| C.O.D.E Bowl VII | confirmed (already occurred) | 20 Jun 2026 | British Army Esports won this — worth a News post if not already covered |
| IDEG26 Finals | confirmed | 9–11 Oct 2026 | Sunderland, National Gaming and Esports Arena (British Arena) |
| IDEG26 online qualifiers | confirmed (window) | opened Jan 2026 | precedes the Oct finals |
| EPIC 47 | confirmed | 19–22 Feb 2026 | Kettering |
| EPIC Lux Lite / Tabletop 10 | confirmed | 27–29 Mar 2026 | Coventry |
| EPIC 48 | confirmed | 16–19 Jul 2026 | Kettering |
| EPIC Lux | confirmed | 13–16 Aug 2026 | Coventry |
| EPIC 46 (with Intel) | confirmed | 30 Oct – 2 Nov 2026 | Kettering |
| EPIC Tabletop Weekender | confirmed | late Nov 2026 (~20–22) | Coventry |
| DreamHack Birmingham | confirmed | 27–29 Mar 2026 | **Only one UK DreamHack per year** — no autumn edition. Next confirmed for 2–4 Apr 2027. The original chart's second "Dreamhack" bar (~Sep/Oct) doesn't match a real event — flag to whoever supplied the chart; may be a different franchise event or a chart error |
| BFBS Pro League qualifiers | confirmed (window, recurring pattern) | Jun – Jul | consistent year-on-year |
| BFBS Pro League Grand Final | provisional | ~Sep 2026 | 2025 final was 28 Sep; 2026 exact date not yet public at time of writing. 2026 season expanded to Rocket League, F1 25, League of Legends, plus new BFBS Open Series for beginners |

## 3. Could not verify publicly — likely internal/regimental-level

AFDL, 4-Nations, Enclave, and DMEL returned nothing in open web search. These
read as internal/lower-tier fixtures not published anywhere indexable, not
events with genuinely unstable dates. Source these directly from whoever
supplied the original programme calendar rather than trying to verify online
— don't leave them as `dateStatus: tbc` indefinitely if the actual answer is
just "ask the programme office."

## 4. Immediate next steps for Claude Code

1. Add `dateStatus` and `dateOptions` fields to the Events content collection
   schema (`src/content/config.ts` if using Astro's typed collections)
2. Build the date-rendering logic described in section 1 (confirmed / likely
   chip / TBC badge) into whatever component renders event cards and the
   events calendar/map
3. Create real content entries for the verified fixtures in section 2 —
   these can go in now with real dates rather than placeholders
4. Leave AFDL / 4-Nations / Enclave / DMEL as stub entries with
   `dateStatus: tbc` and a note to chase the programme office for actual
   dates, rather than guessing
