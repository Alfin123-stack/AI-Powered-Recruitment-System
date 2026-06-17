import { getServerSession } from "@/lib/auth/getServerSession";
import { JobsPageClient } from "./JobsPageClient";

import { Job, RawApplication } from "@/types/hr/dashboard";
import { fetchWithToken } from "@/lib/fetchers/hr/dashboard";

export async function JobsServerFetcher() {
  const session = await getServerSession();
  const token = session?.access_token ?? "";

  const [jobs, applications] = await Promise.all([
    fetchWithToken<Job[]>("/api/jobs/my", token),
    fetchWithToken<RawApplication[]>("/api/applications/hr", token),
  ]);

  return (
    <JobsPageClient
      initialJobs={jobs ?? []}
      initialApplications={applications ?? []}
    />
  );
}
