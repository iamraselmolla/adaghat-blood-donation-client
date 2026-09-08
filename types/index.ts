export type Role = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface AuthUser {
  id: string;
  name: string;
  identifier: string; // email or phone
  role: Role;
  status: "ACTIVE" | "DISABLED";
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Address {
  division: string;
  district: string;
  upazila: string;
  addressLine?: string;
  coordinates?: { lat: number; lng: number };
}

export interface MedicalRecord {
  _id?: string;
  donorId: string;
  weightKg: number;
  bloodPressure: string; // e.g. "120/80"
  hemoglobin: number;
  conditions: {
    diabetes: boolean;
    hepatitis: boolean;
    hiv: boolean;
    heartDisease: boolean;
    recentSurgery: boolean;
    recentTattoo: boolean;
  };
  currentMedications?: string;
  eligibilityStatus: "ELIGIBLE" | "INELIGIBLE" | "PENDING_REVIEW";
  updatedBy?: string;
  updatedAt?: string;
}

export interface Donor {
  _id: string;
  userId?: string;
  name: string;
  phone: string;
  email?: string;
  bloodGroup: BloodGroup;
  gender: "MALE" | "FEMALE" | "OTHER";
  dob: string;
  address: Address;
  lastDonationDate?: string | null;
  availability: boolean;
  medicalRecord?: MedicalRecord;
  createdAt: string;
  avatarUrl?: string;
}

export interface DonationRecord {
  _id: string;
  donorId: string;
  donorName?: string; // populated for list views
  donorBloodGroup?: BloodGroup;
  donationDate: string;
  location: string;
  recipientName: string;
  requestedByName?: string;
  requestedByPhone?: string;
  notes?: string;
  recordedBy?: string; // staff user id
  recordedByName?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalDonors: number;
  eligibleDonors: number;
  emergencyRequests: number;
  activeAdmins: number;
  totalDonorsTrend?: number;
  eligibleDonorsTrend?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DonorFilters {
  search?: string;
  bloodGroup?: BloodGroup | "ALL";
  division?: string;
  district?: string;
  upazila?: string;
  availability?: "ALL" | "AVAILABLE" | "UNAVAILABLE";
  eligibility?: "ALL" | "ELIGIBLE" | "INELIGIBLE";
  page?: number;
  limit?: number;
}

export interface StaffMember {
  _id: string;
  name: string;
  identifier: string;
  role: Role;
  status: "ACTIVE" | "DISABLED";
  createdAt: string;
  lastLoginAt?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}
