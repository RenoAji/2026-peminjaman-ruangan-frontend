import React, { useState } from "react";
import type { StatusPeminjaman } from "../../../types/api.types";

interface StatusUpdateModalProps {
  currentStatus: StatusPeminjaman;
  bookingName: string;
  onConfirm: (newStatus: StatusPeminjaman) => void;
  onClose: () => void;
}

const statusOptions: {
  value: StatusPeminjaman;
  label: string;
  color: string;
}[] = [
  {
    value: "Pending",
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    value: "Approved",
    label: "Approved",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    value: "Rejected",
    label: "Rejected",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "Completed",
    label: "Completed",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  currentStatus,
  bookingName,
  onConfirm,
  onClose,
}) => {
  const [selected, setSelected] = useState<StatusPeminjaman>(currentStatus);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Ubah Status</h2>
          <p className="text-sm text-slate-500 mt-0.5">{bookingName}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-2">
          {statusOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selected === opt.value
                  ? opt.color + " ring-2 ring-offset-1 ring-blue-400"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => setSelected(opt.value)}
                className="accent-blue-600"
              />
              <span className="text-sm font-medium">{opt.label}</span>
              {opt.value === currentStatus && (
                <span className="text-xs text-slate-400 ml-auto">
                  (saat ini)
                </span>
              )}
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected === currentStatus}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
