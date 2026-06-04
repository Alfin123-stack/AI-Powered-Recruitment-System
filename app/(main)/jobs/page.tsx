import { Suspense } from "react";
import JobHero from "@/components/jobs/JobHero";
import JobsContainer from "@/components/jobs/JobsContainer";
import JobsSkeleton from "@/components/jobs/JobsSkeleton";
import { getJobs } from "@/lib/fetchers/jobs";
import { Job } from "@/types/jobs";

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
        <Suspense fallback={<JobHero jobs={[]} loading={true} />}>
          <JobHeroServer jobsPromise={jobsPromise} />
        </Suspense>

        <Suspense fallback={<JobsSkeleton />}>
          <JobsContainerServer jobsPromise={jobsPromise} />
        </Suspense>
      </main>
    </div>
  );
}

async function JobHeroServer({ jobsPromise }: { jobsPromise: Promise<Job[]> }) {
  const jobs = await jobsPromise;
  return <JobHero jobs={jobs} loading={false} />;
}

async function JobsContainerServer({
  jobsPromise,
}: {
  jobsPromise: Promise<Job[]>;
}) {
  const jobs = await jobsPromise;
  return <JobsContainer initialJobs={jobs} />;
}
