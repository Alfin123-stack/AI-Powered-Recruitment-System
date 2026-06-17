// lib/auth/supabaseServer.ts
// ─────────────────────────────────────────────────────────────────────────────
// Factory canonical untuk Supabase server client (RSC / Route Handler / Server Action).
// Cookies read-only — dipakai oleh getServerSession & getUserRole.
// ─────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only di Server Component
      },
    },
  );
}
