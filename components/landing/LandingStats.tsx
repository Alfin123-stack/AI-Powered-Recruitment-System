import { LandingFadeIn } from "./LandingFadeIn";
import { LandingCounter } from "./LandingCounter";
import { STATS } from "@/constants/main/landing";

export function LandingStats() {
  return (
    <section className="py-14 bg-[#0f1612] border-y border-emerald-500/[0.08]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <LandingFadeIn key={i} delay={i * 0.1} className="text-center">
              <div
                className="font-syne font-extrabold text-[2.4rem] leading-none mb-1"
                style={{ color: s.color }}>
                <LandingCounter to={s.value} suffix={s.suffix} />
              </div>
              <p className="text-[#7a9585] text-[0.82rem]">{s.label}</p>
            </LandingFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
