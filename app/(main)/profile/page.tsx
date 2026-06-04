// app/profile/page.tsx
// ─────────────────────────────────────────────
// RENDERING STRATEGY: SSR (Server-Side Rendering)
//
// Kenapa SSR di sini?
// - Data user bersifat private & per-request (tidak bisa SSG/ISR)
// - Middleware (proxy.ts) sudah validasi session via cookies
// - Server fetch data SEBELUM HTML dikirim ke browser
//   → tidak ada loading spinner awal, tidak ada layout shift
// ─────────────────────────────────────────────

import { Suspense } from "react";

import { ProfileShell } from "@/components/profile/ProfileShell";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUserRole } from "@/lib/auth/getUserRole";
import { fetchCandidateStats, fetchCompanyData } from "@/lib/fetchers/profile";

export default async function ProfilePage() {
  const session = await getServerSession();
  const { user } = session!;
  const token = session!.access_token;

  const role = await getUserRole(user.id);

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
