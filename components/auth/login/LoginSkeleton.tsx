// @/components/auth/login/LoginSkeleton.tsx
// Semua skeleton untuk halaman login ada di satu file ini.
// Dipakai sebagai fallback Suspense di page.tsx.
// Tidak ada "use client" — skeleton adalah pure Server Component (no interactivity).

// ─── Atom: blok shimmer dasar ─────────────────────────────────────────────

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-[#1e3328]/60",
        className,
      ].join(" ")}
    />
  );
}

// ─── LoginHeaderSkeleton ─────────────────────────────────────────────────
// Meniru: badge "Masuk ke akun" + h2 + paragraf deskripsi

export function LoginHeaderSkeleton() {
  return (
    <div className="mb-8" aria-hidden="true">
      {/* Badge */}
      <Shimmer className="mb-3 h-[22px] w-[130px] rounded-full" />

      {/* Judul h2 — dua baris */}
      <Shimmer className="mb-2 h-[34px] w-[75%]" />
      <Shimmer className="mb-2 h-[34px] w-[55%]" />

      {/* Paragraf deskripsi */}
      <Shimmer className="mt-3 h-[14px] w-[90%]" />
      <Shimmer className="mt-2 h-[14px] w-[70%]" />
    </div>
  );
}

// ─── LoginFormSkeleton ────────────────────────────────────────────────────
// Meniru: tombol Google + divider + field email + field password + tombol submit

export function LoginFormSkeleton() {
  return (
    <div aria-hidden="true">
      {/* Tombol Google */}
      <Shimmer className="h-[46px] w-full rounded-[11px]" />

      {/* Divider "atau masuk dengan email" */}
      <div className="my-5 flex items-center gap-3">
        <Shimmer className="h-px flex-1" />
        <Shimmer className="h-[12px] w-[160px]" />
        <Shimmer className="h-px flex-1" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Field Email */}
        <div className="flex flex-col gap-[6px]">
          <Shimmer className="h-[11px] w-[40px]" /> {/* label */}
          <Shimmer className="h-[46px] w-full rounded-[10px]" /> {/* input */}
        </div>

        {/* Field Password + link Lupa Password */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <Shimmer className="h-[11px] w-[55px]" /> {/* label */}
            <Shimmer className="h-[11px] w-[90px]" /> {/* lupa password */}
          </div>
          <Shimmer className="h-[46px] w-full rounded-[10px]" /> {/* input */}
        </div>

        {/* Tombol submit */}
        <Shimmer className="mt-1 h-[46px] w-full rounded-[11px]" />
      </div>
    </div>
  );
}

// ─── LoginFooterSkeleton ──────────────────────────────────────────────────
// Meniru: MobileLogo + teks "Belum punya akun?" + SecurityBadges

export function LoginFooterSkeleton() {
  return (
    <div aria-hidden="true">
      {/* MobileLogo placeholder */}
      <Shimmer className="mb-6 h-[28px] w-[120px] mx-auto rounded-lg" />

      {/* Teks CTA daftar */}
      <div className="mt-6 flex justify-center gap-2">
        <Shimmer className="h-[13px] w-[130px]" />
        <Shimmer className="h-[13px] w-[80px]" />
      </div>

      {/* SecurityBadges — 3 badge kecil horizontal */}
      <div className="mt-6 flex justify-center gap-4">
        <Shimmer className="h-[20px] w-[64px] rounded-full" />
        <Shimmer className="h-[20px] w-[64px] rounded-full" />
        <Shimmer className="h-[20px] w-[64px] rounded-full" />
      </div>
    </div>
  );
}
