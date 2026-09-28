// Stream schedule, read live from the production team's public Google
// Calendar in the visitor's browser — so schedule changes show up without a
// site deploy. Client-side only.
//
// Only calendar entries whose title starts with a site event's `streamTag`
// (e.g. "BAEL F1 S6" for tag "BAEL F1") are ever shown on the site. The
// calendar itself is public, though: anything not meant for the public
// should be set to Visibility: Private in Google Calendar, which hides its
// title/location/description from everyone outside the team.
//
// The API key is meant to be public — it only works for reading calendars,
// and is restricted to this site in Google Cloud.

const CALENDAR_ID = 'britisharmyesportsproduction@gmail.com';
const API_KEY = 'AIzaSyClK8L9GUkWMURh8xo3wm46lv0NDVQof40';
const CACHE_KEY = 'baes-streams-v1';
const CACHE_MS = 10 * 60 * 1000;

export interface StreamEntry {
  title: string;
  start: number; // ms
  end: number; // ms
  link?: string; // e.g. Twitch URL from the entry's location
}

let pending: Promise<StreamEntry[] | null> | null = null;

// null = couldn't reach the calendar (callers fall back to the event's
// streamTime/streamDays). An empty array means "reached it, nothing on".
export function getStreams(): Promise<StreamEntry[] | null> {
  pending ??= load();
  return pending;
}

async function load(): Promise<StreamEntry[] | null> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { at, entries } = JSON.parse(cached);
      if (Date.now() - at < CACHE_MS) return entries;
    }
  } catch {
    // Storage blocked (private browsing etc.) — just fetch.
  }
  try {
    const now = Date.now();
    const params = new URLSearchParams({
      key: API_KEY,
      singleEvents: 'true', // expand repeating series into each week
      orderBy: 'startTime',
      timeMin: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      timeMax: new Date(now + 120 * 24 * 60 * 60 * 1000).toISOString(),
      maxResults: '250',
      fields: 'items(summary,start,end,location,status)',
    });
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const entries: StreamEntry[] = (data.items ?? [])
      // Private entries arrive with no title — never shown.
      .filter((e: any) => e.summary && e.status !== 'cancelled' && e.start?.dateTime)
      .map((e: any) => ({
        title: String(e.summary).trim(),
        start: Date.parse(e.start.dateTime),
        end: Date.parse(e.end?.dateTime ?? e.start.dateTime),
        link: /^https:\/\/(www\.)?twitch\.tv\//i.test(e.location ?? '') ? e.location : undefined,
      }));
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), entries }));
    } catch {
      // ignore
    }
    return entries;
  } catch {
    return null;
  }
}

// Case-insensitive "title starts with tag", on a word boundary, so tag
// "BAEL F1" matches "BAEL F1 S6" and "BAEL F1 | S6" but not "BAEL F10".
export function matchesTag(title: string, tag: string): boolean {
  const t = title.toLowerCase();
  const g = tag.trim().toLowerCase();
  return t.startsWith(g) && (t.length === g.length || /[^a-z0-9]/.test(t[g.length]));
}

// Badge for a season from its calendar entries (already filtered to the
// season's tag and dates). With the calendar reachable but nothing coming
// up — e.g. between splits — it says so plainly rather than guessing.
export function streamBadge(entries: StreamEntry[], now: number): { text: string; live: boolean; link?: string } {
  const live = entries.find((e) => e.start <= now && now < e.end);
  if (live) return { text: '📺 Streaming now', live: true, link: live.link };
  const next = entries.find((e) => e.start > now);
  if (!next) return { text: 'Season in progress', live: false };
  const day = ukDayLabel(next.start, now);
  const time = ukTime(next.start);
  return day === 'today'
    ? { text: `📺 Stream starts ${time}`, live: false, link: next.link }
    : { text: `📺 Next stream ${day} ${time}`, live: false, link: next.link };
}

const ukParts = (ms: number, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', ...opts }).format(new Date(ms));

export const ukTime = (ms: number) => ukParts(ms, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const ukDayKey = (ms: number) => ukParts(ms, { year: 'numeric', month: '2-digit', day: '2-digit' });

// "today" / "tomorrow" / "Mon" (within a week) / "12 Oct" — in UK time.
export function ukDayLabel(ms: number, now: number): string {
  if (ukDayKey(ms) === ukDayKey(now)) return 'today';
  if (ukDayKey(ms) === ukDayKey(now + 24 * 60 * 60 * 1000)) return 'tomorrow';
  if (ms - now < 6 * 24 * 60 * 60 * 1000) return ukParts(ms, { weekday: 'short' });
  return ukParts(ms, { day: 'numeric', month: 'short' });
}
