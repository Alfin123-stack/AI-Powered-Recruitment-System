// ─── /app/dashboard/notifications/page.tsx ────────────────────────────────────
//
// Rendering strategy summary:
//
//   PAGE          → SSR (force-dynamic): reads session cookie + DB role query,
//                   both are per-request and cannot be cached.
//
//   Role          → Fetched from `users` table (source of truth), consistent
//                   with proxy.ts — NOT from user_metadata / app_metadata.
//
//   Header        → RSC fragment (static markup, zero client JS).
//
//   AmbientBg     → RSC fragment (static markup, zero client JS).
//
//   NotificationsData (inner RSC)
//                 → SSR + ISR hybrid: fetch uses `next: { revalidate: 30 }`.
//
//   NotificationsClient
//                 → CSR shell; hydrated with server-fetched data (no waterfall).
//
//   Suspense      → streams skeleton immediately, swaps content once async RSC
//                   resolves (React 18 streaming SSR).

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import NotificationsServer from "@/components/notifications/NotificationsServer";
import { ROLE_CONFIG } from "@/components/notifications/roleConfig";
import type { UserMeta } from "@/components/notifications/notifications";

// Force dynamic — depends on auth session cookie + DB query (per-request).
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const cookieStore = await cookies();

  // ── Supabase SSR client (mirrors proxy.ts pattern) ───────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // setAll is called by Supabase internals to refresh the session token.
          // In a Server Component we can't write cookies (only Route Handlers /
          // Server Actions can). The try-catch silences the Next.js warning
          // without breaking anything — the middleware (proxy.ts) handles the
          // actual cookie refresh for every request, so we don't need it here.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Intentionally ignored in Server Component context.
          }
        },
      },
    },
  );

  // ── Session guard ─────────────────────────────────────────────────────────
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const token = session.access_token;
  const rawUser = session.user;

  // ── Role: query DB (source of truth, same as proxy.ts) ───────────────────
  // We intentionally do NOT rely on user_metadata / app_metadata because
  // proxy.ts already established that the `users` table is authoritative.
  let role: "hr" | "candidate" = "candidate";

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", rawUser.id)
    .single();

  if (userData?.role === "hr") {
    role = "hr";
  }

  // ── Build typed UserMeta ──────────────────────────────────────────────────
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
