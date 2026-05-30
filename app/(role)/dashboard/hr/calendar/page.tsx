// app/(role)/dashboard/hr/calendar/page.tsx
// Route page — SSR + ISR dengan Suspense boundary + Skeleton UI
//
// Strategi rendering:
// ┌─────────────────────────────────────────────────────────────────┐
// │  page.tsx           → SSR (Server Component, no "use client")   │
// │  CalendarServer     → ISR via Supabase SSR (revalidate: 60s)    │
// │  CalendarClient     → CSR (state, interaksi, animasi)           │
// │  CalendarSkeleton   → SSR-safe fallback saat data loading       │
// └─────────────────────────────────────────────────────────────────┘
//
// Auth flow (sesuai proxy.ts):
// - Middleware/proxy sudah guard route /dashboard/hr/*
// - CalendarServer re-verifikasi session + role sebagai safety net
// - Session dari Supabase cookie (bukan auth_token manual)

import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarServer } from "@/components/hr/calendar/CalendarServer";
import { CalendarPageSkeleton } from "@/components/hr/calendar/CalendarSkeleton";

// ─── SSG: Metadata statis ─────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Calendar | HR Dashboard",
  description:
    "Jadwal interview dan agenda HR dalam tampilan kalender interaktif",
};

// ─── ISR: Revalidasi halaman setiap 60 detik ─────────────────────────────────
// Next.js serve halaman dari cache, regenerasi di background tiap 60 detik.
// Halaman terasa cepat (dari cache) namun data tetap relatif fresh.
export const revalidate = 60;

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  return (
    // Suspense boundary untuk streaming SSR:
    // 1. Browser terima HTML skeleton langsung (tidak nunggu data)
    // 2. CalendarServer async: getSession → verify role → fetch interviews
    // 3. Setelah data siap, React stream konten nyata mengganti skeleton
    <Suspense fallback={<CalendarPageSkeleton />}>
      <CalendarServer />
    </Suspense>
  );
}
