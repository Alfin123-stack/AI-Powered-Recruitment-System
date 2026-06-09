import type {
  Application,
  Interview,
} from "@/constants/candidate/applications";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchApplications(
  accessToken: string,
): Promise<Application[]> {
  try {
    const res = await fetch(`${API}/api/applications/my`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchInterviews(
  accessToken: string,
): Promise<Interview[]> {
  try {
    const res = await fetch(`${API}/api/interviews/my`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
