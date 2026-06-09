import { Suspense } from "react";
import { Metadata } from "next";

// Components
import { AnalyticsDashboard } from "@/components/hr/analytics/AnalyticsDashboard";
import { AnalyticsPageSkeleton } from "@/components/hr/analytics/AnalyticsPageSkeleton";

// ─── Metadata (SSG-like, dihasilkan build-time) ──────────────────────────────
export const metadata: Metadata = {
  title: "Analytics — HR Dashboard",
  description:
    "Data rekrutmen real-time: pipeline, kandidat, dan performa per posisi.",
};

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsPageSkeleton />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}
