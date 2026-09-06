import { api } from "@/lib/axios";
import { DashboardStats, Role, StaffMember } from "@/types";

export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>("/admin/stats");
    return data;
  },

  listStaff: async (): Promise<StaffMember[]> => {
    const { data } = await api.get<StaffMember[]>("/admin/staff");
    return data;
  },

  updateStaffRole: async (id: string, role: Role): Promise<StaffMember> => {
    const { data } = await api.put<StaffMember>(`/admin/staff/${id}/role`, { role });
    return data;
  },

  toggleStaffStatus: async (id: string, status: "ACTIVE" | "DISABLED"): Promise<StaffMember> => {
    const { data } = await api.put<StaffMember>(`/admin/staff/${id}/status`, { status });
    return data;
  },
};
