"use client";

import { useState } from "react";

import { Plus } from "lucide-react";
import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";
import { FAQS } from "@/constants/main/landing";

export function LandingFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-[100px] bg-[#0f1612]">
      <div className="max-w-[760px] mx-auto px-6">
        <LandingFadeIn className="text-center mb-[56px]">
          <LandingTag>FAQ</LandingTag>
          <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
            Pertanyaan yang Sering Diajukan
          </h2>
        </LandingFadeIn>

        <dl>
          {FAQS.map((f, i) => (
            <LandingFadeIn key={i} delay={i * 0.06}>
              <div className="border-b border-emerald-500/15">
                <dt>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full bg-transparent border-0 text-[#e8f0ec] font-syne font-semibold text-[1rem] py-[22px] text-left flex justify-between items-center gap-4 cursor-pointer hover:text-emerald-400 transition-colors">
                    <span>{f.q}</span>
                    <Plus
                      size={18}
                      className={`text-emerald-400 flex-shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-45" : "rotate-0"
                      }`}
                    />
                  </button>
                </dt>
                <dd
                  className="overflow-hidden transition-[max-height,padding] duration-[400ms,300ms] ease-[ease]"
                  style={{
                    maxHeight: openFaq === i ? 300 : 0,
                    paddingBottom: openFaq === i ? 20 : 0,
                  }}>
                  <p className="text-[#7a9585] leading-[1.7] text-[0.95rem]">
                    {f.a}
                  </p>
                </dd>
              </div>
            </LandingFadeIn>
          ))}
        </dl>
      </div>
    </section>
  );
}
