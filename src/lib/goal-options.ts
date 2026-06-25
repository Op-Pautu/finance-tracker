/** Curated colour + icon choices for goals (used by the goal form). */

export const GOAL_COLORS = [
  "#0E8C6E", // jade
  "#E0962F", // apricot
  "#DD6B4D", // terracotta
  "#7C6BA0", // plum
  "#4F8DD0", // blue
  "#3FA796", // teal
  "#C0506B", // rose
  "#5B6472", // slate
] as const;

export const GOAL_ICONS = [
  "target",
  "piggy-bank",
  "plane",
  "car",
  "home",
  "graduation-cap",
  "smartphone",
  "laptop",
  "gift",
  "umbrella",
  "heart",
  "sparkles",
  "briefcase",
  "dumbbell",
] as const;

export const DEFAULT_GOAL_COLOR = GOAL_COLORS[1];
export const DEFAULT_GOAL_ICON = GOAL_ICONS[0];
