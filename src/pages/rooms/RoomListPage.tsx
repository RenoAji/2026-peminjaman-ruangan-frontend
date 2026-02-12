import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ruanganService } from "../../services/api";
import type { Ruangan } from "../../types/api.types";
import RoomTable from "./components/RoomTable";
import RoomFormModal from "./components/RoomFormModal";

const RoomListPage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Ruangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Ruangan | null>(null);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await ruanganService.getAllRuangan();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data ruangan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreate = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (room: Ruangan) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) {
      try {
        await ruanganService.deleteRuangan(id);
        loadRooms(); // Refresh list
      } catch (err) {
        alert("Gagal menghapus ruangan");
        console.error(err);
      }
    }
  };

  const handleCheckAvailability = (room: Ruangan) => {
    navigate(`/rooms/${room.ruanganId}/availability`);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    if (shouldRefresh) {
      loadRooms();
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
                Manajemen Ruangan
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Kelola data ruangan yang tersedia di sistem
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
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
              <button
                onClick={handleCreate}
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
                Tambah Ruangan
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
              <p className="text-sm text-slate-500">Memuat data ruangan...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
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
            <div className="mb-4 text-sm text-slate-500">
              Total:{" "}
              <span className="font-semibold text-slate-700">
                {rooms.length}
              </span>{" "}
              ruangan
            </div>
            <RoomTable
              rooms={rooms}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCheckAvailability={handleCheckAvailability}
            />
          </>
        )}
      </main>

      {isModalOpen && (
        <RoomFormModal room={selectedRoom} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default RoomListPage;
