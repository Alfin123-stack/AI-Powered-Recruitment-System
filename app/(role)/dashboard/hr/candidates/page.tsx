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
    <Suspense fallback={<CandidatesPageSkeleton />}>
      <CandidatesTable initialJob={jobFilter} />
    </Suspense>
  );
}
