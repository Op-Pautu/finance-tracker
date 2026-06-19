import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  Landmark,
  ChartColumnBig,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** Primary app navigation, shared by the desktop sidebar and mobile sheet. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Budget", href: "/budget", icon: Wallet },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "EMIs", href: "/emis", icon: Landmark },
  { label: "Analytics", href: "/analytics", icon: ChartColumnBig },
];

export const SETTINGS_ITEM: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};
