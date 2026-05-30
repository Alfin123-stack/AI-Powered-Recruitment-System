// app/(auth)/register/page.tsx
//
// Rendering strategy:
//   • SSR  — halaman ini di-render di server setiap request.
//             Kita cek session user langsung di server sehingga user yang
//             sudah login tidak sempat melihat halaman register.
//   • CSR  — RegisterForm adalah Client Component ("use client") yang
//             menghandle seluruh interaktivitas multi-step form.
//   • Suspense + Skeleton — Saat RegisterForm hydrating, skeleton ditampilkan
//             sebagai fallback sehingga tidak ada layout shift.
//   • ISR/SSG tidak dipakai di sini karena halaman auth bersifat
//             per-request (session-dependent), bukan static.

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { RegisterSkeleton } from "@/components/auth/register/RegisterSkeleton";

// Force SSR — jangan cache halaman ini
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ── Metadata ───────────────────────────────────────────────────────────────────
export const metadata = {
  title: "Daftar — Buat Akun Baru",
  description:
    "Daftar dan mulai analisis CV dengan AI. Gratis untuk kandidat, tidak perlu kartu kredit.",
};

// ── Server-side session guard ──────────────────────────────────────────────────
// Menggunakan pola yang sama persis dengan login page:
//   1. await cookies() — Next.js 15 cookies() mengembalikan Promise
//   2. createServerClient dengan NEXT_PUBLIC_SUPABASE_URL & ANON_KEY eksplisit
//   3. cookies.getAll() diteruskan ke Supabase client (tidak ada setAll karena
//      register page hanya membaca session, tidak menulis cookie baru)
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function RegisterPage() {
  // SSR: cek session di server — redirect sebelum kirim HTML ke client
  // Redirect berbasis role sama seperti login page agar konsisten
  const session = await getServerSession();
  if (session) {
    const role = session.user.user_metadata?.role;
    redirect(role === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
  }

  return (
    <div className="w-full">
      {/*
       * Suspense membungkus RegisterForm.
       *
       * Kenapa? RegisterForm adalah "use client" component yang butuh hydration.
       * Selama hydration berlangsung, React menampilkan <RegisterSkeleton />
       * sebagai fallback sehingga UI tetap terlihat bermakna dan tidak blank.
       *
       * Dengan kombinasi ini kita mendapat:
       *   ✓ Server-rendered HTML (SSR) untuk first paint yang cepat
       *   ✓ Skeleton yang konsisten dengan layout final (no layout shift)
       *   ✓ Progressive enhancement — form langsung interaktif setelah hydration
       */}
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
