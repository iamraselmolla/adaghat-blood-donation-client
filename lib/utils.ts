import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function daysSince(date?: string | null) {
  if (!date) return Infinity;
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Blood donation eligibility rule: 120 days since last donation */
export function isEligibleByDate(lastDonationDate?: string | null) {
  return daysSince(lastDonationDate) >= 120;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function bloodGroupColor(bg: string) {
  const map: Record<string, string> = {
    "O+": "bg-red-500/15 text-red-600 dark:text-red-400",
    "O-": "bg-red-600/15 text-red-700 dark:text-red-300",
    "A+": "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    "A-": "bg-rose-600/15 text-rose-700 dark:text-rose-300",
    "B+": "bg-pink-500/15 text-pink-600 dark:text-pink-400",
    "B-": "bg-pink-600/15 text-pink-700 dark:text-pink-300",
    "AB+": "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400",
    "AB-": "bg-fuchsia-600/15 text-fuchsia-700 dark:text-fuchsia-300",
  };
  return map[bg] ?? "bg-muted text-muted-foreground";
}
