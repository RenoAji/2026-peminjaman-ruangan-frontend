import React, { useState } from "react";

interface AvailabilitySearchFormProps {
  onSearch: (params: { startDate: string; endDate: string }) => void;
  loading: boolean;
}

const AvailabilitySearchForm: React.FC<AvailabilitySearchFormProps> = ({
  onSearch,
  loading,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = "Tanggal mulai wajib diisi";
    }

    if (!endDate) {
      newErrors.endDate = "Tanggal selesai wajib diisi";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        newErrors.endDate = "Tanggal selesai harus setelah tanggal mulai";
      }

      const now = new Date();
      if (start < now) {
        newErrors.startDate = "Tanggal mulai tidak boleh di masa lalu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Send local datetime with seconds appended (keep local time, no UTC shift)
    const formatForAPI = (dt: string) => (dt.length === 16 ? `${dt}:00` : dt);

    onSearch({
      startDate: formatForAPI(startDate),
      endDate: formatForAPI(endDate),
    });
  };

  const formatDateTimeLocal = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleQuickSelect = (hours: number) => {
    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    start.setMinutes(0, 0, 0); // Round to nearest hour
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

    setStartDate(formatDateTimeLocal(start));
    setEndDate(formatDateTimeLocal(end));
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">
          Cari Berdasarkan Waktu
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Pilih rentang waktu untuk melihat ruangan yang tersedia
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tanggal & Waktu Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (errors.startDate)
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.startDate;
                    return c;
                  });
              }}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                errors.startDate
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 bg-white"
              }`}
              disabled={loading}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1.5">{errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tanggal & Waktu Selesai <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (errors.endDate)
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.endDate;
                    return c;
                  });
              }}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                errors.endDate
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 bg-white"
              }`}
              disabled={loading}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1.5">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Pilihan Cepat
          </p>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "2 Jam", hours: 2 },
              { label: "4 Jam", hours: 4 },
              { label: "1 Hari", hours: 24 },
              { label: "2 Hari", hours: 48 },
            ].map(({ label, hours }) => (
              <button
                key={hours}
                type="button"
                onClick={() => handleQuickSelect(hours)}
                className="px-3.5 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Mencari...
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
              Cari Ruangan Tersedia
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AvailabilitySearchForm;
