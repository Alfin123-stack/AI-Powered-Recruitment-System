// lib/auth/getUserRole.ts
// ─────────────────────────────────────────────
// Helper reusable untuk membaca role user dari DB.
// Tabel `users` adalah source of truth (sesuai proxy.ts),
// bukan user_metadata / app_metadata dari Supabase Auth.
// ─────────────────────────────────────────────

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { UserRole } from "@/types/profile";

export async function getUserRole(userId: string): Promise<UserRole> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only di Server Component
      },
    },
  );

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role === "hr" ? "hr" : "candidate";
}
