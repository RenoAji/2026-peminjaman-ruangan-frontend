import React, { useState, useEffect } from "react";
import { ruanganService } from "../../../services/api";
import type { Ruangan, CreateRuanganRequest } from "../../../types/api.types";

interface RoomFormModalProps {
  room: Ruangan | null; // null = create mode, object = edit mode
  onClose: (shouldRefresh: boolean) => void;
}

const RoomFormModal: React.FC<RoomFormModalProps> = ({ room, onClose }) => {
  const [formData, setFormData] = useState({
    namaRuangan: "",
    lokasi: "",
    kapasitas: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        namaRuangan: room.namaRuangan,
        lokasi: room.lokasi,
        kapasitas: room.kapasitas,
      });
    }
  }, [room]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaRuangan.trim()) {
      newErrors.namaRuangan = "Nama ruangan wajib diisi";
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi wajib diisi";
    }

    if (formData.kapasitas <= 0) {
      newErrors.kapasitas = "Kapasitas harus lebih dari 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      if (room) {
        // Update mode
        if (typeof room.ruanganId !== "number") {
          alert("ID ruangan tidak ditemukan. Tidak bisa update.");
          setSubmitting(false);
          return;
        }
        await ruanganService.updateRuangan(room.ruanganId, formData);
      } else {
        // Create mode
        await ruanganService.createRuangan(formData as CreateRuanganRequest);
      }
      onClose(true); // Close and refresh
    } catch (err) {
      alert("Gagal menyimpan data ruangan");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(false);
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 animate-[fadeIn_0.15s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {room ? "Edit Ruangan" : "Tambah Ruangan Baru"}
          </h2>
          <button
            type="button"
            onClick={() => onClose(false)}
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
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Ruangan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaRuangan}
                onChange={(e) =>
                  setFormData({ ...formData, namaRuangan: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${
                  errors.namaRuangan
                    ? "border-red-400 ring-1 ring-red-400"
                    : "border-slate-300"
                }`}
                placeholder="Contoh: Lab Komputer 1"
              />
              {errors.namaRuangan && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.namaRuangan}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={(e) =>
                  setFormData({ ...formData, lokasi: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${
                  errors.lokasi
                    ? "border-red-400 ring-1 ring-red-400"
                    : "border-slate-300"
                }`}
                placeholder="Contoh: Gedung A Lantai 2"
              />
              {errors.lokasi && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.lokasi}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Kapasitas (orang) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.kapasitas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kapasitas: parseInt(e.target.value) || 0,
                  })
                }
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${
                  errors.kapasitas
                    ? "border-red-400 ring-1 ring-red-400"
                    : "border-slate-300"
                }`}
                min="1"
                placeholder="Contoh: 30"
              />
              {errors.kapasitas && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.kapasitas}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Menyimpan...
                </span>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;
