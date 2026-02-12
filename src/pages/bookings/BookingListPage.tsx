import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { peminjamanService, ruanganService } from "../../services/api";
import type {
  Peminjaman,
  Ruangan,
  StatusPeminjaman,
} from "../../types/api.types";
import BookingTable from "./components/BookingTable";
import BookingFilters from "./components/BookingFilters";
import BookingDetailModal from "./components/BookingDetailModal";
import StatusUpdateModal from "./components/StatusUpdateModal";

const BookingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Peminjaman[]>([]);
  const [rooms, setRooms] = useState<Ruangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusPeminjaman | "all">(
    "all",
  );

  // Modals
  const [detailBooking, setDetailBooking] = useState<Peminjaman | null>(null);
  const [statusBooking, setStatusBooking] = useState<Peminjaman | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingData, roomData] = await Promise.all([
        peminjamanService.getAllPeminjaman(),
        ruanganService.getAllRuangan(),
      ]);
      setBookings(bookingData);
      setRooms(roomData);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data peminjaman");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Room name lookup
  const roomNames = useMemo(() => {
    const map: Record<number, string> = {};
    rooms.forEach((r) => {
      map[r.ruanganId] = r.namaRuangan;
    });
    return map;
  }, [rooms]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  }, [bookings, activeFilter]);

  // Status counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: bookings.length };
    for (const b of bookings) {
      c[b.status] = (c[b.status] ?? 0) + 1;
    }
    return c;
  }, [bookings]);

  const handleEdit = (booking: Peminjaman) => {
    navigate(`/bookings/edit/${booking.peminjamanId}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus peminjaman ini?")) {
      try {
        await peminjamanService.deletePeminjaman(id);
        loadData();
      } catch (err) {
        alert("Gagal menghapus peminjaman");
        console.error(err);
      }
    }
  };

  const handleStatusUpdate = async (newStatus: StatusPeminjaman) => {
    if (!statusBooking) return;
    try {
      await peminjamanService.updatePeminjaman(statusBooking.peminjamanId, {
        status: newStatus,
      });
      setStatusBooking(null);
      loadData();
    } catch (err) {
      alert("Gagal mengubah status peminjaman");
      console.error(err);
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
                Manajemen Peminjaman
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Kelola peminjaman ruangan di sistem
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
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
                onClick={() => navigate("/availability")}
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
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Cek Ketersediaan
              </button>
              <button
                onClick={() => navigate("/bookings/new")}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm cursor-pointer"
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
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm text-slate-500">
                Memuat data peminjaman...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
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

        {!loading && !error && (
          <>
            <BookingFilters
              activeFilter={activeFilter}
              onFilter={setActiveFilter}
              counts={counts}
            />

            <div className="mb-4 text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {filteredBookings.length}
              </span>{" "}
              peminjaman
            </div>

            <BookingTable
              bookings={filteredBookings}
              roomNames={roomNames}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusUpdate={(b) => setStatusBooking(b)}
              onViewDetail={(b) => setDetailBooking(b)}
            />
          </>
        )}
      </main>

      {/* Detail Modal */}
      {detailBooking && (
        <BookingDetailModal
          booking={detailBooking}
          roomName={roomNames[detailBooking.ruanganId]}
          onClose={() => setDetailBooking(null)}
        />
      )}

      {/* Status Update Modal */}
      {statusBooking && (
        <StatusUpdateModal
          currentStatus={statusBooking.status}
          bookingName={statusBooking.namaPeminjam}
          onConfirm={handleStatusUpdate}
          onClose={() => setStatusBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingListPage;
