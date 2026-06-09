import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FEATURES } from "@/constants/landing";
import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";
import { LandingCard } from "./LandingCard";

export function LandingFeatures() {
  return (
    <section className="py-[100px] bg-[#0f1612]">
      <div className="max-w-[1180px] mx-auto px-6">
        <LandingFadeIn className="text-center mb-[60px]">
          <LandingTag>Fitur Utama</LandingTag>
          <h2 className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
            Semua yang Anda Butuhkan, Dalam Satu Platform
          </h2>
          <p className="text-[#7a9585] max-w-[520px] mx-auto leading-[1.7]">
            Dari analisis CV untuk kandidat hingga dashboard rekrutmen untuk HR
            — semua tersedia dan terintegrasi.
          </p>
        </LandingFadeIn>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
          {FEATURES.map((f, i) => (
            <LandingFadeIn key={i} delay={i * 0.1}>
              <LandingCard className="h-full flex flex-col">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                  style={{ background: `${f.color}15`, color: f.color }}>
                  {f.icon}
                </div>
                <span
                  className="inline-block px-[10px] py-[3px] rounded-[4px] text-[0.68rem] font-semibold tracking-[0.08em] uppercase mb-3"
                  style={{
                    background: `${f.color}15`,
                    color: f.color,
                    border: `1px solid ${f.color}30`,
                  }}>
                  {f.badge}
                </span>
                <h3 className="font-syne font-bold text-[1.05rem] mb-[10px]">
                  {f.title}
                </h3>
                <p className="text-[#7a9585] text-[0.875rem] leading-[1.65] mb-4 flex-1">
                  {f.desc}
                </p>
                <ul className="flex flex-col gap-[6px] mb-4">
                  {f.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[#7a9585] text-[0.82rem]">
                      <CheckCircle2
                        size={14}
                        className="flex-shrink-0 mt-[1px]"
                        style={{ color: f.color }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={f.href}
                  className="mt-auto text-[0.78rem] font-semibold flex items-center gap-1 transition-colors"
                  style={{ color: f.color }}>
                  Coba fitur ini <ArrowRight size={13} />
                </Link>
              </LandingCard>
            </LandingFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
