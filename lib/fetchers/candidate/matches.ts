import type { Application } from "@/types/candidate/dashboard";
import { API } from "@/lib/api";

/**
 * fetchMyApplications — cache: no-store (selalu fresh, untuk client context).
 * Berbeda dari fetchApplications di dashboardCandidate yang pakai revalidate.
 */
export async function fetchMyApplications(
  token: string,
): Promise<Application[]> {
  try {
    const res = await fetch(`${API}/api/applications/my`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}
