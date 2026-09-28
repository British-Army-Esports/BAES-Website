// Shared date-rendering logic for events with unstable/unconfirmed dates.
// Used both server-side (Astro frontmatter) and client-side (MapView island).

export type DateStatus = 'confirmed' | 'provisional' | 'tbc';

export interface EventDateInfo {
  date: Date | string;
  endDate?: Date | string;
  dateStatus?: DateStatus;
  dateOptions?: string[];
}

export interface LiveStatus {
  // Genuinely happening right now, worth the pulsing "LIVE" treatment — a
  // LAN weekend, a finals day. Capped to short-span events on purpose.
  isLive: boolean;
  // Also currently within its date range, but spans too long (a multi-week
  // season/qualifier window) to honestly claim "live now, watch this
  // moment" for its entire duration — a calmer "streaming now" treatment
  // instead of the urgent pulsing one.
  isOngoingBroadcast: boolean;
}

// A live window longer than this reads as a season/qualifier run, not a
// single occasion — e.g. BFBS Pro League Qualifiers spans ~2 months, CS2
// EMEA spans several weeks. Both are real and worth surfacing, just not
// with the same "drop everything, it's on right now" urgency as a 3-day
// LAN final.
const SHORT_SPAN_DAYS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

// Dates are stored as midnight at the *start* of the day, but an event runs
// to the end of its last day — so it's only over from midnight the day
// after. Use this everywhere "has this event finished?" is decided, rather
// than comparing against the raw end date (which drops an event a day early,
// and a one-day event at 00:00 on its own day).
export function eventEndMs(event: { date: Date | string; endDate?: Date | string }): number {
  return toDate(event.endDate ?? event.date).getTime() + DAY_MS;
}

export function getLiveStatus(
  event: { presenceType: string; dateStatus?: DateStatus; date: Date | string; endDate?: Date | string },
  now: number,
): LiveStatus {
  const start = toDate(event.date).getTime();
  const end = eventEndMs(event);
  const eligible =
    event.presenceType !== 'community-outreach' &&
    (event.dateStatus ?? 'confirmed') === 'confirmed' &&
    now >= start &&
    now <= end;
  const spanDays = (end - start) / (1000 * 60 * 60 * 24);
  return {
    isLive: eligible && spanDays <= SHORT_SPAN_DAYS,
    isOngoingBroadcast: eligible && spanDays > SHORT_SPAN_DAYS,
  };
}

// ---- Stream badge for long-running seasons -------------------------------
// A season (e.g. a 5-month league) is "in progress" for its whole date range,
// but only actually streams on certain nights. Dates alone can't say whether
// a stream is on *right now*, so events can carry an optional stream time and
// days (UK time). Worked out in the visitor's browser, since time of day
// matters and a static build only knows the day it was built.

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface SeasonInfo {
  start: string; // ISO date
  endDate?: string; // ISO date
  streamTime?: string; // "HH:MM", UK time
  streamDays?: Weekday[];
  // Matches this season to entries in the production stream calendar
  // (see lib/streams). Time/days above are the fallback if it can't be read.
  streamTag?: string;
}

// Long, confirmed, non-outreach events — the ones that get a season badge
// rather than the pulsing LIVE treatment (see getLiveStatus).
export function seasonInfo(event: {
  presenceType: string;
  dateStatus?: DateStatus;
  date: Date;
  endDate?: Date;
  streamTime?: string;
  streamDays?: Weekday[];
  streamTag?: string;
}): SeasonInfo | undefined {
  if (event.presenceType === 'community-outreach' || (event.dateStatus ?? 'confirmed') !== 'confirmed') return undefined;
  const spanDays = (eventEndMs(event) - event.date.getTime()) / DAY_MS;
  if (spanDays <= SHORT_SPAN_DAYS) return undefined;
  return {
    start: event.date.toISOString(),
    endDate: event.endDate?.toISOString(),
    streamTime: event.streamTime,
    streamDays: event.streamDays,
    streamTag: event.streamTag,
  };
}

const STREAM_WINDOW_MINUTES = 180;

