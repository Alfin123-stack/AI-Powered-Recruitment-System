import { Target, TrendingUp, Heart } from "lucide-react";
import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";
import { MissionCardItem } from "@/types/main/landing";

const MISSION_CARDS: MissionCardItem[] = [
  {
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    imgAlt: "Team discussing mission",
    overlayColor: "#10b981",
    borderColor: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <Target size={22} className="text-emerald-400" />,
    titleColor: "text-emerald-400",
    title: "Our Mission",
    desc: "To democratize access to a fair and efficient recruitment process — where every qualified candidate has an equal chance to be found, and every company can discover top talent through a faster, more objective, and data-driven process.",
  },
  {
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
    imgAlt: "Vision for the future",
    overlayColor: "#06b6d4",
    borderColor: "border-cyan-500/20",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    icon: <TrendingUp size={22} className="text-cyan-400" />,
    titleColor: "text-cyan-400",
    title: "Our Vision",
    desc: "To become the trusted digital recruitment infrastructure in Indonesia — where AI technology is not a replacement for human judgment, but a tool that empowers HR teams and candidates to make better decisions.",
  },
  {
    img: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=600&q=80",
    imgAlt: "Team values and culture",
    overlayColor: "#f59e0b",
    borderColor: "border-amber-500/20",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    icon: <Heart size={22} className="text-amber-400" />,
    titleColor: "text-amber-400",
    title: "Our Values",
    isValues: true,
    values: [
      "Objectivity without compromise",
      "Transparency in every score",
      "Inclusive for all backgrounds",
      "Innovation centered on the user",
    ],
  },
];

export function LandingMission() {
  return (
    <section className="py-[100px] bg-[#0f1612]">
      <div className="max-w-[1180px] mx-auto px-6">
        <LandingFadeIn className="text-center mb-[60px]">
          <LandingTag>Mission & Vision</LandingTag>
          <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
            What We Stand For
          </h2>
          <p className="text-[#7a9585] max-w-[480px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
            RecruitAI is more than a tool — it's an effort to make recruitment
            fairer and more efficient for everyone.
          </p>
        </LandingFadeIn>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {MISSION_CARDS.map((card, i) => (
            <LandingFadeIn key={i} delay={i * 0.1}>
              <div
                className={`relative bg-[#0a0f0d] border ${card.borderColor} rounded-[20px] overflow-hidden h-full`}>
                <div className="relative h-[160px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0f0d] z-10" />
                  <div
                    className="absolute inset-0 z-[5] mix-blend-multiply opacity-30"
                    style={{ background: card.overlayColor }}
                  />
                  <img
                    src={card.img}
                    alt={card.imgAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 pt-4">
                  <div
                    className={`w-11 h-11 rounded-[12px] border flex items-center justify-center mb-4 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <h3
                    className={`font-syne font-bold text-[1.15rem] mb-3 ${card.titleColor}`}>
                    {card.title}
                  </h3>
                  {card.isValues ? (
                    <div className="flex flex-col gap-2">
                      {card.values.map((v, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2 text-[#7a9585] text-[0.88rem]">
                          <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                          {v}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#7a9585] text-[0.92rem] leading-[1.78]">
                      {card.desc}
                    </p>
                  )}
                </div>
              </div>
            </LandingFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
