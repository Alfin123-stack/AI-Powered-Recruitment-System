import Link from "next/link";
import {
  FileText,
  Mail,
  CheckCircle2,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";
import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";

export function LandingCTA() {
  return (
    <section className="py-[100px] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=60"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.04]"
        />
      </div>

      <div className="max-w-[700px] mx-auto px-6 text-center relative">
        <LandingFadeIn>
          <LandingTag>
            <Sparkles size={9} className="animate-pulse" /> Get Started Free
          </LandingTag>
          <h2 className="font-syne font-extrabold mt-6 mb-5 leading-[1.12] text-[clamp(2rem,4vw,3.2rem)]">
            Your CV Is Ready. <br />
            <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Find Out How Strong It Is.
            </span>
          </h2>
          <p className="text-[#7a9585] text-[0.95rem] leading-[1.72] mb-10 max-w-[480px] mx-auto">
            Upload your CV as a PDF and within 30 seconds you'll know your quality
            score, how well it passes automated screening, and which job openings
            best match your profile.
          </p>
          <div className="flex items-center gap-4 justify-center flex-wrap mb-6">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.95rem] px-8 py-[13px] rounded-[11px] no-underline transition-all hover:-translate-y-[2px] hover:shadow-[0_10px_36px_rgba(16,185,129,0.32)]">
              <FileText size={16} /> Analyze My CV Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] text-[0.88rem] px-6 py-[12px] rounded-[10px] no-underline transition-all">
              <Mail size={14} /> Contact Us
            </Link>
          </div>
          <p className="text-[#4a6b58] text-[0.78rem] flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" /> Free for
              candidates
            </span>
            <span className="text-[#2a4035]">·</span>
            <span className="flex items-center gap-1">
              <Zap size={12} className="text-emerald-600" /> Results in 30
              seconds
            </span>
            <span className="text-[#2a4035]">·</span>
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-emerald-600" /> Data safe &
              encrypted
            </span>
          </p>
        </LandingFadeIn>
      </div>
    </section>
  );
}