function ukNow(now: number): { weekday: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(now));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { weekday: get('weekday') as Weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

// null = season not in progress right now (not started, or finished).
export function seasonBadge(season: SeasonInfo, now: number): { text: string; live: boolean } | null {
  const start = new Date(season.start).getTime();
  if (now < start || now >= eventEndMs({ date: season.start, endDate: season.endDate })) return null;

  const time = season.streamTime;
  const days = season.streamDays ?? [];
  if (!time) return { text: 'Season in progress', live: false };
  if (days.length === 0) return { text: `📺 Streams ${time}`, live: false };

  const [h, m] = time.split(':').map(Number);
  const startMin = h * 60 + m;
  const today = ukNow(now);
  if (days.includes(today.weekday)) {
    if (today.minutes < startMin) return { text: `📺 Stream starts ${time}`, live: false };
    if (today.minutes < startMin + STREAM_WINDOW_MINUTES) return { text: '📺 Streaming now', live: true };
  }
  // Next stream day after today (wrapping round the week).
  const todayIdx = WEEKDAYS.indexOf(today.weekday);
  for (let i = 1; i <= 7; i++) {
    const day = WEEKDAYS[(todayIdx + i) % 7];
    if (days.includes(day)) {
      const label = i === 1 ? 'tomorrow' : day.slice(0, 3);
      return { text: `📺 Next stream ${label} ${time}`, live: false };
    }
  }
  return { text: 'Season in progress', live: false };
}

export interface FormattedEventDate {
  text: string;
  badge: DateStatus;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function formatRange(date: Date, endDate?: Date): string {
  if (!endDate) {
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  const sameMonth = date.getMonth() === endDate.getMonth() && date.getFullYear() === endDate.getFullYear();
  const sameYear = date.getFullYear() === endDate.getFullYear();
  if (sameMonth) {
    return `${date.getDate()}–${endDate.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  if (sameYear) {
    return `${date.getDate()} ${MONTHS[date.getMonth()]} – ${endDate.getDate()} ${MONTHS[endDate.getMonth()]} ${date.getFullYear()}`;
  }
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()} – ${endDate.getDate()} ${MONTHS[endDate.getMonth()]} ${endDate.getFullYear()}`;
}

// Turns a rough window string like "2026-09-XX" or "2026-09" into "Sep 2026".
// Falls back to the raw string if it doesn't match the expected shape.
function formatRoughOption(opt: string): string {
  const match = opt.match(/^(\d{4})-(\d{2})/);
  if (!match) return opt;
  const year = match[1];
  const monthIndex = parseInt(match[2], 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return opt;
  return `${MONTHS[monthIndex]} ${year}`;
}

export function formatEventDate(event: EventDateInfo): FormattedEventDate {
  const status: DateStatus = event.dateStatus ?? 'confirmed';
  const date = toDate(event.date);

  if (status === 'tbc') {
    return { text: 'Date TBC', badge: 'tbc' };
  }

  if (status === 'provisional') {
    // "Likely" is a prediction about something that hasn't happened yet —
    // nonsensical for an event that's already over. For a past event with
    // only an approximate date on record, just state the window plainly
    // (e.g. "2020" or "Dec 2020"), no "Likely" prefix.
    const isPast = eventEndMs(event) < Date.now();
    const windowText =
      event.dateOptions && event.dateOptions.length > 0
        ? event.dateOptions.map(formatRoughOption).join(' or ')
        : `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    return { text: isPast ? windowText : `Likely ${windowText}`, badge: 'provisional' };
  }

  const endDate = event.endDate ? toDate(event.endDate) : undefined;
  return { text: formatRange(date, endDate), badge: 'confirmed' };
}

// Sort helper for lists mixing confirmed/provisional/TBC events. A TBC
// event's `date` is only an internal placeholder, not a real estimate — several
// unrelated TBC fixtures can share the same placeholder date, which would
// otherwise put them ahead of events we actually have a real (even rough)
// date for. TBC events sort after everything else, by title so their
// relative order is at least stable rather than depending on placeholder
// dates; confirmed/provisional events sort by their real/estimated date as
// normal.
export function compareEventDates(
  a: { sortDate: number; badge: DateStatus; title: string },
  b: { sortDate: number; badge: DateStatus; title: string },
): number {
  const aTbc = a.badge === 'tbc';
  const bTbc = b.badge === 'tbc';
  if (aTbc !== bTbc) return aTbc ? 1 : -1;
  if (aTbc && bTbc) return a.title.localeCompare(b.title);
  return a.sortDate - b.sortDate;
}

// Most-recent-first variant, for lists (like a Corps' fixture history) that
// mix past and future together rather than splitting them into their own
// sections. Simply reversing compareEventDates' result would also flip TBC
// events to the front, which is wrong for the same reason it's wrong the
// other way round — a TBC event isn't "the most recent", it has no real
// date at all — so TBC still always sorts last here, only the dated events'
// order flips to newest-first.
export function compareEventDatesDesc(
  a: { sortDate: number; badge: DateStatus; title: string },
  b: { sortDate: number; badge: DateStatus; title: string },
): number {
  const aTbc = a.badge === 'tbc';
  const bTbc = b.badge === 'tbc';
  if (aTbc !== bTbc) return aTbc ? 1 : -1;
  if (aTbc && bTbc) return a.title.localeCompare(b.title);
  return b.sortDate - a.sortDate;
}
