import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getServerSession } from "@/lib/auth/getServerSession";

import { InterviewsPageSkeleton } from "@/components/hr/interviews/InterviewsSkeleton";
import InterviewsClient from "@/components/hr/interviews/InterviewsClient";
import type {
  Interview,
  ShortlistedCandidate,
} from "@/types/hr/interviews";
import type { CompanyInfo } from "@/types/hr/dashboard";
import { fetchWithToken } from "@/lib/fetchers/hr/dashboard";



async function InterviewsData({ token }: { token: string }) {
  const [interviews, shortlisted, company] = await Promise.all([
    fetchWithToken<Interview[]>("/api/interviews", token),
    fetchWithToken<ShortlistedCandidate[]>(
      "/api/interviews/shortlisted",
      token,
    ),
    fetchWithToken<CompanyInfo>("/api/company", token),
  ]);

  return (
    <InterviewsClient
      initialInterviews={interviews ?? []}
      initialShortlisted={shortlisted ?? []}
      token={token}
      companyName={company?.name ?? ""}
    />
  );
}

export const metadata: Metadata = {
  title: "Interview Schedule | HR Dashboard",
  description: "Manage and schedule candidate interviews",
};

// force-dynamic: halaman ini per-user, jangan pernah di-cache di ISR/SSG
export const dynamic = "force-dynamic";

export default async function InterviewsPage() {
  const session = await getServerSession();

  if (!session?.access_token) {
    redirect("/login");
  }

  const token = session.access_token;

  return (
    <Suspense fallback={<InterviewsPageSkeleton />}>
      <InterviewsData token={token} />
    </Suspense>
  );
}