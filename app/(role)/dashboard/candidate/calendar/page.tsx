/**
 * /app/(role)/candidate/calendar/page.tsx
 *
 * ── Rendering Strategy ──────────────────────────────────────────────────────
 *
 * SSR (Server-Side Rendering) untuk shell halaman:
 *   - Metadata halaman (title, description) di-render di server
 *   - Page header (judul + deskripsi) langsung ada di HTML pertama
 *   - Lebih baik untuk SEO dan First Contentful Paint
 *
 * CSR untuk data interview (via CalendarClient):
 *   - Data bersifat personal + membutuhkan token dari AuthContext
 *   - Token hanya tersedia di client → tidak bisa di-fetch di server
 *   - Komponen CalendarClient fetch sendiri setelah mount
 *
 * Suspense + CalendarPageSkeleton:
 *   - Saat JS bundle CalendarClient belum siap, Suspense menampilkan skeleton
 *   - Memberikan UX yang smooth tanpa layout shift
 *
 * Tidak pakai ISR / SSG karena:
 *   - Data berubah per-user dan tidak bisa di-cache secara global
 * ────────────────────────────────────────────────────────────────────────────
 */

import { Suspense } from "react";
import type { Metadata } from "next";

import CalendarClient from "@/components/candidate/calendar/CalendarClient";
import CalendarPageSkeleton from "@/components/candidate/calendar/CalendarSkeleton";

export const metadata: Metadata = {
  title: "Kalender Interview",
  description: "Lihat dan kelola jadwal interview Anda",
};

// Tidak ada revalidate → default SSR (tidak di-cache, selalu fresh per request)
// Jika ingin ISR untuk shell: export const revalidate = 3600;

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
