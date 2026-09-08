import { LayoutDashboard, Users, ShieldCheck, Settings, Activity, Droplets } from "lucide-react";
import { Role } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "MEMBER"],
  },
  {
    label: "Donors",
    href: "/donors",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN", "MEMBER"],
  },
  {
    label: "Donations",
    href: "/donations",
    icon: Droplets,
    roles: ["SUPER_ADMIN", "ADMIN", "MEMBER"],
  },
  {
    label: "Requests",
    href: "/requests",
    icon: Activity,
    roles: ["SUPER_ADMIN", "ADMIN", "MEMBER"],
  },
  {
    label: "Roles",
    href: "/roles",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN", "MEMBER"],
  },
];

export function getNavForRole(role: Role | null): NavItem[] {
  if (!role) return [];
  return navItems.filter((item) => item.roles.includes(role));
}
