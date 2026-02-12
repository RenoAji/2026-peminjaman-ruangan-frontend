import React from "react";
import type { Peminjaman } from "../../../types/api.types";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingTableProps {
  bookings: Peminjaman[];
  roomNames: Record<number, string>;
  onEdit: (booking: Peminjaman) => void;
  onDelete: (id: number) => void;
  onStatusUpdate: (booking: Peminjaman) => void;
  onViewDetail: (booking: Peminjaman) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  roomNames,
  onEdit,
  onDelete,
  onStatusUpdate,
  onViewDetail,
}) => {
  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-slate-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-slate-500 font-medium">
            Tidak ada data peminjaman
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Klik "Ajukan Peminjaman" untuk membuat peminjaman baru
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Peminjam
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ruangan
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mulai
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Selesai
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr
                key={b.peminjamanId}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                  #{b.peminjamanId}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                  {b.namaPeminjam}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                  {roomNames[b.ruanganId] ?? `ID: ${b.ruanganId}`}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                  {formatDateTime(b.tanggalPinjam)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">
                  {formatDateTime(b.tanggalSelesai)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <BookingStatusBadge status={b.status} />
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewDetail(b)}
                      title="Detail"
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onStatusUpdate(b)}
                      title="Ubah Status"
                      className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(b)}
                      title="Edit"
                      className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(b.peminjamanId)}
                      title="Hapus"
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden flex flex-col gap-3">
        {bookings.map((b) => (
          <div
            key={b.peminjamanId}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {b.namaPeminjam}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  #{b.peminjamanId}
                </p>
              </div>
              <BookingStatusBadge status={b.status} />
            </div>

            <div className="text-sm text-slate-600 space-y-1 mb-3">
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {roomNames[b.ruanganId] ?? `Ruangan ID: ${b.ruanganId}`}
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatDateTime(b.tanggalPinjam)} —{" "}
                {formatDateTime(b.tanggalSelesai)}
              </div>
              <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                {b.keperluan}
              </p>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => onViewDetail(b)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Detail
              </button>
              <button
                onClick={() => onStatusUpdate(b)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Status
              </button>
              <button
                onClick={() => onEdit(b)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(b.peminjamanId)}
                className="inline-flex items-center justify-center p-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookingTable;
