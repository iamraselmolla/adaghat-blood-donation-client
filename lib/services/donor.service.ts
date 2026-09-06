import { api } from "@/lib/axios";
import { Donor, DonorFilters, MedicalRecord, PaginatedResponse } from "@/types";

export const donorService = {
  list: async (filters: DonorFilters): Promise<PaginatedResponse<Donor>> => {
    const { data } = await api.get<PaginatedResponse<Donor>>("/donors", { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Donor> => {
    const { data } = await api.get<Donor>(`/donors/${id}`);
    return data;
  },

  create: async (payload: Partial<Donor>): Promise<Donor> => {
    const { data } = await api.post<Donor>("/donors", payload);
    return data;
  },

  update: async (id: string, payload: Partial<Donor>): Promise<Donor> => {
    const { data } = await api.put<Donor>(`/donors/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/donors/${id}`);
  },

  updateMedicalRecord: async (id: string, payload: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    const { data } = await api.put<MedicalRecord>(`/donors/${id}/medical-record`, payload);
    return data;
  },
};
