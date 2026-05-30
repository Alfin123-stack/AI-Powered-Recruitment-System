import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

import {
  WelcomeBannerSkeleton,
  StatsGridSkeleton,
  AiInsightCardSkeleton,
  ApplicationFunnelSkeleton,
  ApplicationListSkeleton,
  MiniCalendarSkeleton,
  RecommendationsPanelSkeleton,
} from "./loading";

import { DashboardShell } from "@/components/candidate/dashboard/DashboardShell";

export type CvAnalysis = {
  id: string;
  resume_score: number;
  ats_score: number;
  overall_score: number;
  extracted_skills: { name: string; level: number }[];
  categories: { label: string; score: number }[];
  strengths: string[];
  improvements: string[];
  file_name?: string;
  created_at: string;
};

export type Application = {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: "applied" | "review" | "shortlisted" | "rejected";
  matching_score?: number;
  resume_score?: number;
  created_at: string;
};

export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: "online" | "onsite";
  location: string;
  notes?: string;
  status: "scheduled" | "done" | "cancelled";
  job_title?: string;
  company_name?: string;
};

export type Job = {
  id: string;
  title: string;
  skills: string[];
  location?: string;
  type?: string;
  salary?: string;
  companies: { name: string; logo_url?: string };
};

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Supabase server client ────────────────────────────────────────────────────
async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

// ── Data fetchers (pakai Supabase access token) ───────────────────────────────
async function fetchApplications(token: string): Promise<Application[]> {
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

async function fetchCvAnalysis(token: string): Promise<CvAnalysis | null> {
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

async function fetchInterviews(token: string): Promise<Interview[]> {
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

async function fetchJobs(): Promise<Job[]> {
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

async function fetchUserProfile(token: string): Promise<UserProfile | null> {
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

// ── Page Component ────────────────────────────────────────────────────────────
export default async function CandidateDashboardPage() {
  const supabase = await createSupabaseServer();

  // ✅ getUser() — diverifikasi ke Supabase Auth server, bukan dari cookies mentah
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/login");
  }

  // Ambil access token untuk request ke backend API
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    redirect("/login");
  }

  const [applications, cvAnalysis, interviews, jobs, userProfile] =
    await Promise.all([
      fetchApplications(token),
      fetchCvAnalysis(token),
      fetchInterviews(token),
      fetchJobs(),
      fetchUserProfile(token),
    ]);

  return (
    <DashboardShell
      initialApplications={applications}
      initialCvAnalysis={cvAnalysis}
      initialInterviews={interviews}
      initialJobs={jobs}
      user={userProfile}
      welcomeBannerFallback={<WelcomeBannerSkeleton />}
      statsFallback={<StatsGridSkeleton />}
      cvFallback={<AiInsightCardSkeleton />}
      funnelFallback={<ApplicationFunnelSkeleton />}
      appListFallback={<ApplicationListSkeleton />}
      calendarFallback={<MiniCalendarSkeleton />}
      recsFallback={<RecommendationsPanelSkeleton />}
    />
  );
}

export const metadata = {
  title: "Dashboard Kandidat",
  description: "Pantau lamaran, analisis CV, dan rekomendasi lowongan AI.",
};
