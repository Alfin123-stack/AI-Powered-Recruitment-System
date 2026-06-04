import { Job } from "@/types/jobs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

const SELECT = "*,companies(id,name,description,company_size,logo_url)";

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=${SELECT}&order=created_at.desc`,
    { headers, next: { revalidate: 60 } },
  );
  if (!res.ok) {
    console.error("[getJobs] Failed:", res.status, res.statusText);
    return [];
  }
  return (await res.json()) ?? [];
}

export async function getJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}&select=${SELECT}`,
      {
        headers,
        next: { revalidate: 60 },
        cache: process.env.NODE_ENV === "development" ? "no-store" : "default",
      },
    );
    if (!res.ok) {
      console.error(`[getJob] HTTP ${res.status} for id=${id}`);
      return null;
    }
    const data: Job[] = await res.json();
    return data?.[0] ?? null;
  } catch (err) {
    console.error(`[getJob] Fetch error for id=${id}:`, err);
    return null;
  }
}

export async function getAllJobIds(): Promise<string[]> {
  const jobs = await getJobs();
  return jobs.map((j) => j.id);
}

export async function getPopularJobIds(): Promise<{ id: string }[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?select=id&order=created_at.desc&limit=20`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const jobs = (await res.json()) as Pick<Job, "id">[];
    return jobs.map((job) => ({ id: String(job.id) }));
  } catch {
    return [];
  }
}
