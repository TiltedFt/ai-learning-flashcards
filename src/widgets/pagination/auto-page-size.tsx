"use client";
import { useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

const CONSTANTS = {
  TOP: 160, // margin top
  PAGER: 56, // pagination panel
  THEAD: 48,
  ROW: 52,
  MIN_AVAILABLE: 200,
  MIN_ROWS: 1,
} as const;

export default function AutoPageSizeOnce({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const ran = useRef(false);

  const calculateOptimalRows = useCallback((viewportHeight: number): number => {
    const available = Math.max(
      CONSTANTS.MIN_AVAILABLE,
      viewportHeight - CONSTANTS.TOP - CONSTANTS.PAGER
    );
    return Math.max(
      CONSTANTS.MIN_ROWS,
      Math.floor((available - CONSTANTS.THEAD) / CONSTANTS.ROW)
    );
  }, []);

  const optimalRows = useMemo(
    () => calculateOptimalRows(typeof window !== "undefined" ? window.innerHeight : 800),
    [calculateOptimalRows]
  );

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (optimalRows && optimalRows !== pageSize) {
      router.replace(`/books?page=${page}&pageSize=${optimalRows}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // только один раз

  return null;
}
