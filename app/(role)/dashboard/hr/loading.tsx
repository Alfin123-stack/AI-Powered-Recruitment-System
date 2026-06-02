// ─────────────────────────────────────────────────────────────────────────────
// LOADING — Next.js automatic Suspense boundary
// Route: app/dashboard/hr/loading.tsx
//
// Next.js otomatis menggunakan file ini sebagai fallback Suspense
// saat page.tsx (Server Component) sedang loading.
// ─────────────────────────────────────────────────────────────────────────────

import { HRDashboardSkeleton } from "@/components/hr/dashboard/DashboardSkeleton";

export default function HRDashboardLoading() {
  return <HRDashboardSkeleton />;
}
