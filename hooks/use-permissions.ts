import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/types";

export interface Permissions {
  role: Role | null;
  canCreateDonor: boolean;
  canEditDonor: boolean;
  canDeleteDonor: boolean;
  canEditMedicalRecord: boolean;
  canManageStaff: boolean;
  isReadOnly: boolean;
}

export function usePermissions(): Permissions {
  const role = useAuthStore((s) => s.user?.role) ?? null;

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN" || isSuperAdmin;
  const isMember = role === "MEMBER";

  return {
    role,
    canCreateDonor: isAdmin,
    canEditDonor: isAdmin,
    canDeleteDonor: isSuperAdmin,
    canEditMedicalRecord: isAdmin,
    canManageStaff: isSuperAdmin,
    isReadOnly: isMember,
  };
}
