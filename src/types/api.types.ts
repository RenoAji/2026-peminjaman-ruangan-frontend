export interface Ruangan {
  ruanganId: number;
  namaRuangan: string;
  lokasi: string;
  kapasitas: number;
}

export interface CreateRuanganRequest {
  namaRuangan: string;
  lokasi: string;
  kapasitas: number;
}

export interface UpdateRuanganRequest {
  namaRuangan?: string;
  lokasi?: string;
  kapasitas?: number;
}

export type StatusPeminjaman =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed";

export interface Peminjaman {
  peminjamanId: number;
  namaPeminjam: string;
  ruanganId: number;
  tanggalPinjam: string; // ISO 8601 format
  tanggalSelesai: string; // ISO 8601 format
  keperluan: string;
  status: StatusPeminjaman;
}

export interface CreatePeminjamanRequest {
  namaPeminjam: string;
  ruanganId: number;
  tanggalPinjam: string;
  tanggalSelesai: string;
  keperluan: string;
}

export interface UpdatePeminjamanRequest {
  namaPeminjam?: string;
  ruanganId?: number;
  tanggalPinjam?: string;
  tanggalSelesai?: string;
  keperluan?: string;
  status?: StatusPeminjaman;
}

// Room Availability Detail (GET /api/Ruangan/{id}/availability)
export interface BookedPeriod {
  id: number;
  namaPeminjam: string;
  tanggalPinjam: string;
  tanggalSelesai: string;
  status: StatusPeminjaman;
}

export interface AvailablePeriod {
  start: string;
  end: string;
}

export interface RoomAvailabilityDetail {
  ruanganId: number;
  namaRuangan: string;
  startDate: string;
  endDate: string;
  bookedPeriods: BookedPeriod[];
  availablePeriods: AvailablePeriod[];
}
