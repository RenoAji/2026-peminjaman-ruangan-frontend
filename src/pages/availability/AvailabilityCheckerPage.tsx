import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ruanganService } from "../../services/api";
import type { Ruangan } from "../../types/api.types";
import AvailabilitySearchForm from "./components/AvailabilitySearchForm";
import AvailableRoomList from "./components/AvailableRoomList";

const AvailabilityCheckerPage: React.FC = () => {
  const navigate = useNavigate();
  const [availableRooms, setAvailableRooms] = useState<Ruangan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchParams, setLastSearchParams] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  const handleSearch = async (params: {
    startDate: string;
    endDate: string;
  }) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setLastSearchParams(params);

    try {
      const rooms = await ruanganService.getAvailableRuangan(
        params.startDate,
        params.endDate,
      );
      setAvailableRooms(rooms);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Gagal mengecek ketersediaan ruangan. Pastikan server API berjalan.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Cek Ketersediaan Ruangan
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Cari ruangan yang tersedia pada rentang waktu tertentu
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/rooms")}
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-lg font-medium text-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Ruangan
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-lg font-medium text-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Peminjaman
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AvailabilitySearchForm onSearch={handleSearch} loading={loading} />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm text-slate-500">
                Mencari ruangan tersedia...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
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

        {/* Results */}
        {!loading && hasSearched && !error && (
          <AvailableRoomList
            rooms={availableRooms}
            searchParams={lastSearchParams ?? undefined}
          />
        )}

        {/* Initial state — before search */}
        {!loading && !hasSearched && (
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-500 mb-1">
              Mulai Pencarian
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Masukkan rentang waktu di atas untuk melihat ruangan yang tersedia
              pada waktu tersebut.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AvailabilityCheckerPage;
