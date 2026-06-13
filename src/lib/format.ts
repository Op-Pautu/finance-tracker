/**
 * Money + date formatting helpers.
 * All currency in the app renders through these so the INR display
 * (₹, Indian digit grouping) and tabular numerals stay consistent.
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrFormatterPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrPlain = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** ₹1,23,456 — rupees only (default). Pass withPaise for ₹1,23,456.78 */
export function formatINR(amount: number, withPaise = false): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return withPaise ? inrFormatterPaise.format(value) : inrFormatter.format(value);
}

/** 1,23,456 — number with Indian grouping, no symbol (for inputs/labels) */
export function formatNumberIN(amount: number): string {
  return inrPlain.format(Number.isFinite(amount) ? amount : 0);
}

/** Compact form for tight cards: ₹1.2L, ₹54K, ₹3.4Cr */
export function formatINRCompact(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2).replace(/\.00$/, "")}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(2).replace(/\.00$/, "")}L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${sign}₹${abs}`;
}

/** Signed display for transactions: +₹3,200 / −₹640 */
export function formatSigned(amount: number, kind: "income" | "expense"): string {
  const sign = kind === "income" ? "+" : "−";
  return `${sign}${formatINR(Math.abs(amount))}`;
}

/** 42% — clamped 0–100, rounded */
export function formatPercent(value: number): string {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return `${Math.round(clamped)}%`;
}
