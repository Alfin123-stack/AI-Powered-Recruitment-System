import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getServerSession } from "@/lib/auth/getServerSession";
import { getUserRole } from "@/lib/auth/getUserRole";
import {
  fetchApplications,
  fetchInterviews,
} from "@/lib/fetchers/candidate/applications";
import ApplicationsClient from "@/components/candidate/applications/ApplicationsClient";
import { ApplicationsPageSkeleton } from "@/components/candidate/applications/ApplicationsSkeletons";
import ApplicationsStatsBar from "@/components/candidate/applications/ApplicationsStatsBar";

// ── Async Content Component ───────────────────────────────────────────────────
async function ApplicationsContent({ accessToken }: { accessToken: string }) {
  const [applications, interviews] = await Promise.all([
    fetchApplications(accessToken),
    fetchInterviews(accessToken),
  ]);

  return (
    <>
      <ApplicationsStatsBar
        applications={applications}
        interviews={interviews}
      />
      <ApplicationsClient applications={applications} interviews={interviews} />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ApplicationsPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  const role = await getUserRole(session.user.id);
  if (role === "hr") redirect("/dashboard/hr");

  return (
    <div>
      <Suspense fallback={<ApplicationsPageSkeleton />}>
        <ApplicationsContent accessToken={session.access_token} />
      </Suspense>
    </div>
  );
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Lamaranku — Dashboard Kandidat",
  description: "Pantau status lamaran dan jadwal interview kamu.",
};
