import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * getServerSession
 * ─────────────────────────────────────────────────────────────────────────────
 * Membaca session aktif dari cookie pada sisi server (RSC / Route Handler).
 * Reusable di seluruh page/layout yang membutuhkan auth-check server-side.
 *
 * @returns Session | null
 */
export async function getServerSession() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
