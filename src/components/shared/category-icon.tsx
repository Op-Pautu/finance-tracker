import {
  Utensils,
  House,
  Bus,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Clapperboard,
  GraduationCap,
  HandHeart,
  Ellipsis,
  Wallet,
  Laptop,
  TrendingUp,
  CirclePlus,
  Tag,
  Target,
  PiggyBank,
  Plane,
  Car,
  Gift,
  Smartphone,
  Umbrella,
  Sparkles,
  Briefcase,
  Dumbbell,
  Home,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";
import { cn } from "@/lib/utils";

/** Maps the icon-name strings stored on categories to Lucide components. */
const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  house: House,
  bus: Bus,
  receipt: Receipt,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  clapperboard: Clapperboard,
  "graduation-cap": GraduationCap,
  "hand-heart": HandHeart,
  ellipsis: Ellipsis,
  wallet: Wallet,
  laptop: Laptop,
  "trending-up": TrendingUp,
  "circle-plus": CirclePlus,
  "piggy-bank": PiggyBank,
  target: Target,
  tag: Tag,
  // goal-friendly icons
  plane: Plane,
  car: Car,
  gift: Gift,
  smartphone: Smartphone,
  umbrella: Umbrella,
  sparkles: Sparkles,
  briefcase: Briefcase,
  dumbbell: Dumbbell,
  home: Home,
  heart: Heart,
};

export function resolveIcon(name?: string | null): LucideIcon {
  return (name && ICONS[name]) || Tag;
}

/**
 * Rounded swatch showing a category's icon tinted with its colour.
 * Colour is applied inline since category colours are user/seed data.
 */
export function CategoryIcon({
  icon,
  color,
  className,
  size = "default",
}: {
  icon?: string | null;
  color?: string | null;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const Icon = resolveIcon(icon);
  const tint = color ?? "#9AA0A6";
  const box = {
    sm: "size-7 [&_svg]:size-3.5",
    default: "size-9 [&_svg]:size-4",
    lg: "size-11 [&_svg]:size-5",
  }[size];

  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-lg",
        box,
        className,
      )}
      style={{ backgroundColor: `${tint}1f`, color: tint }}
    >
      {createElement(Icon)}
    </span>
  );
}
