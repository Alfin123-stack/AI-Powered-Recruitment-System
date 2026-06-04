import Link from "next/link";
import { SecurityBadges } from "@/components/auth/SecurityBadges";

export function RegisterFormFooter() {
  return (
    <>
      <p className="text-center mt-6 text-[0.83rem] text-[#5a7a6a]">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
          Masuk di sini →
        </Link>
      </p>

      <p className="text-center text-[0.7rem] text-[#2e4a3a] leading-relaxed mt-3">
        Dengan mendaftar, Anda menyetujui{" "}
        <Link
          href="/terms"
          className="text-[#4a6b58] hover:text-emerald-400 transition-colors underline underline-offset-2">
          Syarat & Ketentuan
        </Link>{" "}
        serta{" "}
        <Link
          href="/privacy"
          className="text-[#4a6b58] hover:text-emerald-400 transition-colors underline underline-offset-2">
          Kebijakan Privasi
        </Link>{" "}
        kami.
      </p>

      <div className="mt-5">
        <SecurityBadges />
      </div>
    </>
  );
}
