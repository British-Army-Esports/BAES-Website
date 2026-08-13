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

export function getLiveStatus(
  event: { presenceType: string; dateStatus?: DateStatus; date: Date | string; endDate?: Date | string },
  now: number,
): LiveStatus {
  const start = toDate(event.date).getTime();
  const end = event.endDate ? toDate(event.endDate).getTime() : start + 24 * 60 * 60 * 1000;
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
    const endDate = event.endDate ? toDate(event.endDate) : date;
    const isPast = endDate.getTime() < Date.now();
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
