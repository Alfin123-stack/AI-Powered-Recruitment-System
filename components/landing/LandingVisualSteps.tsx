import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";

const VISUAL_STEPS = [
  {
    num: "01",
    title: "Upload Your CV",
    desc: "Simply upload your CV as a PDF file. Our system immediately begins extracting and analyzing it automatically — no extra configuration needed.",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=700&q=80",
    alt: "Uploading a CV document",
    reverse: false,
    color: "#10b981",
  },
  {
    num: "02",
    title: "AI Analyzes in Seconds",
    desc: "Our artificial intelligence system reads every section of your CV — extracting skills, experience, and education to produce a comprehensive, objective score.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80",
    alt: "Team discussing and analyzing",
    reverse: true,
    color: "#06b6d4",
  },
  {
    num: "03",
    title: "Find Your Matching Jobs",
    desc: "Based on your CV profile, the platform automatically matches you with hundreds of relevant openings from trusted companies across the country.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80",
    alt: "Candidate landing a job",
    reverse: false,
    color: "#f59e0b",
  },
];

export function LandingVisualSteps() {
  return (
    <section className="py-[100px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <LandingFadeIn className="text-center mb-[60px]">
          <LandingTag>The Real Process</LandingTag>
          <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
            Three Steps That Transform Your Career
          </h2>
          <p className="text-[#7a9585] max-w-[480px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
            From uploading your CV to landing an interview — the process is simple, the results are real.
          </p>
        </LandingFadeIn>

        <div className="flex flex-col gap-16">
          {VISUAL_STEPS.map((step, i) => (
            <LandingFadeIn key={i} delay={0.1}>
              <div className="grid gap-12 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
                <div className={step.reverse ? "order-last max-lg:order-none" : ""}>
                  <div
                    className="font-syne font-extrabold text-[4.5rem] leading-none mb-3 opacity-[0.07]"
                    style={{ color: step.color }}>
                    {step.num}
                  </div>
                  <h3 className="font-syne font-bold text-[1.5rem] text-[#e8f0ec] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#7a9585] text-[0.95rem] leading-[1.78]">{step.desc}</p>
                  <div
                    className="mt-5 w-12 h-[3px] rounded-full"
                    style={{ background: step.color }}
                  />
                </div>
                <div className="relative h-[280px] rounded-[20px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/40 to-transparent z-10" />
                  <div
                    className="absolute inset-0 z-[5] mix-blend-multiply opacity-20"
                    style={{ background: step.color }}
                  />
                  <img
                    src={step.img}
                    alt={step.alt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              </div>
            </LandingFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
