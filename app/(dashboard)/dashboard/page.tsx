"use client";

import { StatsGrid } from "@/components/dashboard/stats-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentDonorsTable } from "@/components/dashboard/recent-donors-table";
import { BloodGroupChart } from "@/components/dashboard/blood-group-chart";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0] ?? "Admin"} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with donor activity today.</p>
      </div>

      <QuickActions />
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDonorsTable />
        </div>
        <BloodGroupChart />
      </div>
    </div>
  );
}
