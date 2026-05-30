// ─── NotificationsServer (React Server Component) ─────────────────────────────
// Rendering strategy:
//   • SSR  → rendered per-request when token is user-specific
//   • ISR  → fetchNotificationsServer uses `next: { revalidate: 30 }` so
//             static/shared pages revalidate every 30 s without a full rebuild
//   • This RSC wraps NotificationsClient, passing server-fetched data as props
//     so the client shell hydrates with data already available (no waterfall).

import { Suspense } from "react";
import NotificationsHeader from "./NotificationsHeader";
import AmbientBackground from "./AmbientBackground";
import NotificationsClient from "./NotificationsClient";
import NotificationsSkeleton from "./NotificationsSkeleton";
import { fetchNotificationsServer } from "./api";
import type { NavItem, StatDef, UserMeta, Notif } from "./notifications";

export interface NotificationsServerProps {
  role: "hr" | "candidate";
  backHref: string;
  navItems: NavItem[];
  stats?: StatDef[];
  subtitle?: (opts: { unreadCount: number; user?: UserMeta }) => string;
  token: string;
  user: UserMeta | null;
}

// Inner async RSC — data fetch lives here so Suspense can stream it.
async function NotificationsData({
  token,
  stats,
  subtitle,
  user,
}: Pick<NotificationsServerProps, "token" | "stats" | "subtitle" | "user">) {
  // ISR: revalidate every 30 seconds.
  // For per-user data this behaves as SSR (token changes each request).
  const initialNotifs: Notif[] = await fetchNotificationsServer(token, 30);

  return (
    <NotificationsClient
      initialNotifs={initialNotifs}
      stats={stats}
      subtitle={subtitle}
      token={token}
      user={user}
    />
  );
}

// Public RSC shell — header is static (SSG-friendly), data is streamed.
export default function NotificationsServer({
  backHref,
  navItems,
  stats,
  subtitle,
  token,
  user,
}: NotificationsServerProps) {
  return (
    <div className="min-h-screen" style={{ background: "#080d0b" }}>
      {/* Static ambient blobs — rendered server-side, no JS */}
      <AmbientBackground />

      {/* Header is static — can be cached as SSG/ISR fragment */}
      <NotificationsHeader backHref={backHref} navItems={navItems} />

      {/*
        Suspense boundary:
        - Fallback: skeleton shown immediately (SSR'd HTML)
        - Children: streamed once NotificationsData resolves
        This enables React 18 streaming SSR so the user sees content fast.
      */}
      <Suspense fallback={<SkeletonWithPadding />}>
        <NotificationsData
          token={token}
          stats={stats}
          subtitle={subtitle}
          user={user}
        />
      </Suspense>
    </div>
  );
}

// Skeleton wrapped with the same max-width/padding as NotificationsClient.
function SkeletonWithPadding() {
  return (
    <div className="relative max-w-[720px] mx-auto px-5 py-8">
      {/* Heading placeholder */}
      <div className="mb-6 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl bg-white/5"
            style={{ border: "1px solid rgba(52,211,153,0.1)" }}
          />
          <div className="space-y-2">
            <div className="h-5 w-28 rounded bg-white/5" />
            <div className="h-2.5 w-48 rounded bg-white/[0.03]" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/[0.04]" />
        </div>
      </div>

      <NotificationsSkeleton />
    </div>
  );
}
