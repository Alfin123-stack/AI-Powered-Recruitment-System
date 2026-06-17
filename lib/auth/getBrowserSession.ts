// ─── lib/getBrowserSession.ts ─────────────────────────────────────────────────
// CLIENT-SIDE ONLY — browser cookie via Supabase browser client.
// Mirror dari getServerSession.ts tapi untuk client.
// Jangan di-import dari RSC / Route Handler / Server Action.

import { supabase } from "@/lib/supabase";

/**
 * getBrowserSession
 * ─────────────────────────────────────────────────────────────────────────────
 * Membaca session aktif dari cookie pada sisi browser.
 * Reusable di seluruh hooks/komponen client yang membutuhkan token segar.
 *
 * @returns Session | null
 */
export async function getBrowserSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
