// app/dashboard/hr/jobs/page.tsx
// Server Component — entry point route /dashboard/hr/jobs
//
// Rendering strategy:
//   • SSR  : halaman di-render di server saat request pertama
//   • ISR  : data di-revalidate setiap 60 detik (via JobsServerFetcher)
//   • CSR  : interaksi (search, modal, delete) di JobsPageClient
//   • SSG  : TIDAK dipakai — data bersifat per-user (auth-gated), tidak bisa di-prerender statik
//
// Suspense wraps JobsServerFetcher sehingga:
//   1. Server mulai streaming HTML secepatnya
//   2. Skeleton ditampilkan selama data di-fetch
//   3. Setelah fetch selesai, konten nyata di-stream ke client

import { Suspense } from "react";
import type { Metadata } from "next";
import { JobsServerFetcher } from "@/components/hr/jobs/JobsServerFetcher";
import { JobsPageSkeleton } from "@/components/hr/jobs/JobsSkeleton";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Jobs | HR Dashboard",
  description: "Kelola lowongan pekerjaan dan pantau pelamar",
};

// ─── ISR revalidate — diwarisi oleh JobsServerFetcher ────────────────────────
// Dideklarasikan di sini juga agar Next.js route segment config ikut
export const revalidate = 60;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function JobsPage() {
  return (
    /**
     * Suspense boundary:
     * - fallback   = JobsPageSkeleton (langsung tampil, tidak butuh JS)
     * - children   = JobsServerFetcher (async server component, fetch data)
     *
     * Streaming SSR: Next.js akan flush skeleton ke browser duluan,
     * lalu menggantikannya dengan konten nyata setelah fetch selesai.
     */
    <Suspense fallback={<JobsPageSkeleton />}>
      <JobsServerFetcher />
    </Suspense>
  );
}
