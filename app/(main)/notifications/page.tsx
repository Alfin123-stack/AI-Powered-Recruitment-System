// app/notifications/page.tsx
// ─────────────────────────────────────────────
// RENDERING STRATEGY: SSR (force-dynamic)
//
// Depends on auth session cookie + DB query (per-request).
// Middleware sudah handle session guard untuk semua protected routes,
// tapi redirect manual tetap ada sebagai safety net.
// ─────────────────────────────────────────────

import { redirect } from "next/navigation";

import NotificationsServer from "@/components/notifications/NotificationsServer";
import { ROLE_CONFIG } from "@/components/notifications/roleConfig";
import type { UserMeta } from "@/components/notifications/notifications";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUserRole } from "@/lib/auth/getUserRole";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const token = session.access_token;
  const rawUser = session.user;

  // Role: query DB (source of truth, same as proxy.ts).
  // Tidak pakai user_metadata / app_metadata karena
  // tabel `users` yang jadi acuan, sesuai proxy.ts.
  const role = await getUserRole(rawUser.id);

  const user: UserMeta = {
    id: rawUser.id,
    email: rawUser.email,
    user_metadata: rawUser.user_metadata as UserMeta["user_metadata"],
    app_metadata: rawUser.app_metadata as UserMeta["app_metadata"],
  };

  const { backHref, navItems } = ROLE_CONFIG[role];

  return (
    <NotificationsServer
      role={role}
      backHref={backHref}
      navItems={navItems}
      token={token}
      user={user}
    />
  );
}
