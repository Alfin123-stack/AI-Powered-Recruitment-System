// page.tsx — Server Component (SSR + Suspense)
// Route: /dashboard/candidate/applications
//
// Strategi rendering:
//  • SSR        : Semua data di-fetch di server per-request (no-store).
//                 Auth via Supabase SSR — createServerClient dari cookies.
//  • Suspense   : Skeleton tampil instan, konten di-stream setelah data siap.
//  • CSR        : Interaktivitas (tab, search, filter, modal) di ApplicationsClient.
//
// Pola auth mengikuti proxy.ts:
//  1. Buat supabase server client dari cookies()
//  2. Ambil session → dapat access_token untuk hit API backend
//  3. Pastikan role === "candidate" (guard berlapis selain middleware)

import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import StatsBar from "@/components/candidate/applications/StatsBar";
import ApplicationsClient from "@/components/candidate/applications/ApplicationsClient";
import { ApplicationsPageSkeleton } from "@/components/candidate/applications/skeletons";
import {
  Application,
  Interview,
} from "@/components/candidate/applications/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Supabase Server Client ────────────────────────────────────────────────────
// Dibuat ulang di setiap request — pola resmi Supabase SSR untuk App Router

async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Di Server Component read-only — setAll tidak dipakai,
        // tapi wajib ada agar tidak throw. Middleware yang handle cookie refresh.
        setAll() {},
      },
    },
  );
}

// ── Auth Guard ────────────────────────────────────────────────────────────────
// Mengembalikan { userId, accessToken } atau redirect.
// Role sudah divalidasi middleware (proxy.ts), tapi kita double-check di sini
// agar halaman aman meski diakses langsung tanpa lewat middleware.

async function getAuthContext(): Promise<{
  userId: string;
  accessToken: string;
}> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Tidak login → ke halaman login
  if (!session) {
    redirect("/login");
  }

  // Double-check role dari DB (sama seperti yang dilakukan proxy.ts)
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // Jika ternyata HR nyasar masuk sini, redirect ke dashboard HR
  if (userData?.role === "hr") {
    redirect("/dashboard/hr");
  }

  return {
    userId: session.user.id,
    accessToken: session.access_token,
  };
}

// ── Server-side Data Fetching ─────────────────────────────────────────────────
// Menggunakan Supabase access_token sebagai Bearer untuk hit API backend.
// cache: "no-store" — data personal yang sering berubah, tidak boleh di-cache.

async function fetchApplications(accessToken: string): Promise<Application[]> {
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

async function fetchInterviews(accessToken: string): Promise<Interview[]> {
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

// ── Async Content Component ───────────────────────────────────────────────────
// Dipisah dari page() agar bisa dibungkus <Suspense>.
// Next.js hanya bisa streaming komponen async yang ada di dalam Suspense boundary.

async function ApplicationsContent({ accessToken }: { accessToken: string }) {
  // Fetch paralel — tidak sequential — lebih cepat
  const [applications, interviews] = await Promise.all([
    fetchApplications(accessToken),
    fetchInterviews(accessToken),
  ]);

  return (
    <>
      {/* Server Component — dirender di server, tidak kirim JS ke client */}
      <StatsBar applications={applications} interviews={interviews} />

      {/* Client Component — menerima data via props, semua interaksi di browser */}
      <ApplicationsClient applications={applications} interviews={interviews} />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ApplicationsPage() {
  // Auth check — akan redirect jika tidak login atau bukan candidate
  const { accessToken } = await getAuthContext();

  return (
    <div>
      {/*
        Suspense boundary:
        - fallback (skeleton) ditampilkan SEGERA saat HTML pertama dikirim ke browser
        - ApplicationsContent di-stream menyusul setelah Promise.all selesai
        - Hasilnya: tidak ada blank screen, tidak ada loading spinner manual
      */}
      <Suspense fallback={<ApplicationsPageSkeleton />}>
        <ApplicationsContent accessToken={accessToken} />
      </Suspense>
    </div>
  );
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Lamaranku — Dashboard Kandidat",
  description: "Pantau status lamaran dan jadwal interview kamu.",
};
