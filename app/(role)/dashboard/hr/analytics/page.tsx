// app/hr/analytics/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Server Component (SSR) — Next.js App Router
//
// Rendering strategy:
//   • SSR  → page.tsx sendiri (Server Component, dijalankan di server setiap request)
//   • ISR  → optional revalidate di bawah (uncomment untuk aktifkan ISR)
//   • CSR  → AnalyticsDashboard (Client Component) melakukan data-fetching
//             setelah mount untuk mendapatkan data real-time per-user (token)
//   • SSG  → tidak cocok untuk halaman yang butuh auth token per-user
//
// Suspense + skeleton dipasang di sini agar shell statis langsung tampil
// sementara AnalyticsDashboard (CSR) sedang loading.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from "react";
import { Metadata } from "next";

// Components
import { AnalyticsDashboard } from "@/components/hr/analytics/AnalyticsDashboard";
import { AnalyticsPageSkeleton } from "@/components/hr/analytics/AnalyticsSkeleton";

// ─── Metadata (SSG-like, dihasilkan build-time) ──────────────────────────────
export const metadata: Metadata = {
  title: "Analytics — HR Dashboard",
  description: "Data rekrutmen real-time: pipeline, kandidat, dan performa per posisi.",
};

// ─── ISR: Aktifkan jika ada bagian data yang bisa di-cache server-side ───────
// export const revalidate = 60; // revalidate setiap 60 detik

// ─── Force dynamic agar tidak di-cache saat pakai auth token ─────────────────
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  // Server Component: tidak ada useState, tidak ada useEffect.
  // Data fetching yang butuh `token` (per-user) dilakukan di Client Component.
  // Jika ada data publik/server-side (misalnya config, feature flags),
  // bisa di-fetch di sini dan dikirim sebagai props ke AnalyticsDashboard.

  return (
    /**
     * Suspense boundary:
     * - fallback = AnalyticsPageSkeleton (full-page skeleton, satu file)
     * - children = AnalyticsDashboard (Client Component, lazy-loaded)
     *
     * Shell statis (skeleton) langsung di-stream ke browser,
     * lalu digantikan konten nyata setelah JS di-hydrate dan data di-fetch.
     */
    <Suspense fallback={<AnalyticsPageSkeleton />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}