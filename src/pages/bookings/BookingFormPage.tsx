import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { peminjamanService, ruanganService } from "../../services/api";
import type { Ruangan, CreatePeminjamanRequest } from "../../types/api.types";

// Helper to convert datetime string (e.g. "2026-02-15T09:00:00") to datetime-local input format
const formatDateTimeLocalStatic = (dateStr: string): string => {
  // Already in datetime-local format
  if (dateStr.length === 16) return dateStr;
  // Trim seconds/timezone to get "YYYY-MM-DDTHH:mm"
  if (dateStr.length >= 16) return dateStr.slice(0, 16);
  return dateStr;
};

const BookingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = !!id;

  // Pre-selected room & dates from availability checker
  const preSelectedRoom = (location.state as { selectedRoom?: Ruangan })
    ?.selectedRoom;
  const preSelectedStart = (location.state as { tanggalPinjam?: string })
    ?.tanggalPinjam;
  const preSelectedEnd = (location.state as { tanggalSelesai?: string })
    ?.tanggalSelesai;

  const [rooms, setRooms] = useState<Ruangan[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [formData, setFormData] = useState({
    namaPeminjam: "",
    ruanganId: preSelectedRoom?.ruanganId ?? 0,
    tanggalPinjam: preSelectedStart
      ? formatDateTimeLocalStatic(preSelectedStart)
      : "",
    tanggalSelesai: preSelectedEnd
      ? formatDateTimeLocalStatic(preSelectedEnd)
      : "",
    keperluan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);
        const data = await ruanganService.getAllRuangan();
        setRooms(data);
      } catch (err) {
        console.error("Gagal memuat data ruangan", err);
      } finally {
        setLoadingRooms(false);
      }
    };
    loadRooms();

    if (isEditMode && id) {
      const loadBooking = async () => {
        try {
          setLoadingBooking(true);
          const booking = await peminjamanService.getPeminjamanById(
            parseInt(id),
          );
          setFormData({
            namaPeminjam: booking.namaPeminjam,
            ruanganId: booking.ruanganId,
            tanggalPinjam: formatDateTimeForInput(booking.tanggalPinjam),
            tanggalSelesai: formatDateTimeForInput(booking.tanggalSelesai),
            keperluan: booking.keperluan,
          });
        } catch (err) {
          alert("Gagal memuat data peminjaman");
          navigate("/bookings");
        } finally {
          setLoadingBooking(false);
        }
      };
      loadBooking();
    }
  }, [id, isEditMode, navigate]);

  const formatDateTimeForInput = (isoString: string): string => {
    // If already in local format (YYYY-MM-DDTHH:mm), use as-is
    if (isoString.length === 16) return isoString;
    // Convert UTC ISO string to local datetime for the input
    const date = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatDateTimeForAPI = (localDateTime: string): string => {
    // Send as-is with seconds appended — keeps local time intact
    // e.g. "2026-02-15T15:00" → "2026-02-15T15:00:00"
    return localDateTime.length === 16 ? `${localDateTime}:00` : localDateTime;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaPeminjam.trim()) {
      newErrors.namaPeminjam = "Nama peminjam wajib diisi";
    }

    if (formData.ruanganId === 0) {
      newErrors.ruanganId = "Pilih ruangan";
    }

    if (!formData.tanggalPinjam) {
      newErrors.tanggalPinjam = "Tanggal mulai wajib diisi";
    }

    if (!formData.tanggalSelesai) {
      newErrors.tanggalSelesai = "Tanggal selesai wajib diisi";
    }

    if (formData.tanggalPinjam && formData.tanggalSelesai) {
      const start = new Date(formData.tanggalPinjam);
      const end = new Date(formData.tanggalSelesai);
      if (end <= start) {
        newErrors.tanggalSelesai =
          "Tanggal selesai harus setelah tanggal mulai";
      }
    }

    if (!formData.keperluan.trim()) {
      newErrors.keperluan = "Keperluan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tanggalPinjam: formatDateTimeForAPI(formData.tanggalPinjam),
        tanggalSelesai: formatDateTimeForAPI(formData.tanggalSelesai),
      };

      if (isEditMode && id) {
        await peminjamanService.updatePeminjaman(parseInt(id), payload);
      } else {
        await peminjamanService.createPeminjaman(
          payload as CreatePeminjamanRequest,
        );
      }

      navigate("/bookings");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Gagal menyimpan peminjaman");
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  if (loadingBooking) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Memuat data peminjaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/bookings")}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {isEditMode ? "Edit Peminjaman" : "Ajukan Peminjaman Baru"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isEditMode
                  ? "Ubah detail peminjaman ruangan"
                  : "Isi formulir untuk mengajukan peminjaman ruangan"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 space-y-5">
            {/* Nama Peminjam */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Peminjam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaPeminjam}
                onChange={(e) => handleChange("namaPeminjam", e.target.value)}
                placeholder="Nama lengkap atau organisasi"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.namaPeminjam
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 bg-white"
                }`}
              />
              {errors.namaPeminjam && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.namaPeminjam}
                </p>
              )}
            </div>

            {/* Ruangan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Pilih Ruangan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ruanganId}
                onChange={(e) =>
                  handleChange("ruanganId", parseInt(e.target.value))
                }
                disabled={loadingRooms}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.ruanganId
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 bg-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value={0}>
                  {loadingRooms ? "Memuat ruangan..." : "-- Pilih Ruangan --"}
                </option>
                {rooms.map((room) => (
                  <option key={room.ruanganId} value={room.ruanganId}>
                    {room.namaRuangan} — {room.lokasi} (Kapasitas:{" "}
                    {room.kapasitas})
                  </option>
                ))}
              </select>
              {errors.ruanganId && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.ruanganId}
                </p>
              )}
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tanggal Pinjam */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tanggal & Waktu Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.tanggalPinjam}
                  onChange={(e) =>
                    handleChange("tanggalPinjam", e.target.value)
                  }
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.tanggalPinjam
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                />
                {errors.tanggalPinjam && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.tanggalPinjam}
                  </p>
                )}
              </div>

              {/* Tanggal Selesai */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tanggal & Waktu Selesai{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.tanggalSelesai}
                  onChange={(e) =>
                    handleChange("tanggalSelesai", e.target.value)
                  }
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.tanggalSelesai
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                />
                {errors.tanggalSelesai && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.tanggalSelesai}
                  </p>
                )}
              </div>
            </div>

            {/* Keperluan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Keperluan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.keperluan}
                onChange={(e) => handleChange("keperluan", e.target.value)}
                placeholder="Jelaskan keperluan peminjaman ruangan"
                rows={4}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${
                  errors.keperluan
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 bg-white"
                }`}
              />
              {errors.keperluan && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.keperluan}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-medium bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {submitting && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {submitting
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Perubahan"
                  : "Ajukan Peminjaman"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BookingFormPage;
