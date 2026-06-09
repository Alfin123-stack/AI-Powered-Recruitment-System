// ─────────────────────────────────────────────────────────────────────────────
// HR DASHBOARD PAGE — Server Component (SSR + ISR)
// Route: app/dashboard/hr/page.tsx
//
// Rendering strategy:
//   • SSR      : fetch data di server saat request (real-time candidate data)
//   • ISR      : revalidate setiap 60 detik (company info)
//   • CSR      : semua interaksi di HRDashboardClient (status update, filter, modal)
//   • Suspense : skeleton tampil segera saat server fetch belum selesai
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getServerSession } from "@/lib/auth/getServerSession";

import { HR_DASHBOARD_REVALIDATE } from "@/constants/hr-dashboard";
import { HRDashboardSkeleton } from "@/components/hr/dashboard/DashboardSkeleton";
import { fetchDashboardData } from "@/lib/fetchers/hr/dashboardHR";
import { DashboardClient } from "@/components/hr/dashboard/DashboardClient";

export const revalidate = HR_DASHBOARD_REVALIDATE;

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
