import { api } from "@/lib/axios";
import { DonationRecord, PaginatedResponse } from "@/types";

export interface CreateDonationPayload {
  donorId: string;
  donationDate: string;
  location: string;
  recipientName: string;
  requestedByName?: string;
  requestedByPhone?: string;
  notes?: string;
}

export interface DonationFilters {
  page?: number;
  limit?: number;
  donorId?: string;
  search?: string;
}

export const donationService = {
  list: async (filters: DonationFilters = {}): Promise<PaginatedResponse<DonationRecord>> => {
    const { data } = await api.get<PaginatedResponse<DonationRecord>>("/donations", { params: filters });
    return data;
  },

  listByDonor: async (donorId: string): Promise<DonationRecord[]> => {
    const { data } = await api.get<DonationRecord[]>(`/donors/${donorId}/donations`);
    return data;
  },

  create: async (payload: CreateDonationPayload): Promise<DonationRecord> => {
    const { data } = await api.post<DonationRecord>("/donations", payload);
    return data;
  },
};
