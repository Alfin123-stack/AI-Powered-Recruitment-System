import Image from "next/image";
import {
  CheckCircle2,
  Sparkles,
  Target,
  Search,
  ArrowRight,
} from "lucide-react";
import { STEPS } from "@/constants/main/landing";
import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";

export function LandingHowItWorks() {
  return (
    <section className="py-[100px] bg-[#0f1612]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1 mb-[80px]">
          <LandingFadeIn>
            <LandingTag>How It Works</LandingTag>
            <h2 className="font-syne font-extrabold mt-4 mb-5 leading-[1.15] text-[clamp(1.8rem,3vw,2.4rem)]">
              From Upload to Insight in 30 Seconds
            </h2>
            <p className="text-[#7a9585] leading-[1.7] text-[0.95rem]">
              A fully automated process from start to finish: your CV content is read
              and sent to our AI system for analysis, then the results are displayed
              instantly and saved to your account.
            </p>
          </LandingFadeIn>
          <LandingFadeIn
            delay={0.1}
            className="relative h-[260px] rounded-[20px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1612]/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-cyan-900/20 z-[5] mix-blend-multiply" />
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"
              alt="AI data analysis"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </LandingFadeIn>
        </div>

        <div className="grid gap-20 items-start [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
          <ol className="flex flex-col">
            {STEPS.map((s, i) => (
              <LandingFadeIn key={i} delay={i * 0.1}>
                <li
                  className="flex gap-5 relative"
                  style={{ paddingBottom: i < STEPS.length - 1 ? 32 : 0 }}>
                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute left-[23px] w-[2px] bg-gradient-to-b from-emerald-500 to-transparent"
                      style={{ top: 48, bottom: -28 }}
                    />
                  )}
                  <div className="w-[46px] h-[46px] rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 z-10">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-emerald-400 font-semibold tracking-[0.1em] mb-1">
                      {s.num}
                    </div>
                    <h3 className="font-syne font-bold text-[1rem] mb-[6px]">
                      {s.title}
                    </h3>
                    <p className="text-[#7a9585] text-[0.875rem] leading-[1.6]">
                      {s.desc}
                    </p>
                  </div>
                </li>
              </LandingFadeIn>
            ))}
          </ol>

          <LandingFadeIn delay={0.2}>
            <div className="bg-[#0a0f0d] border border-emerald-500/15 rounded-[20px] p-7 shadow-[0_0_80px_rgba(16,185,129,0.1)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[0.72rem] text-[#7a9585] mb-1">
                    CV ANALYSIS REPORT
                  </div>
                  <div className="font-syne font-bold text-[1.1rem]">
                    Arif Pratama
                  </div>
                  <div className="text-[#7a9585] text-[0.82rem]">
                    Frontend Developer
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-[8px] px-3 py-[6px] text-[0.72rem] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Analysis Complete
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Resume Score", val: 82, color: "#10b981" },
                  { label: "ATS Score", val: 76, color: "#8b5cf6" },
                  { label: "Overall", val: 79, color: "#f59e0b" },
                ].map((ring, i) => (
                  <div
                    key={i}
                    className="bg-[#141f19] rounded-[12px] p-3 text-center">
                    <div
                      className="w-[70px] h-[70px] rounded-full flex items-center justify-center relative mx-auto mb-2"
                      style={{
                        background: `conic-gradient(${ring.color} 0% ${ring.val}%, rgba(255,255,255,0.06) ${ring.val}%)`,
                      }}>
                      <div className="absolute w-[52px] h-[52px] rounded-full bg-[#141f19]" />
                      <span
                        className="relative z-10 font-syne text-[1rem] font-extrabold"
                        style={{ color: ring.color }}>
                        {ring.val}
                      </span>
                    </div>
                    <div className="text-[0.65rem] text-[#7a9585]">
                      {ring.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="text-[0.72rem] text-[#7a9585] mb-2 flex items-center gap-1">
                  <Search size={10} /> DETECTED SKILLS
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Node.js",
                    "SQL",
                    "Git",
                    "REST API",
                    "TailwindCSS",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-[6px] text-[0.75rem] font-medium font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-[10px] px-4 py-[14px] mb-4">
                <div className="text-[0.72rem] text-amber-400 font-semibold mb-2 flex items-center gap-1">
                  <Sparkles size={10} /> IMPROVEMENT RECOMMENDATIONS
                </div>
                <ul className="list-disc pl-4 text-[#7a9585] text-[0.8rem] leading-[1.7]">
                  <li>
                    Add quantitative figures to achievements (e.g.
                    &ldquo;improved performance by 40%&rdquo;)
                  </li>
                  <li>
                    The summary section needs to be strengthened with a clear
                    value proposition
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-[10px] px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[0.72rem] text-emerald-400 font-semibold mb-[2px] flex items-center gap-1">
                    <Target size={10} /> MATCHING JOBS AVAILABLE
                  </div>
                  <div className="text-[0.72rem] text-[#7a9585]">
                    Based on 8 detected skills
                  </div>
                </div>
                <div className="text-[0.75rem] text-emerald-400 font-bold whitespace-nowrap flex items-center gap-1">
                  View Jobs <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </LandingFadeIn>
        </div>
      </div>
    </section>
  );
}
