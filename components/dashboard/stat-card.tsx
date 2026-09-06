"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  accent?: "primary" | "success" | "warning" | "muted";
  index?: number;
}

const accentMap = {
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  muted: "bg-muted text-muted-foreground",
};

export function StatCard({ label, value, icon: Icon, trend, accent = "primary", index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-bold tracking-tight mt-2">{value}</p>
          </div>
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-3 text-xs font-medium">
            {trend >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            <span className={trend >= 0 ? "text-success" : "text-destructive"}>{Math.abs(trend)}%</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
