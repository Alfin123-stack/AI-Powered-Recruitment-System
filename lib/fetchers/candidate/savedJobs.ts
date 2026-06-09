import { getColor } from "@/lib/helpers/candidate/saved";
import { SavedJob, SavedJobRaw } from "@/types/candidate/saved";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchSavedJobs(accessToken: string): Promise<SavedJob[]> {
  try {
    const res = await fetch(`${API}/api/saved-jobs`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { tags: ["saved-jobs"], revalidate: 60 },
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
