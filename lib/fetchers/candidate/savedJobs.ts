import { getColor } from "@/lib/helpers/candidate/saved";
import { SavedJob, SavedJobRaw } from "@/types/candidate/saved";

import { API } from "@/lib/api";

export async function fetchSavedJobs(accessToken: string): Promise<SavedJob[]> {
  try {
    const res = await fetch(`${API}/api/saved-jobs`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: SavedJobRaw[] = await res.json();
    return (Array.isArray(data) ? data : []).map((j, i) => ({
      ...j,
      color: getColor(i),
    }));
  } catch {
    return [];
  }
}