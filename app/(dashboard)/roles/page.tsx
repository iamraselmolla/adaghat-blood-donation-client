"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddStaffModal } from "@/components/roles/add-staff-modal";
import { StaffRow } from "@/components/roles/staff-row";
import { adminService } from "@/lib/services/admin.service";
import { usePermissions } from "@/hooks/use-permissions";

export default function RolesPage() {
  const { canManageStaff } = usePermissions();
  const router = useRouter();
  const [addOpen, setAddOpen] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: adminService.listStaff,
    enabled: canManageStaff,
  });

  React.useEffect(() => {
    if (!canManageStaff) router.replace("/dashboard");
  }, [canManageStaff, router]);

  if (!canManageStaff) return null;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Assign roles and manage staff account access.</p>
        </div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Admin / Member
        </Button>
      </div>

      <Card className="p-4 flex items-start gap-3 bg-primary/5 border-primary/20">
        <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Admins</span> can create and edit donor records and medical
          history. <span className="font-medium text-foreground">Members</span> have strictly read-only access.
        </p>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-5 py-3">Staff</th>
              <th className="text-left font-medium px-5 py-3">Role</th>
              <th className="text-left font-medium px-5 py-3">Joined</th>
              <th className="text-left font-medium px-5 py-3">Last Login</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  Loading staff...
                </td>
              </tr>
            )}
            {data?.map((staff, i) => (
              <StaffRow key={staff._id} staff={staff} index={i} />
            ))}
          </tbody>
        </table>
      </Card>

      <AddStaffModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
