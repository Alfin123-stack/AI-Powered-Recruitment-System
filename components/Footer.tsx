import Link from "next/link";
import {
  FileText,
  Shield,
  Sparkles,
  Brain,
  Building2,
  Search,
} from "lucide-react";
export function Footer() {
  return (
    <footer className="bg-[#0a0f0d] border-t border-emerald-500/10 pt-14 pb-8">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* HR strip */}
        <div className="flex items-center justify-between gap-6 flex-wrap bg-emerald-500/[0.05] border border-emerald-500/15 rounded-[14px] px-7 py-5 mb-14">
          <div>
            <p className="font-syne font-bold text-[0.95rem] text-[#e8f0ec] mb-[3px]">
              Kamu dari tim HR atau perusahaan?
            </p>
            <p className="text-[#7a9585] text-[0.82rem]">
              Hubungi kami untuk akses dashboard rekrutmen dan mulai terima
              lamaran dengan analisis AI.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex items-center gap-2 border border-emerald-500/35 text-emerald-400 hover:bg-emerald-500/[0.08] px-5 py-[9px] rounded-[9px] no-underline text-[0.84rem] font-semibold transition-all whitespace-nowrap flex-shrink-0">
            <Building2 size={14} /> Hubungi Kami
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 mb-12 [grid-template-columns:2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-syne font-extrabold text-[1.15rem] mb-3 text-[#e8f0ec]">
              <Sparkles size={16} className="text-emerald-400" />
              RecruitAI
            </div>
            <p className="text-[#7a9585] text-[0.855rem] leading-[1.72] max-w-[270px] mb-5">
              Platform rekrutmen berbasis kecerdasan buatan. Membantu kandidat
              tampil lebih baik dan perusahaan menemukan talenta yang tepat.
            </p>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-2 text-[#4a6b58] text-[0.78rem]">
                <Brain size={13} className="text-emerald-700" />
                Didukung model AI generatif terkini
              </div>
              <div className="flex items-center gap-2 text-[#4a6b58] text-[0.78rem]">
                <Shield size={13} className="text-emerald-700" />
                Dibuat di Indonesia, untuk pasar lokal
              </div>
            </div>
          </div>

          <nav>
            <div className="font-syne font-bold text-[0.82rem] tracking-[0.07em] uppercase text-[#c8d9d0] mb-4">
              Platform
            </div>
            <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
              {[
                {
                  label: "Analisis CV",
                  href: "/analyze",
                  icon: <FileText size={12} />,
                },
                {
                  label: "Cari Lowongan",
                  href: "/jobs",
                  icon: <Search size={12} />,
                },
                {
                  label: "Direktori Perusahaan",
                  href: "/company",
                  icon: <Building2 size={12} />,
                },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[#7a9585] text-[0.855rem] no-underline hover:text-emerald-400 transition-colors flex items-center gap-[7px]">
                    <span className="opacity-55">{l.icon}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <div className="font-syne font-bold text-[0.82rem] tracking-[0.07em] uppercase text-[#c8d9d0] mb-4">
              Informasi
            </div>
            <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
              {[
                { label: "Pertanyaan Umum", href: "/faq" },
                { label: "Hubungi Kami", href: "/contact" },
                { label: "Kebijakan Privasi", href: "/privacy" },
                { label: "Syarat & Ketentuan", href: "/terms" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[#7a9585] text-[0.855rem] no-underline hover:text-emerald-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-emerald-500/10 pt-6 flex justify-between items-center flex-wrap gap-3">
          <p className="text-[#4a6b58] text-[0.775rem]">
            © 2025 RecruitAI. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-[6px] text-[#4a6b58] text-[0.775rem]">
              <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 inline-block" />
              Semua sistem berjalan normal
            </span>
            <Link
              href="/privacy"
              className="text-[#4a6b58] text-[0.775rem] no-underline hover:text-[#7a9585] transition-colors">
              Privasi
            </Link>
            <Link
              href="/terms"
              className="text-[#4a6b58] text-[0.775rem] no-underline hover:text-[#7a9585] transition-colors">
              Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
