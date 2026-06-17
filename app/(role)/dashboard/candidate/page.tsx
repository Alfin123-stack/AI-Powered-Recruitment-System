import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getServerSession } from "@/lib/auth/getServerSession";
import {
  fetchApplications,
  fetchCvAnalysis,
  fetchInterviews,
  fetchJobs,
  fetchUserProfile,
} from "@/lib/fetchers/candidate/dashboard";

import { DashboardShell } from "@/components/candidate/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard Kandidat",
  description: "Pantau lamaran, analisis CV, dan rekomendasi lowongan AI.",
};

export default async function CandidateDashboardPage() {
  const session = await getServerSession();

  if (!session?.access_token) {
    redirect("/login");
  }

  const token = session.access_token;

  const [applications, cvAnalysis, interviews, jobs, userProfile] =
    await Promise.all([
      fetchApplications(token),
      fetchCvAnalysis(token),
      fetchInterviews(token),
      fetchJobs(),
      fetchUserProfile(token),
    ]);

  return (
    <DashboardShell
      initialApplications={applications}
      initialCvAnalysis={cvAnalysis}
      initialInterviews={interviews}
      initialJobs={jobs}
      user={userProfile}
    />
  );
}
