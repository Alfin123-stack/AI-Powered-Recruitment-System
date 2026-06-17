import { Suspense } from "react";
import Link from "next/link";

import { getColor, parseRequirements } from "@/lib/utils";

import JobDetailHero from "@/components/job-detail/JobDetailHero";
import JobDetailBody from "@/components/job-detail/JobDetailBody";
import JobDetailSidebar from "@/components/job-detail/JobDetailSidebar";
import {
  JobDetailHeroSkeleton,
  JobDetailContentSkeleton,
  JobDetailSidebarSkeleton,
} from "@/components/job-detail/JobDetailSkeleton";
import { getJob, getPopularJobIds } from "@/lib/fetchers/jobs";

export const revalidate = 60;

type PageParams = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return getPopularJobIds();
}

export async function generateMetadata({ params }: PageParams) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) return { title: "Lowongan" };

  return {
    // FIX: guard companies karena bisa null
    title: `${job.title}${job.companies ? ` — ${job.companies.name}` : ""}`,
    description: job.description?.slice(0, 155),
  };
}

export default async function JobDetailPage({ params }: PageParams) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center text-center px-6 text-[#e8f0ec]">
        <div>
          <div className="text-5xl mb-4 opacity-40">🔍</div>
          <div className="font-syne font-bold text-[1.2rem] mb-2">
            Lowongan tidak ditemukan
          </div>
          <p className="text-[#7a9585] text-[0.85rem] mb-6">
            Mungkin sudah ditutup atau tidak tersedia.
          </p>
          <Link
            href="/jobs"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-[10px] no-underline text-[0.88rem]">
            ← Kembali ke Jobs
          </Link>
        </div>
      </div>
    );
  }

  const color = getColor(Number(job.id));
  const requirements = parseRequirements(job.requirements);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        <Suspense fallback={<JobDetailHeroSkeleton />}>
          <JobDetailHero job={job} color={color} />
        </Suspense>

        <div
          className="max-w-[1100px] mx-auto px-6 pt-10 pb-20 grid gap-6"
          style={{ gridTemplateColumns: "1fr 320px" }}>
          <Suspense fallback={<JobDetailContentSkeleton />}>
            <JobDetailBody
              job={job}
              requirements={requirements}
              color={color}
            />
          </Suspense>

          <Suspense fallback={<JobDetailSidebarSkeleton />}>
            <JobDetailSidebar job={job} color={color} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
