import React from "react";
import { useNavigate } from "react-router-dom";
import type { Ruangan } from "../../../types/api.types";
import RoomAvailabilityCard from "./RoomAvailabilityCard";

interface AvailableRoomListProps {
  rooms: Ruangan[];
  searchParams?: { startDate: string; endDate: string };
}

const AvailableRoomList: React.FC<AvailableRoomListProps> = ({
  rooms,
  searchParams,
}) => {
  const navigate = useNavigate();

  const handleBookRoom = (room: Ruangan) => {
    // Navigate to booking form with pre-filled room and date data
    navigate("/bookings/new", {
      state: {
        selectedRoom: room,
        ...(searchParams && {
          tanggalPinjam: searchParams.startDate,
          tanggalSelesai: searchParams.endDate,
        }),
      },
    });
  };

  if (rooms.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-amber-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-amber-800 mb-2">
          Tidak Ada Ruangan Tersedia
        </h3>
        <p className="text-sm text-amber-700 max-w-md mx-auto">
          Tidak ada ruangan yang tersedia pada rentang waktu yang dipilih. Coba
          pilih tanggal atau waktu lain.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700">
          <span className="text-sm font-bold">{rooms.length}</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          Ruangan Tersedia
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomAvailabilityCard
            key={room.ruanganId}
            room={room}
            onBook={handleBookRoom}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailableRoomList;
