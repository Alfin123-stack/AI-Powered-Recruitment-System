// @/components/auth/login/LoginSkeleton.tsx
// All skeletons for the login page live in this single file.
// Used as the Suspense fallback in page.tsx.
// No "use client" — the skeleton is a pure Server Component (no interactivity).

// ─── Atom: base shimmer block ─────────────────────────────────────────────

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
// Mimics: the "Sign in to your account" badge + h2 + description paragraph

export function LoginHeaderSkeleton() {
  return (
    <div className="mb-8" aria-hidden="true">
      {/* Badge */}
      <Shimmer className="mb-3 h-[22px] w-[130px] rounded-full" />

      {/* h2 title — two lines */}
      <Shimmer className="mb-2 h-[34px] w-[75%]" />
      <Shimmer className="mb-2 h-[34px] w-[55%]" />

      {/* Description paragraph */}
      <Shimmer className="mt-3 h-[14px] w-[90%]" />
      <Shimmer className="mt-2 h-[14px] w-[70%]" />
    </div>
  );
}

// ─── LoginFormSkeleton ────────────────────────────────────────────────────
// Mimics: Google button + divider + email field + password field + submit button

export function LoginFormSkeleton() {
  return (
    <div aria-hidden="true">
      {/* Google button */}
      <Shimmer className="h-[46px] w-full rounded-[11px]" />

      {/* "or sign in with email" divider */}
      <div className="my-5 flex items-center gap-3">
        <Shimmer className="h-px flex-1" />
        <Shimmer className="h-[12px] w-[160px]" />
        <Shimmer className="h-px flex-1" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Email field */}
        <div className="flex flex-col gap-[6px]">
          <Shimmer className="h-[11px] w-[40px]" /> {/* label */}
          <Shimmer className="h-[46px] w-full rounded-[10px]" /> {/* input */}
        </div>

        {/* Password field + Forgot password link */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <Shimmer className="h-[11px] w-[55px]" /> {/* label */}
            <Shimmer className="h-[11px] w-[90px]" /> {/* forgot password */}
          </div>
          <Shimmer className="h-[46px] w-full rounded-[10px]" /> {/* input */}
        </div>

        {/* Submit button */}
        <Shimmer className="mt-1 h-[46px] w-full rounded-[11px]" />
      </div>
    </div>
  );
}

// ─── LoginFooterSkeleton ──────────────────────────────────────────────────
// Mimics: MobileLogo + "Don't have an account?" text + SecurityBadges

export function LoginFooterSkeleton() {
  return (
    <div aria-hidden="true">
      {/* MobileLogo placeholder */}
      <Shimmer className="mb-6 h-[28px] w-[120px] mx-auto rounded-lg" />

      {/* Sign-up CTA text */}
      <div className="mt-6 flex justify-center gap-2">
        <Shimmer className="h-[13px] w-[130px]" />
        <Shimmer className="h-[13px] w-[80px]" />
      </div>

      {/* SecurityBadges — 3 small horizontal badges */}
      <div className="mt-6 flex justify-center gap-4">
        <Shimmer className="h-[20px] w-[64px] rounded-full" />
        <Shimmer className="h-[20px] w-[64px] rounded-full" />
        <Shimmer className="h-[20px] w-[64px] rounded-full" />
      </div>
    </div>
  );
}
