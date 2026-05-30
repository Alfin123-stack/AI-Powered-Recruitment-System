// app/profile/page.tsx
// ─────────────────────────────────────────────
// RENDERING STRATEGY: SSR (Server-Side Rendering)
//
// Kenapa SSR di sini?
// - Data user bersifat private & per-request (tidak bisa SSG/ISR)
// - Middleware (proxy.ts) sudah validasi session via cookies
// - Server fetch data SEBELUM HTML dikirim ke browser
//   → tidak ada loading spinner awal, tidak ada layout shift
// - Token dari session server dipakai untuk paralel fetch stats
// ─────────────────────────────────────────────

import { Suspense } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { ProfileShell } from "@/components/profile/ProfileShell";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Tipe data yang di-pass dari server ke client
export interface ServerProfileData {
  user: {
    id: string;
    email: string;
    created_at: string;
    user_metadata: Record<string, any>;
  };
  token: string;
  role: "candidate" | "hr";
  // Candidate stats (di-fetch server-side)
  applicationCount: number;
  savedCount: number;
  // HR company data (di-fetch server-side)
  company: {
    name: string;
    description: string;
    company_size: string;
  } | null;
}

// ── Server-side data fetchers ────────────────────────────────────────────────

async function fetchCandidateStats(token: string) {
  try {
    // Paralel fetch — tidak blocking satu sama lain
    const [appsRes, savedRes] = await Promise.allSettled([
      fetch(`${API}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
        // next: { revalidate: 0 } → selalu fresh karena SSR
        cache: "no-store",
      }),
      fetch(`${API}/api/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    const applicationCount =
      appsRes.status === "fulfilled" && appsRes.value.ok
        ? ((await appsRes.value.json()) as any[]).length
        : 0;

    const savedCount =
      savedRes.status === "fulfilled" && savedRes.value.ok
        ? ((await savedRes.value.json()) as any[]).length
        : 0;

    return { applicationCount, savedCount };
  } catch {
    return { applicationCount: 0, savedCount: 0 };
  }
}

async function fetchCompanyData(token: string) {
  try {
    const res = await fetch(`${API}/api/companies/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only di Server Component
      },
    },
  );

  // ✅ Tidak perlu if (!session) redirect("/login")
  // Middleware sudah pastikan user login sebelum sampai sini.
  // Non-null assertion (!) aman di sini.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { user } = session!;
  const token = session!.access_token;

  // Role dari DB — sama seperti yang middleware lakukan,
  // tapi di sini untuk keperluan fetch data yang tepat
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role: "candidate" | "hr" = userData?.role === "hr" ? "hr" : "candidate";

  const [candidateStats, company] = await Promise.all([
    role === "candidate"
      ? fetchCandidateStats(token)
      : Promise.resolve({ applicationCount: 0, savedCount: 0 }),
    role === "hr" ? fetchCompanyData(token) : Promise.resolve(null),
  ]);

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileShell
        data={{
          user: {
            id: user.id,
            email: user.email ?? "",
            created_at: user.created_at,
            user_metadata: user.user_metadata ?? {},
          },
          token,
          role,
          applicationCount: candidateStats.applicationCount,
          savedCount: candidateStats.savedCount,
          company,
        }}
      />
    </Suspense>
  );
}
