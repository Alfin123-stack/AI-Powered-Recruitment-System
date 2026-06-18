// lib/auth/getUserRole.ts
// ─────────────────────────────────────────────
// Helper reusable untuk membaca role user dari DB.
// Tabel `users` adalah source of truth (sesuai proxy.ts),
// bukan user_metadata / app_metadata dari Supabase Auth.
// ─────────────────────────────────────────────

import { createSupabaseServerClient } from "./supabaseServer";
import type { UserRole } from "@/types/main/profile";

export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role === "hr" ? "hr" : "candidate";
}
