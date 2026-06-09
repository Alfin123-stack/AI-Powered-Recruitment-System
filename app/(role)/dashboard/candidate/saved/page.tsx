// app/(dashboard)/candidate/saved/page.tsx
// Strategy:
//   - SSR     : fetch saved jobs server-side menggunakan Supabase session
//   - ISR     : revalidate tiap 60 detik agar data tidak terlalu stale
//   - CSR     : interaksi (unsave, filter, sort, search) tetap di client via SavedJobsClient
//   - Suspense: fallback skeleton saat streaming SSR berlangsung

import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getServerSession } from "@/lib/auth/getServerSession";

import SavedJobsClient from "@/components/candidate/saved/SavedJobsClient";
import { SavedJobsSkeleton } from "@/components/candidate/saved/SavedJobsSkeleton";
import { fetchSavedJobs } from "@/lib/fetchers/candidate/savedJobs";

export const revalidate = 60;

// ── Async Content ─────────────────────────────────────────────────────────────
async function SavedJobsContent({ accessToken }: { accessToken: string }) {
  const jobs = await fetchSavedJobs(accessToken);
  return <SavedJobsClient initialJobs={jobs} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SavedJobsPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <Suspense fallback={<SavedJobsSkeleton />}>
      <SavedJobsContent accessToken={session.access_token} />
    </Suspense>
  );
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Lowongan Tersimpan | Dashboard Kandidat",
  description: "Kelola dan pantau lowongan kerja yang sudah kamu simpan.",
};
