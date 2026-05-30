// SERVER COMPONENT — page ini di-render di server
//
// Strategi rendering:
//  - ISR: revalidate setiap 60 detik
//  - generateStaticParams: SSG untuk job populer saat build time
//  - Sidebar (apply/save) → CSR via Client Component
//  - Skeleton via Suspense boundary

import { Suspense } from "react";
import Link from "next/link";

import { getColor, parseRequirements } from "@/lib/utils";
import { Job } from "@/lib/jobs";
import JobDetailHero from "@/components/job-detail/JobDetailHero";
import JobDetailBody from "@/components/job-detail/JobDetailBody";
import JobDetailSidebar from "@/components/job-detail/JobDetailSidebar";
import {
  JobDetailHeroSkeleton,
  JobDetailContentSkeleton,
  JobDetailSidebarSkeleton,
} from "@/components/job-detail/JobDetailSkeleton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── ISR ───────────────────────────────────────────────────────────────────────
export const revalidate = 60;

// ── SSG params ────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/api/jobs?limit=20&sort=popular`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const jobs: Job[] = await res.json();
    return jobs.map((job) => ({ id: String(job.id) }));
  } catch {
    return [];
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────
// Next.js 15: params adalah Promise, harus di-await
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const res = await fetch(`${API}/api/jobs/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { title: "Lowongan" };
    const job: Job = await res.json();
    return {
      title: `${job.title} — ${job.companies.name}`,
      description: job.description?.slice(0, 155),
    };
  } catch {
    return { title: "Lowongan" };
  }
}

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(`${API}/api/jobs/${id}`, {
      next: { revalidate: 60 },
      // Tambahan: pastikan tidak pakai cache stale saat dev
      cache: process.env.NODE_ENV === "development" ? "no-store" : "default",
    });

    if (res.status === 404) return null;

    // Log status di dev supaya mudah debug
    if (!res.ok) {
      console.error(`[getJob] HTTP ${res.status} for id=${id}`);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error(`[getJob] Fetch error for id=${id}:`, err);
    return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
// Next.js 15: params adalah Promise, harus di-await
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ⚠️ Ini root cause bug "tidak ditemukan": di Next.js 15, params harus di-await
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
