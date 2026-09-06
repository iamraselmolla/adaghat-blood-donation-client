"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getNavForRole } from "@/lib/nav-config";
import { usePermissions } from "@/hooks/use-permissions";

export function BottomNav() {
  const pathname = usePathname();
  const { role } = usePermissions();
  const items = getNavForRole(role).slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/80 backdrop-blur-xl border-t border-border/60 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative flex-1">
              <div className="flex flex-col items-center gap-1 py-1.5">
                <div className="relative">
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute -inset-2 bg-primary/15 rounded-full"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <Icon className={cn("relative h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                </div>
                <span className={cn("text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
