import { useState, useCallback } from "react";
import { ruanganService } from "../../../services/api";
import type { RoomAvailabilityDetail } from "../../../types/api.types";

export const useRoomAvailability = (roomId: number) => {
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] =
    useState<RoomAvailabilityDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(
    async (startDate: string, endDate: string) => {
      setIsChecking(true);
      setError(null);
      try {
        const data = await ruanganService.checkRuanganAvailability(
          roomId,
          startDate,
          endDate,
        );
        setAvailability(data);
        return data;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(
          e.response?.data?.message || "Gagal mengecek ketersediaan ruangan",
        );
        setAvailability(null);
        return null;
      } finally {
        setIsChecking(false);
      }
    },
    [roomId],
  );

  const reset = useCallback(() => {
    setAvailability(null);
    setError(null);
  }, []);

  return { availability, isChecking, error, checkAvailability, reset };
};
