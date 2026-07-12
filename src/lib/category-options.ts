/** Curated colour + icon choices for categories (used by the category form). */

export const CATEGORY_COLORS = [
  "#0E8C6E", // jade
  "#E0962F", // apricot
  "#DD6B4D", // terracotta
  "#7C6BA0", // plum
  "#4F8DD0", // blue
  "#3FA796", // teal
  "#C0506B", // rose
  "#5B6472", // slate
  "#A67C52", // brown
  "#9AA0A6", // grey
] as const;

export const CATEGORY_ICONS = [
  "tag",
  "utensils",
  "house",
  "bus",
  "receipt",
  "shopping-bag",
  "heart-pulse",
  "clapperboard",
  "graduation-cap",
  "hand-heart",
  "wallet",
  "laptop",
  "trending-up",
  "circle-plus",
  "piggy-bank",
  "ellipsis",
] as const;

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLORS[0];
export const DEFAULT_CATEGORY_ICON = CATEGORY_ICONS[0];
