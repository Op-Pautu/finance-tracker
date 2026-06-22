import {
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  isValid,
  addMonths,
} from "date-fns";

const MONTH_KEY = /^\d{4}-\d{2}$/;

/** "2026-06" key for a month (used in URL filters). */
export function monthKey(d: Date = new Date()): string {
  return format(d, "yyyy-MM");
}

/** Parse a "2026-06" key into a Date (1st of month). Falls back to now. */
export function monthFromKey(key?: string | null): Date {
  if (key && MONTH_KEY.test(key)) {
    const parsed = parseISO(`${key}-01`);
    if (isValid(parsed)) return parsed;
  }
  return new Date();
}

/** Shift a month key by N months: shiftMonthKey("2026-06", -1) → "2026-05". */
export function shiftMonthKey(key: string, delta: number): string {
  return monthKey(addMonths(monthFromKey(key), delta));
}

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
