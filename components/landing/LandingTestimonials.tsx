import { Star } from "lucide-react";
import { FadeIn, Tag } from "./landing-components";
import { TESTIMONIALS } from "./landing-types";

export function LandingTestimonials() {
  return (
    <section className="py-[100px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <FadeIn className="text-center mb-[60px]">
          <Tag>Testimoni</Tag>
          <h2 className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
            Dipercaya Kandidat & Tim HR
          </h2>
          <p className="text-[#7a9585] max-w-[480px] mx-auto leading-[1.7] text-[0.95rem]">
            Dari pencari kerja yang akhirnya lolos seleksi awal hingga rekruter
            yang mempersingkat proses shortlist dari hari ke jam.
          </p>
        </FadeIn>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <article className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 flex flex-col gap-5 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-[2px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] h-full">
                <div className="flex items-center justify-between">
                  <div className="flex gap-[3px]">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <span
                    className="text-[0.65rem] font-bold tracking-[0.08em] uppercase px-[10px] py-[3px] rounded-[4px]"
                    style={{
                      background: `${t.color}12`,
                      color: t.color,
                      border: `1px solid ${t.color}25`,
                    }}>
                    {t.tag}
                  </span>
                </div>

                <blockquote className="text-[#c8d9d0] text-[0.88rem] leading-[1.75] flex-1">
                  <span className="text-emerald-400 text-[1.4rem] font-syne leading-none mr-1">
                    "
                  </span>
                  {t.quote}
                  <span className="text-emerald-400 text-[1.4rem] font-syne leading-none ml-1">
                    "
                  </span>
                </blockquote>

                <footer className="flex items-center gap-3 pt-1 border-t border-emerald-500/10">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-extrabold text-[0.78rem] flex-shrink-0"
                    style={{ background: `${t.color}18`, color: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-syne font-bold text-[0.88rem]">
                      {t.name}
                    </div>
                    <div className="text-[#7a9585] text-[0.75rem]">
                      {t.role}
                    </div>
                    <div className="text-[#7a9585] text-[0.72rem] opacity-70">
                      {t.company}
                    </div>
                  </div>
                </footer>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
