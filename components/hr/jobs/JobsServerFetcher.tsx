import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { JobsPageClient } from "./JobsPageClient";
import type { RawApplication } from "./types";
import type { Job } from "@/app/(role)/dashboard/hr/_components/shared";

export const revalidate = 60;

async function getSupabaseSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Server Component tidak bisa set cookie — no-op
        setAll() {},
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch helper — gunakan Supabase access_token sebagai Bearer
// ─────────────────────────────────────────────────────────────────────────────
async function fetchWithToken<T>(
  path: string,
  token: string,
): Promise<T | null> {
  if (!token) return null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export async function JobsServerFetcher() {
  // Ambil Supabase session — access_token dipakai sebagai Bearer token API
  const session = await getSupabaseSession();
  const token = session?.access_token ?? "";

  // Parallel fetch — jobs + applications
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
