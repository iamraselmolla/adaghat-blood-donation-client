"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavForRole } from "@/lib/nav-config";
import { usePermissions } from "@/hooks/use-permissions";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = usePermissions();
  const items = getNavForRole(role);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border/60 bg-card/40 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
          <Droplet className="h-5 w-5 text-white" fill="white" />
        </div>
        <span className="font-bold text-lg tracking-tight">LifeDrop</span>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative block">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Save a life today</p>
        <p>Every 2 seconds, someone needs blood. Keep donor records current.</p>
      </div>
    </aside>
  );
}
