import { Suspense } from "react";

import { ProfileShell } from "@/components/profile/ProfileShell";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { getServerSession } from "@/lib/auth/getServerSession";
import { getUserRole } from "@/lib/auth/getUserRole";
import { fetchCandidateStats, fetchCompanyData } from "@/lib/fetchers/profile";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}


async function ProfilePageContent() {
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
  );
}