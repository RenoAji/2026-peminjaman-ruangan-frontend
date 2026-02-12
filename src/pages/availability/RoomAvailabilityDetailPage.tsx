import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ruanganService } from "../../services/api";
import type { Ruangan, RoomAvailabilityDetail } from "../../types/api.types";
import AvailabilityTimeline from "./components/AvailabilityTimeline";

const RoomAvailabilityDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const roomId = parseInt(id ?? "0");

  const [room, setRoom] = useState<Ruangan | null>(null);
  const [availability, setAvailability] =
    useState<RoomAvailabilityDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Form state — default to current month range
  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-01`;
  const lastOfMonth = (() => {
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return `${last.getFullYear()}-${(last.getMonth() + 1).toString().padStart(2, "0")}-${last.getDate().toString().padStart(2, "0")}`;
  })();

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(lastOfMonth);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load room info
  useEffect(() => {
    if (!roomId) return;
    const load = async () => {
      try {
        setLoadingRoom(true);
        const data = await ruanganService.getRuanganById(roomId);
        setRoom(data);
      } catch {
        setError("Ruangan tidak ditemukan");
      } finally {
        setLoadingRoom(false);
      }
    };
    load();
  }, [roomId]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!startDate) errs.startDate = "Tanggal mulai wajib diisi";
    if (!endDate) errs.endDate = "Tanggal selesai wajib diisi";
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      errs.endDate = "Tanggal selesai harus setelah tanggal mulai";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await ruanganService.checkRuanganAvailability(
        roomId,
        startDate,
        endDate,
      );
      setAvailability(data);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(
        apiErr.response?.data?.message ||
          "Gagal mengecek ketersediaan ruangan.",
      );
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = () => {
    if (!room) return;
    navigate("/bookings/new", {
      state: {
        selectedRoom: room,
        tanggalPinjam: `${startDate}T08:00:00`,
        tanggalSelesai: `${endDate}T17:00:00`,
      },
    });
  };

  if (loadingRoom) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Memuat data ruangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
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
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {room ? room.namaRuangan : `Ruangan #${roomId}`}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {room
                  ? `${room.lokasi} · Kapasitas ${room.kapasitas} orang`
                  : "Cek ketersediaan ruangan"}
              </p>
            </div>
            {room && (
              <button
                onClick={handleBookRoom}
                className="hidden sm:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Ajukan Peminjaman
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              Pilih Rentang Waktu
            </h2>
          </div>
          <form onSubmit={handleSearch} className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (formErrors.startDate)
                      setFormErrors((p) => {
                        const c = { ...p };
                        delete c.startDate;
                        return c;
                      });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    formErrors.startDate
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                  disabled={loading}
                />
                {formErrors.startDate && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {formErrors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (formErrors.endDate)
                      setFormErrors((p) => {
                        const c = { ...p };
                        delete c.endDate;
                        return c;
                      });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    formErrors.endDate
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                  disabled={loading}
                />
                {formErrors.endDate && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {formErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Quick presets */}
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Pilihan Cepat
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  {
                    label: "Bulan Ini",
                    getRange: () => [firstOfMonth, lastOfMonth],
                  },
                  {
                    label: "Bulan Depan",
                    getRange: () => {
                      const next = new Date(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        1,
                      );
                      const last = new Date(
                        now.getFullYear(),
                        now.getMonth() + 2,
                        0,
                      );
                      const fmt = (d: Date) =>
                        `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                      return [fmt(next), fmt(last)];
                    },
                  },
                  {
                    label: "7 Hari ke Depan",
                    getRange: () => {
                      const today = new Date();
                      const week = new Date(
                        today.getTime() + 7 * 24 * 60 * 60 * 1000,
                      );
                      const fmt = (d: Date) =>
                        `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                      return [fmt(today), fmt(week)];
                    },
                  },
                  {
                    label: "30 Hari ke Depan",
                    getRange: () => {
                      const today = new Date();
                      const month = new Date(
                        today.getTime() + 30 * 24 * 60 * 60 * 1000,
                      );
                      const fmt = (d: Date) =>
                        `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                      return [fmt(today), fmt(month)];
                    },
                  },
                ].map(({ label, getRange }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const [s, e] = getRange();
                      setStartDate(s);
                      setEndDate(e);
                      setFormErrors({});
                    }}
                    className="px-3.5 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    disabled={loading}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Mengecek...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cek Ketersediaan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {!loading && error && hasSearched && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm text-slate-500">Mengecek ketersediaan...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && !error && availability && (
          <AvailabilityTimeline data={availability} />
        )}

        {/* Initial state */}
        {!loading && !hasSearched && !error && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-slate-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-500 mb-1">
              Pilih Rentang Waktu
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Pilih tanggal di atas untuk melihat jadwal ketersediaan ruangan
              ini.
            </p>
          </div>
        )}

        {/* Mobile book button */}
        {room && (
          <div className="sm:hidden mt-6">
            <button
              onClick={handleBookRoom}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Ajukan Peminjaman
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomAvailabilityDetailPage;
