
import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getServerSession } from "@/lib/auth/getServerSession";

import { HRDashboardSkeleton } from "@/components/hr/dashboard/DashboardSkeleton";
import { fetchDashboardData } from "@/lib/fetchers/hr/dashboard";
import { DashboardClient } from "@/components/hr/dashboard/DashboardClient";

export const revalidate = 60;

async function HRDashboardServer() {
  const session = await getServerSession();

  if (!session?.access_token) {
    redirect("/login");
  }

  const { candidates, interviews, company } = await fetchDashboardData(
    session.access_token,
  );

  return (
    <DashboardClient
      initialCandidates={candidates}
      initialInterviews={interviews}
      company={company}
    />
  );
}

export default function HRDashboardPage() {
  return (
    <Suspense fallback={<HRDashboardSkeleton />}>
      <HRDashboardServer />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "HR Dashboard | AI Recruitment",
  description:
    "Monitor kandidat, jadwal interview, dan analitik rekrutmen secara real-time.",
};
