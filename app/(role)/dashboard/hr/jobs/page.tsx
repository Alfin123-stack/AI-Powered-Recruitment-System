import { Suspense } from "react";
import type { Metadata } from "next";
import { JobsServerFetcher } from "@/components/hr/jobs/JobsServerFetcher";
import { JobsPageSkeleton } from "@/components/hr/jobs/JobsSkeleton";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Jobs | HR Dashboard",
  description: "Kelola lowongan pekerjaan dan pantau pelamar",
};

export const revalidate = 60;

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageSkeleton />}>
      <JobsServerFetcher />
    </Suspense>
  );
}
