import React from "react";
import type {
  BookedPeriod,
  AvailablePeriod,
  RoomAvailabilityDetail,
} from "../../../types/api.types";

interface AvailabilityTimelineProps {
  data: RoomAvailabilityDetail;
}

/** Format "2026-03-01T08:00:00" → "1 Mar 2026, 08:00" */
const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  const day = d.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hh}:${mm}`;
};

/** Format just the time portion "08:00" */
const formatTime = (iso: string): string => {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

/** Format a short date "1 Mar" */
const formatShortDate = (iso: string): string => {
  const d = new Date(iso);
  const day = d.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${day} ${months[d.getMonth()]}`;
};

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 ring-amber-500/20",
  Approved: "bg-blue-100 text-blue-800 ring-blue-500/20",
  Rejected: "bg-red-100 text-red-800 ring-red-500/20",
  Completed: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

const AvailabilityTimeline: React.FC<AvailabilityTimelineProps> = ({
  data,
}) => {
  const { bookedPeriods, availablePeriods } = data;

  // Build a combined & sorted timeline
  type TimelineEntry =
    | { type: "booked"; data: BookedPeriod; start: number; end: number }
    | { type: "available"; data: AvailablePeriod; start: number; end: number };

  const entries: TimelineEntry[] = [
    ...bookedPeriods.map((b) => ({
      type: "booked" as const,
      data: b,
      start: new Date(b.tanggalPinjam).getTime(),
      end: new Date(b.tanggalSelesai).getTime(),
    })),
    ...availablePeriods.map((a) => ({
      type: "available" as const,
      data: a,
      start: new Date(a.start).getTime(),
      end: new Date(a.end).getTime(),
    })),
  ].sort((a, b) => a.start - b.start);

  const hasBookings = bookedPeriods.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {bookedPeriods.length}
              </p>
              <p className="text-xs text-slate-500">Peminjaman Terjadwal</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {availablePeriods.length}
              </p>
              <p className="text-xs text-slate-500">Slot Tersedia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Timeline Ketersediaan
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Tersedia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              Terpakai
            </span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            Tidak ada data untuk ditampilkan.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {entries.map((entry, idx) => {
              if (entry.type === "available") {
                const a = entry.data as AvailablePeriod;
                const sameDay =
                  formatShortDate(a.start) === formatShortDate(a.end);
                return (
                  <div
                    key={`avail-${idx}`}
                    className="flex items-stretch hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Left indicator */}
                    <div className="w-1 bg-emerald-400 shrink-0" />
                    <div className="flex-1 px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 uppercase tracking-wider">
                          Tersedia
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">
                        {sameDay ? (
                          <>
                            {formatShortDate(a.start)}{" "}
                            <span className="text-slate-400">•</span>{" "}
                            {formatTime(a.start)} – {formatTime(a.end)}
                          </>
                        ) : (
                          <>
                            {formatDateTime(a.start)}{" "}
                            <span className="text-slate-400">–</span>{" "}
                            {formatDateTime(a.end)}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                );
              }

              // Booked
              const b = entry.data as BookedPeriod;
              const sameDay =
                formatShortDate(b.tanggalPinjam) ===
                formatShortDate(b.tanggalSelesai);
              return (
                <div
                  key={`booked-${b.id}`}
                  className="flex items-stretch hover:bg-slate-50/50 transition-colors"
                >
                  <div className="w-1 bg-red-400 shrink-0" />
                  <div className="flex-1 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 ring-1 ring-red-500/20 uppercase tracking-wider">
                        Terpakai
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${statusColors[b.status] || "bg-slate-100 text-slate-700 ring-slate-500/20"}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-1">
                      {sameDay ? (
                        <>
                          {formatShortDate(b.tanggalPinjam)}{" "}
                          <span className="text-slate-400">•</span>{" "}
                          {formatTime(b.tanggalPinjam)} –{" "}
                          {formatTime(b.tanggalSelesai)}
                        </>
                      ) : (
                        <>
                          {formatDateTime(b.tanggalPinjam)}{" "}
                          <span className="text-slate-400">–</span>{" "}
                          {formatDateTime(b.tanggalSelesai)}
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-600">
                        {b.namaPeminjam}
                      </span>
                      {" · "}ID #{b.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full availability message */}
      {!hasBookings && availablePeriods.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
          <svg
            className="mx-auto h-10 w-10 text-emerald-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h4 className="text-sm font-semibold text-emerald-800 mb-1">
            Ruangan Sepenuhnya Tersedia
          </h4>
          <p className="text-xs text-emerald-700">
            Tidak ada peminjaman pada rentang waktu ini. Ruangan bebas digunakan
            kapan saja.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityTimeline;
