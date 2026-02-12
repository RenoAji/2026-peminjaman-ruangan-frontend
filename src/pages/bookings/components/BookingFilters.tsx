import React from "react";
import type { StatusPeminjaman } from "../../../types/api.types";

interface BookingFiltersProps {
  activeFilter: StatusPeminjaman | "all";
  onFilter: (status: StatusPeminjaman | "all") => void;
  counts: Record<string, number>;
}

const filters: { value: StatusPeminjaman | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Completed", label: "Completed" },
];

const BookingFilters: React.FC<BookingFiltersProps> = ({
  activeFilter,
  onFilter,
  counts,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {filters.map((f) => {
        const isActive = activeFilter === f.value;
        const count =
          f.value === "all" ? counts["all"] : (counts[f.value] ?? 0);
        return (
          <button
            key={f.value}
            onClick={() => onFilter(f.value)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
              isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {f.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BookingFilters;
