// ─── /app/dashboard/notifications/loading.tsx ────────────────────────────────
// Next.js special file: shown automatically while the page segment is loading.
// This is the ROUTE-level loading state (wraps the entire page in Suspense).
// No "use client" needed — pure static markup streamed from the server.

import NotificationsSkeleton from "@/components/notifications/NotificationsSkeleton";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#080d0b" }}>
      {/* Minimal header placeholder */}
      <div
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          background: "rgba(8,13,11,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
        <div className="max-w-[720px] mx-auto px-5 h-14 flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.05]" />
          <div className="h-4 w-24 rounded bg-white/[0.04]" />
        </div>
      </div>

      <div className="relative max-w-[720px] mx-auto px-5 py-8">
        {/* Heading placeholder */}
        <div className="mb-6 flex items-center gap-3 animate-pulse">
          <div
            className="w-11 h-11 rounded-xl bg-white/5"
            style={{ border: "1px solid rgba(52,211,153,0.1)" }}
          />
          <div className="space-y-2">
            <div className="h-5 w-28 rounded bg-white/5" />
            <div className="h-2.5 w-48 rounded bg-white/[0.03]" />
          </div>
        </div>

        <NotificationsSkeleton />
      </div>
    </div>
  );
}
