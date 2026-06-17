import { Suspense } from "react";
import type { Metadata } from "next";

import CalendarClient from "@/components/candidate/calendar/CalendarClient";
import CalendarPageSkeleton from "@/components/candidate/calendar/CalendarSkeleton";

export const metadata: Metadata = {
  title: "Kalender Interview",
  description: "Lihat dan kelola jadwal interview Anda",
};

export default function CalendarPage() {
  return (
    <div>
      {/* Page header — di-render di server, langsung ada di HTML */}
      <div className="mb-5">
        <h1 className="font-extrabold text-[1.2rem] mb-1">
          Kalender Interview
        </h1>
        <p className="text-[0.78rem] text-[#7a9585]">
          Klik tanggal untuk melihat detail. Titik warna menandakan jenis
          interview.
        </p>
      </div>

      {/**
       * Suspense boundary:
       * - fallback: CalendarPageSkeleton (semua skeleton dalam satu file)
       * - children: CalendarClient (CSR, lazy-loaded)
       *
       * Saat bundle CalendarClient belum tiba di browser,
       * React menampilkan skeleton secara otomatis.
       */}
      <Suspense fallback={<CalendarPageSkeleton />}>
        <CalendarClient />
      </Suspense>
    </div>
  );
}
