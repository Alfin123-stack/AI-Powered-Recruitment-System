// app/(role)/dashboard/hr/candidates/page.tsx
// SERVER PAGE — entry point dengan Suspense + Skeleton
//
// Rendering strategy:
//   • OpeningsSection + CandidatesTable → keduanya ada di dalam CandidatesTable (CSR)
//     OpeningsSection menerima jobMetas dari CandidatesTable setelah fetch selesai
//
// Auth: TIDAK ada redirect guard di sini.
// Auth & role guard sudah ditangani oleh middleware atau (role)/layout.tsx.

import { Suspense } from "react";
import type { Metadata } from "next";

import CandidatesTable from "@/components/hr/candidates/CandidatesTable";
import { CandidatesPageSkeleton } from "@/components/hr/candidates/CandidatesSkeleton";

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Candidates | HR Dashboard",
  description: "Kelola dan review kandidat pelamar kerja",
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PROPS
// ─────────────────────────────────────────────────────────────────────────────
interface CandidatesPageProps {
  searchParams: Promise<{ job?: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default async function CandidatesPage({
  searchParams,
}: CandidatesPageProps) {
  const params = await searchParams;
  const jobFilter = params.job;

  return (
    /*
     * Suspense wajib karena CandidatesTable memanggil useSearchParams().
     * OpeningsSection di-render di dalam CandidatesTable, menerima jobMetas
     * yang dihitung dari hasil fetch CSR — tidak butuh token server-side.
     */
    <Suspense fallback={<CandidatesPageSkeleton />}>
      <CandidatesTable initialJob={jobFilter} />
    </Suspense>
  );
}
