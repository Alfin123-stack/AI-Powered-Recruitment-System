// app/(auth)/login/page.tsx
// Rendering Strategy: SSR (Server-Side Rendering)
// Alasan: Halaman login perlu redirect cepat di server jika session sudah ada,
// dan tidak ada data yang perlu di-cache (ISG/SSG tidak cocok untuk auth page).

import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

import { LoginHeader } from "@/components/auth/login/LoginHeader";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { LoginFooter } from "@/components/auth/login/LoginFooter";
import {
  LoginHeaderSkeleton,
  LoginFormSkeleton,
  LoginFooterSkeleton,
} from "@/components/auth/login/LoginSkeleton";

// SSR: cek session di server sebelum render — cegah flash konten
async function getServerSession() {
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

// Metadata statis — tidak perlu fetch, cocok di-generate build time (SSG)
export const metadata = {
  title: "Masuk | RecruitAI",
  description: "Masuk ke dashboard rekrutmen dan mulai analisis CV Anda.",
};

export default async function LoginPage() {
  // SSR: redirect server-side agar tidak ada flicker
  const session = await getServerSession();
  if (session) {
    const role = session.user.user_metadata?.role;
    redirect(role === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
  }

  return (
    <div className="w-full">
      {/*
       * Suspense dipakai di sini untuk membungkus bagian yang mungkin
       * bergantung pada data async (misal: A/B flag, feature flag dari server).
       * Saat ini LoginHeader & LoginFooter adalah pure Server Components,
       * namun Suspense boundary sudah siap jika nanti ada async data di dalamnya.
       */}

      {/* Header: Server Component, statis — render langsung */}
      <Suspense fallback={<LoginHeaderSkeleton />}>
        <LoginHeader />
      </Suspense>

      {/*
       * LoginForm: Client Component (CSR)
       * Alasan: butuh useState, event handler, router.push — harus di client.
       * Dibungkus Suspense dengan skeleton agar tidak ada layout shift.
       */}
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>

      {/* Footer: Server Component, statis */}
      <Suspense fallback={<LoginFooterSkeleton />}>
        <LoginFooter />
      </Suspense>
    </div>
  );
}
