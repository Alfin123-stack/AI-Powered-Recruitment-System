// @/components/hr/calendar/CalendarServer.tsx
// Server Component — fetch data interviews via API route internal + Supabase SSR auth
//
// KENAPA pakai API route, bukan Supabase direct join?
// Kode asli sebelum refactor pakai: apiFetch("/api/interviews", token)
// → artinya ada API route yang sudah handle join tabel (interviews + applications +
//   job_postings + users). Supabase memerlukan foreign key constraint terdefinisi
//   dengan benar di schema agar bisa nested join langsung dari client.
//   Daripada asumsi struktur FK, kita ikuti pola asal: fetch via API route.
//
// Auth flow (sesuai proxy.ts):
// - Supabase createServerClient untuk baca session dari cookie
// - access_token dari session dikirim sebagai Bearer ke API route internal
// - API route verifikasi token dan return data yang sudah di-join

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarClient } from "./CalendarClient";
import type { Interview } from "./types";

// ─── Supabase server client (pola identik dengan proxy.ts) ───────────────────
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
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}

// ─── Fetch via API route internal (sama persis dengan pola kode asli) ─────────
// ISR: Next.js cache fetch ini, revalidasi otomatis tiap 60 detik
async function fetchInterviews(accessToken: string): Promise<Interview[]> {
  try {
    // Gunakan NEXT_PUBLIC_APP_URL jika ada, fallback ke localhost
    // Wajib absolute URL karena ini berjalan di server (bukan browser)
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/interviews`, {
      headers: {
        // Kirim Supabase access_token sebagai Bearer
        // API route kamu sudah terima format ini (sesuai apiFetch di kode asli)
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // ISR: Next.js cache hasil fetch ini di server
      // Setelah 60 detik, request berikutnya akan trigger revalidasi background
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(
        `[CalendarServer] API route error: ${res.status} ${res.statusText}`,
      );
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? (data as Interview[]) : [];
  } catch (err) {
    console.error("[CalendarServer] fetch error:", err);
    return [];
  }
}

// ─── SERVER COMPONENT ─────────────────────────────────────────────────────────
export async function CalendarServer() {
  const supabase = await createSupabaseServer();

  // Ambil session dari cookie Supabase (sesuai pola proxy.ts)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Safety net — middleware sudah guard, tapi double-check di sini
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verifikasi role dari DB (identik dengan logika proxy.ts)
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!userData || userData.role !== "hr") {
    redirect("/dashboard/candidate");
  }

  // Fetch data via API route internal menggunakan access_token Supabase
  // access_token inilah yang sebelumnya disebut "token" di useDashboard()
  const interviews = await fetchInterviews(session.access_token);

  return <CalendarClient interviews={interviews} />;
}
