"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AutoPageSizeOnce({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const vh = window.innerHeight;
    const TOP = 160; // шапка/отступы
    const PAGER = 56; // панель пагинации
    const THEAD = 48; // заголовок таблицы
    const ROW = 52; // высота строки
    const avail = Math.max(200, vh - TOP - PAGER);
    const rows = Math.max(1, Math.floor((avail - THEAD) / ROW));

    if (rows && rows !== pageSize) {
      router.replace(`/books?page=${page}&pageSize=${rows}`);
    }
  }, []); // только один раз

  return null;
}
