"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, HeartPulse, Siren, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { adminService } from "@/lib/services/admin.service";
import { Card } from "@/components/ui/card";

export function StatsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-28 animate-pulse bg-muted/40" />
        ))}
      </div>
    );
  }

  const stats = data ?? { totalDonors: 0, eligibleDonors: 0, emergencyRequests: 0, activeAdmins: 0 };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Donors"
        value={stats.totalDonors.toLocaleString()}
        icon={Users}
        trend={stats.totalDonorsTrend}
        accent="primary"
        index={0}
      />
      <StatCard
        label="Eligible Donors"
        value={stats.eligibleDonors.toLocaleString()}
        icon={HeartPulse}
        trend={stats.eligibleDonorsTrend}
        accent="success"
        index={1}
      />
      <StatCard
        label="Emergency Requests"
        value={stats.emergencyRequests.toLocaleString()}
        icon={Siren}
        accent="warning"
        index={2}
      />
      <StatCard
        label="Active Admins"
        value={stats.activeAdmins.toLocaleString()}
        icon={ShieldCheck}
        accent="muted"
        index={3}
      />
    </div>
  );
}
