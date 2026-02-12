import React from "react";

interface AvailabilityIndicatorProps {
  available: boolean;
}

const AvailabilityIndicator: React.FC<AvailabilityIndicatorProps> = ({
  available,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        available
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          available ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {available ? "Tersedia" : "Tidak Tersedia"}
    </span>
  );
};

export default AvailabilityIndicator;
