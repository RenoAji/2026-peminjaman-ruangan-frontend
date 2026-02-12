import React from "react";
import type { Peminjaman } from "../../../types/api.types";

interface BookingDetailModalProps {
  booking: Peminjaman;
  roomName?: string;
  onClose: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  roomName,
  onClose,
}) => {
  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColor: Record<string, string> = {
    Pending: "text-amber-600",
    Approved: "text-emerald-600",
    Rejected: "text-red-600",
    Completed: "text-blue-600",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Detail Peminjaman
          </h2>
          <button
            type="button"
            onClick={onClose}
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
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <DetailRow label="ID Peminjaman" value={`#${booking.peminjamanId}`} />
          <DetailRow label="Nama Peminjam" value={booking.namaPeminjam} />
          <DetailRow
            label="Ruangan"
            value={roomName ?? `ID: ${booking.ruanganId}`}
          />
          <DetailRow
            label="Mulai"
            value={formatDateTime(booking.tanggalPinjam)}
          />
          <DetailRow
            label="Selesai"
            value={formatDateTime(booking.tanggalSelesai)}
          />
          <DetailRow label="Keperluan" value={booking.keperluan} />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-slate-500">Status</span>
            <span
              className={`text-sm font-bold ${statusColor[booking.status] ?? "text-slate-700"}`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-sm text-slate-800 sm:text-right">{value}</span>
  </div>
);

export default BookingDetailModal;
