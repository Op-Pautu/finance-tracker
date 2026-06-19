import {
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  isValid,
} from "date-fns";

/** ISO date (yyyy-MM-dd) for the first day of the given month. */
export function monthStart(d: Date = new Date()): string {
  return format(startOfMonth(d), "yyyy-MM-dd");
}

/** ISO date (yyyy-MM-dd) for the last day of the given month. */
export function monthEnd(d: Date = new Date()): string {
  return format(endOfMonth(d), "yyyy-MM-dd");
}

/** Inclusive [from, to] ISO range covering the month of `d`. */
export function monthRange(d: Date = new Date()): { from: string; to: string } {
  return { from: monthStart(d), to: monthEnd(d) };
}

/** "June 2026" */
export function monthLabel(d: Date = new Date()): string {
  return format(d, "MMMM yyyy");
}

/** Parse a yyyy-MM-dd string into a Date (local). Falls back to now. */
export function fromISO(value: string): Date {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : new Date();
}

/** "14 Jun" — compact day label for lists. */
export function shortDate(value: string): string {
  return format(fromISO(value), "d MMM");
}

/** "14 Jun 2026" — full day label. */
export function longDate(value: string): string {
  return format(fromISO(value), "d MMM yyyy");
}

/** Today as yyyy-MM-dd (for input defaults). */
export function today(): string {
  return format(new Date(), "yyyy-MM-dd");
}
