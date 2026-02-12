import apiClient from "./axios.config";
import type {
  Peminjaman,
  CreatePeminjamanRequest,
  UpdatePeminjamanRequest,
} from "../../types/api.types";

const normalizePeminjaman = (
  data: Peminjaman & Record<string, unknown>,
): Peminjaman => {
  const idCandidate =
    data.peminjamanId ??
    (data as { peminjamanID?: number }).peminjamanID ??
    (data as { id?: number }).id ??
    (data as { PeminjamanId?: number }).PeminjamanId;

  return {
    ...data,
    peminjamanId:
      typeof idCandidate === "number" ? idCandidate : data.peminjamanId,
  } as Peminjaman;
};

export const peminjamanService = {
  // GET /api/Peminjaman
  getAllPeminjaman: async (): Promise<Peminjaman[]> => {
    const response = await apiClient.get<Peminjaman[]>("/Peminjaman");
    return response.data.map((item) =>
      normalizePeminjaman(item as Peminjaman & Record<string, unknown>),
    );
  },

  // GET /api/Peminjaman/{id}
  getPeminjamanById: async (id: number): Promise<Peminjaman> => {
    const response = await apiClient.get<Peminjaman>(`/Peminjaman/${id}`);
    return normalizePeminjaman(
      response.data as Peminjaman & Record<string, unknown>,
    );
  },

  // POST /api/Peminjaman
  createPeminjaman: async (
    data: CreatePeminjamanRequest,
  ): Promise<Peminjaman> => {
    const response = await apiClient.post<Peminjaman>("/Peminjaman", data);
    return normalizePeminjaman(
      response.data as Peminjaman & Record<string, unknown>,
    );
  },

  // PUT /api/Peminjaman/{id}
  updatePeminjaman: async (
    id: number,
    data: UpdatePeminjamanRequest,
  ): Promise<void> => {
    await apiClient.put(`/Peminjaman/${id}`, data);
  },

  // DELETE /api/Peminjaman/{id}
  deletePeminjaman: async (id: number): Promise<void> => {
    await apiClient.delete(`/Peminjaman/${id}`);
  },
};
