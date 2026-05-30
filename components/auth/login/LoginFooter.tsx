// @/components/auth/login/LoginFooter.tsx
// Rendering Strategy: Server Component (statis)
// Alasan: Konten sepenuhnya statis (link register + security badges).
// Tidak ada state, tidak ada event — zero JS bundle contribution.

import Link            from "next/link";
import { MobileLogo }  from "@/components/auth/MobileLogo";
import { SecurityBadges } from "@/components/auth/SecurityBadges";

export function LoginFooter() {
  return (
    <>
      {/* Logo mobile — tampil hanya di layar kecil via CSS */}
      <div className="mb-6">
        <MobileLogo />
      </div>

      {/* CTA daftar */}
      <p className="text-center mt-6 text-[0.83rem] text-[#5a7a6a]">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
        >
          Daftar gratis →
        </Link>
      </p>

      {/* Security badges — trust signals statis */}
      <div className="mt-6">
        <SecurityBadges />
      </div>
    </>
  );
}
