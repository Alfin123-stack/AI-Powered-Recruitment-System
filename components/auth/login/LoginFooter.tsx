// @/components/auth/login/LoginFooter.tsx
// Rendering Strategy: Server Component (static)
// Reason: Content is fully static (register link + security badges).
// No state, no events — zero JS bundle contribution.

import Link            from "next/link";
import { MobileLogo }  from "@/components/auth/MobileLogo";
import { SecurityBadges } from "@/components/auth/SecurityBadges";

export function LoginFooter() {
  return (
    <>
      {/* Mobile logo — shown only on small screens via CSS */}
      <div className="mb-6">
        <MobileLogo />
      </div>

      {/* Sign-up CTA */}
      <p className="text-center mt-6 text-[0.83rem] text-[#5a7a6a]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
        >
          Sign up free →
        </Link>
      </p>

      {/* Security badges — static trust signals */}
      <div className="mt-6">
        <SecurityBadges />
      </div>
    </>
  );
}
