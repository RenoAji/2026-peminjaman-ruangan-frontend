import apiClient from "./axios.config";
import type {
  Ruangan,
  CreateRuanganRequest,
  UpdateRuanganRequest,
  RoomAvailabilityDetail,
} from "../../types/api.types";

const normalizeRuangan = (data: Ruangan & Record<string, unknown>): Ruangan => {
  const idCandidate =
    data.ruanganId ??
    (data as { ruanganID?: number }).ruanganID ??
    (data as { id?: number }).id ??
    (data as { RuanganId?: number }).RuanganId;

  return {
    ...data,
    ruanganId: typeof idCandidate === "number" ? idCandidate : data.ruanganId,
  } as Ruangan;
};

export const ruanganService = {
  // GET /api/Ruangan
  getAllRuangan: async (): Promise<Ruangan[]> => {
    const response = await apiClient.get<Ruangan[]>("/Ruangan");
    return response.data.map((item) =>
      normalizeRuangan(item as Ruangan & Record<string, unknown>),
    );
  },

  // GET /api/Ruangan/{id}
  getRuanganById: async (id: number): Promise<Ruangan> => {
    const response = await apiClient.get<Ruangan>(`/Ruangan/${id}`);
    return normalizeRuangan(response.data as Ruangan & Record<string, unknown>);
  },

  // POST /api/Ruangan
  createRuangan: async (data: CreateRuanganRequest): Promise<Ruangan> => {
    const response = await apiClient.post<Ruangan>("/Ruangan", data);
    return normalizeRuangan(response.data as Ruangan & Record<string, unknown>);
  },

  // PUT /api/Ruangan/{id}
  updateRuangan: async (
    id: number,
    data: UpdateRuanganRequest,
  ): Promise<void> => {
    await apiClient.put(`/Ruangan/${id}`, data);
  },

  // DELETE /api/Ruangan/{id}
  deleteRuangan: async (id: number): Promise<void> => {
    await apiClient.delete(`/Ruangan/${id}`);
  },

  // GET /api/Ruangan/available
  getAvailableRuangan: async (
    startDate: string,
    endDate: string,
  ): Promise<Ruangan[]> => {
    const response = await apiClient.get<Ruangan[]>("/Ruangan/available", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // GET /api/Ruangan/{id}/availability
  checkRuanganAvailability: async (
    id: number,
    startDate: string,
    endDate: string,
  ): Promise<RoomAvailabilityDetail> => {
    const response = await apiClient.get<RoomAvailabilityDetail>(
      `/Ruangan/${id}/availability`,
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  },
};
