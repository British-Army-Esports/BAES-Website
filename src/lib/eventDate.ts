// Shared date-rendering logic for events with unstable/unconfirmed dates.
// Used both server-side (Astro frontmatter) and client-side (MapView island).

export type DateStatus = 'confirmed' | 'provisional' | 'tbc';

export interface EventDateInfo {
  date: Date | string;
  endDate?: Date | string;
  dateStatus?: DateStatus;
  dateOptions?: string[];
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
