import { createSupabaseServerClient } from "./supabaseServer";

/**
 * getServerSession
 * ─────────────────────────────────────────────────────────────────────────────
 * Membaca session aktif dari cookie pada sisi server (RSC / Route Handler).
 * Reusable di seluruh page/layout yang membutuhkan auth-check server-side.
 *
 * @returns Session | null
 */
export async function getServerSession() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
