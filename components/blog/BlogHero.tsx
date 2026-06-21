import { BookOpen } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="pt-[100px] pb-16 relative overflow-hidden">
      {/* Background grid + radial glow — pure CSS, no JS */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse,rgba(16,185,129,0.07)_0%,transparent_70%)]" />

      <div className="max-w-[1180px] mx-auto px-6 relative">
        {/* CSS animation replaces framer-motion — no client JS needed */}
        <div className="max-w-[640px] animate-[fadeInUp_0.65s_ease-out_both]">


          <h1 className="font-syne font-extrabold text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.1] tracking-tight mb-5">
            The Latest Tips, Trends, and{" "}
            <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Career Insights
            </span>
          </h1>

          <p className="text-[#7a9585] text-[1rem] leading-[1.72] max-w-[520px]">
            Editor-curated articles from RecruitAI on CV tips, industry
            trends, and career strategy — plus the latest content from the
            global developer community via dev.to.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
