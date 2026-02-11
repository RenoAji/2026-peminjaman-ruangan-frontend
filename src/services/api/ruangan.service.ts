import apiClient from "./axios.config";
import type {
  Ruangan,
  CreateRuanganRequest,
  UpdateRuanganRequest,
} from "../../types/api.types";

export const ruanganService = {
  // GET /api/Ruangan
  getAllRuangan: async (): Promise<Ruangan[]> => {
    const response = await apiClient.get<Ruangan[]>("/api/Ruangan");
    return response.data;
  },

  // GET /api/Ruangan/{id}
  getRuanganById: async (id: number): Promise<Ruangan> => {
    const response = await apiClient.get<Ruangan>(`/api/Ruangan/${id}`);
    return response.data;
  },

  // POST /api/Ruangan
  createRuangan: async (data: CreateRuanganRequest): Promise<Ruangan> => {
    const response = await apiClient.post<Ruangan>("/api/Ruangan", data);
    return response.data;
  },

  // PUT /api/Ruangan/{id}
  updateRuangan: async (
    id: number,
    data: UpdateRuanganRequest,
  ): Promise<void> => {
    await apiClient.put(`/api/Ruangan/${id}`, data);
  },

  // DELETE /api/Ruangan/{id}
  deleteRuangan: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Ruangan/${id}`);
  },

  // GET /api/Ruangan/available
  getAvailableRuangan: async (
    startDate: string,
    endDate: string,
  ): Promise<Ruangan[]> => {
    const response = await apiClient.get<Ruangan[]>("/api/Ruangan/available", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // GET /api/Ruangan/{id}/availability
  checkRuanganAvailability: async (
    id: number,
    startDate: string,
    endDate: string,
  ): Promise<boolean> => {
    const response = await apiClient.get<boolean>(
      `/api/Ruangan/${id}/availability`,
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  },
};
