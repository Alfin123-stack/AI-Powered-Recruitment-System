import { Suspense } from "react";

import JobsContainer from "@/components/jobs/JobsContainer";
import JobsSkeleton from "@/components/jobs/JobsSkeleton";
import JobsHero from "@/components/jobs/JobsHero";

import { Job } from "@/types/jobs";
import { getJobs } from "@/lib/fetchers/jobs";

export const revalidate = 60;

export const metadata = {
  title: "Lowongan Kerja | Karir AI-Powered",
  description:
    "Temukan ribuan lowongan dari perusahaan terpercaya. Lamar langsung dan ukur kecocokan CV Anda dengan analisis AI.",
};

export default async function JobsPage() {
  const jobsPromise = getJobs();

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
 
        <Suspense fallback={<JobsSkeleton />}>
          <JobsPageContent jobsPromise={jobsPromise} />
        </Suspense>
      </main>
    </div>
  );
}

async function JobsPageContent({
  jobsPromise,
}: {
  jobsPromise: Promise<Job[]>;
}) {
  const jobs = await jobsPromise;

  return (
    <>
      <JobsHero jobs={jobs} loading={false} />
      <JobsContainer initialJobs={jobs} />
    </>
  );
}