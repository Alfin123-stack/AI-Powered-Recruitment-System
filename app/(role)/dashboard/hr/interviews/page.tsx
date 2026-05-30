// app/(role)/dashboard/hr/interviews/page.tsx
//
// RENDERING STRATEGY:
//   • Server Component (RSC) — no "use client"
//   • Auth: Supabase SSR — baca session dari cookies via createServerClient,
//     lalu pakai access_token sebagai Bearer pada setiap API call.
//   • Data fetch SSR (dynamic, cache: "no-store") karena interview bersifat
//     per-user dan berubah sering (jadwal baru, cancel, reschedule).
//   • ISR / SSG TIDAK dipakai: data terlalu volatile dan user-specific.
//   • <InterviewsClient> adalah CSR island yang menerima SSR data sebagai
//     initialProps — instant first paint + full interactivity setelah hydration.
//   • <Suspense> + skeleton: skeleton tampil segera di browser sementara
//     server menunggu Supabase session + API response.

import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { InterviewsPageSkeleton } from "@/components/hr/interviews/InterviewsSkeleton";
import InterviewsClient from "@/components/hr/interviews/InterviewsClient";
import type {
  Interview,
  ShortlistedCandidate,
} from "@/components/hr/interviews/types";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE SESSION — SSR-safe, baca cookies dari request
// ─────────────────────────────────────────────────────────────────────────────
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
// FETCH HELPER — gunakan Supabase access_token sebagai Bearer
// cache: "no-store" → selalu fresh, tidak pernah di-serve dari cache ISR
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
      cache: "no-store", // SSR: selalu reflect data DB terbaru
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC DATA LOADER — yang ditunggu oleh <Suspense>
// Fetch paralel, tidak ada waterfall
// ─────────────────────────────────────────────────────────────────────────────
async function InterviewsData({ token }: { token: string }) {
  const [interviews, shortlisted] = await Promise.all([
    fetchWithToken<Interview[]>("/api/interviews", token),
    fetchWithToken<ShortlistedCandidate[]>(
      "/api/interviews/shortlisted",
      token,
    ),
  ]);

  return (
    <InterviewsClient
      initialInterviews={interviews ?? []}
      initialShortlisted={shortlisted ?? []}
      token={token}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE METADATA
// ─────────────────────────────────────────────────────────────────────────────
export const metadata = {
  title: "Interview Schedule | HR Dashboard",
  description: "Manage and schedule candidate interviews",
};

// force-dynamic: halaman ini per-user, jangan pernah di-cache di ISR/SSG
export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — async RSC, ambil session Supabase dulu lalu render
// ─────────────────────────────────────────────────────────────────────────────
export default async function InterviewsPage() {
  // Ambil Supabase session dari cookies request
  const session = await getSupabaseSession();

  // Guard: belum login → redirect ke halaman login
  if (!session?.access_token) {
    redirect("/login");
  }

  const token = session.access_token;

  return (
    <Suspense fallback={<InterviewsPageSkeleton />}>
      <InterviewsData token={token} />
    </Suspense>
  );
}
