import React from "react";
import type { Ruangan } from "../../../types/api.types";
import AvailabilityIndicator from "./AvailabilityIndicator";

interface RoomAvailabilityCardProps {
  room: Ruangan;
  onBook: (room: Ruangan) => void;
}

const RoomAvailabilityCard: React.FC<RoomAvailabilityCardProps> = ({
  room,
  onBook,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-slate-300 group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {room.namaRuangan}
          </h3>
          <AvailabilityIndicator available={true} />
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex items-center text-sm text-slate-500">
            <svg
              className="w-4 h-4 mr-2 shrink-0 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            {room.lokasi}
          </div>

          <div className="flex items-center text-sm text-slate-500">
            <svg
              className="w-4 h-4 mr-2 shrink-0 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            Kapasitas:{" "}
            <span className="font-medium text-slate-700 ml-1">
              {room.kapasitas}
            </span>{" "}
            orang
          </div>
        </div>

        <button
          onClick={() => onBook(room)}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm cursor-pointer"
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
          Ajukan Peminjaman
        </button>
      </div>
    </div>
  );
};

export default RoomAvailabilityCard;
