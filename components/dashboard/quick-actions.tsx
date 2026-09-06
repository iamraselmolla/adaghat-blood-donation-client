"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Search, Siren, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";

const baseActions = [
  { label: "Find Donor", href: "/donors", icon: Search, roles: ["SUPER_ADMIN", "ADMIN", "MEMBER"] },
  { label: "Add Donor", href: "/donors?action=add", icon: UserPlus, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Emergency Request", href: "/requests?action=new", icon: Siren, roles: ["SUPER_ADMIN", "ADMIN", "MEMBER"] },
  { label: "Manage Roles", href: "/roles", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
];

export function QuickActions() {
  const { role } = usePermissions();
  const actions = baseActions.filter((a) => role && a.roles.includes(role));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={action.href}>
              <Card className="p-4 flex flex-col items-center justify-center gap-2 text-center hover:border-primary/50 cursor-pointer h-28">
                <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
