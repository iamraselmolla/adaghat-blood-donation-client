"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Droplet, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getNavForRole } from "@/lib/nav-config";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import * as React from "react";

export function MobileDrawer() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { role } = usePermissions();
  const items = getNavForRole(role);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] flex flex-col">
        <SheetHeader>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Droplet className="h-5 w-5 text-white" fill="white" />
            </div>
            <SheetTitle>LifeDrop</SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex-1 space-y-1 mt-4">
          {items.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <Button
          variant="outline"
          className="gap-2 mt-4"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </SheetContent>
    </Sheet>
  );
}
