"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminService } from "@/lib/services/admin.service";
import { getInitials, formatDate } from "@/lib/utils";
import { StaffMember } from "@/types";
import { motion } from "framer-motion";

export function StaffRow({ staff, index }: { staff: StaffMember; index: number }) {
  const queryClient = useQueryClient();

  const roleMutation = useMutation({
    mutationFn: (role: "ADMIN" | "MEMBER") => adminService.updateStaffRole(staff._id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });

  const statusMutation = useMutation({
    mutationFn: (status: "ACTIVE" | "DISABLED") => adminService.toggleStaffStatus(staff._id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className="hover:bg-accent/30 transition-colors"
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{staff.name}</p>
            <p className="text-xs text-muted-foreground">{staff.identifier}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        {staff.role === "SUPER_ADMIN" ? (
          <Badge>Super Admin</Badge>
        ) : (
          <Select value={staff.role} onValueChange={(v) => roleMutation.mutate(v as "ADMIN" | "MEMBER")}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
            </SelectContent>
          </Select>
        )}
      </td>
      <td className="px-5 py-3 text-sm text-muted-foreground">{formatDate(staff.createdAt)}</td>
      <td className="px-5 py-3 text-sm text-muted-foreground">{formatDate(staff.lastLoginAt)}</td>
      <td className="px-5 py-3">
        {staff.role !== "SUPER_ADMIN" && (
          <div className="flex items-center gap-2">
            <Switch
              checked={staff.status === "ACTIVE"}
              onCheckedChange={(checked) => statusMutation.mutate(checked ? "ACTIVE" : "DISABLED")}
            />
            <span className="text-xs text-muted-foreground">{staff.status === "ACTIVE" ? "Active" : "Disabled"}</span>
          </div>
        )}
      </td>
    </motion.tr>
  );
}
