import type {
  Application,
  CvAnalysis,
  Interview,
  Job,
  UserProfile,
} from "@/types/candidate-dashboard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchApplications(token: string): Promise<Application[]> {
  try {
    const res = await fetch(`${API}/api/applications/my`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchCvAnalysis(
  token: string,
): Promise<CvAnalysis | null> {
  try {
    const res = await fetch(`${API}/api/cv-analysis/latest`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchInterviews(token: string): Promise<Interview[]> {
  try {
    const res = await fetch(`${API}/api/interviews/my`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
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

export async function fetchUserProfile(
  token: string,
): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
