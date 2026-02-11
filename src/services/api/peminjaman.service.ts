import apiClient from "./axios.config";
import type {
  Peminjaman,
  CreatePeminjamanRequest,
  UpdatePeminjamanRequest,
} from "../../types/api.types";

export const peminjamanService = {
  // GET /api/Peminjaman
  getAllPeminjaman: async (): Promise<Peminjaman[]> => {
    const response = await apiClient.get<Peminjaman[]>("/api/Peminjaman");
    return response.data;
  },

  // GET /api/Peminjaman/{id}
  getPeminjamanById: async (id: number): Promise<Peminjaman> => {
    const response = await apiClient.get<Peminjaman>(`/api/Peminjaman/${id}`);
    return response.data;
  },

  // POST /api/Peminjaman
  createPeminjaman: async (
    data: CreatePeminjamanRequest,
  ): Promise<Peminjaman> => {
    const response = await apiClient.post<Peminjaman>("/api/Peminjaman", data);
    return response.data;
  },

  // PUT /api/Peminjaman/{id}
  updatePeminjaman: async (
    id: number,
    data: UpdatePeminjamanRequest,
  ): Promise<void> => {
    await apiClient.put(`/api/Peminjaman/${id}`, data);
  },

  // DELETE /api/Peminjaman/{id}
  deletePeminjaman: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Peminjaman/${id}`);
  },
};
