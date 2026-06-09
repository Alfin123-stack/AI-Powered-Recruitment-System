import type { Job, CvAnalysis, Application } from "@/types/candidate-dashboard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchCvAnalysis(
  token: string,
): Promise<CvAnalysis | null> {
  try {
    const res = await fetch(`${API}/api/cv-analysis/latest`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: CvAnalysis = await res.json();
    return data?.extracted_skills ? data : null;
  } catch {
    return null;
  }
}

export async function fetchJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${API}/api/jobs`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

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
