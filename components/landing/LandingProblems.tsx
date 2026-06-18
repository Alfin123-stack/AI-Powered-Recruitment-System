import { CheckCircle2 } from "lucide-react";
import { PROBLEMS } from "@/constants/main/landing";
import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";
import { LandingCard } from "./LandingCard";

export function LandingProblems() {
  return (
    <section className="py-[100px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1 mb-[80px]">
          <LandingFadeIn
            y={20}
            className="relative h-[380px] max-lg:order-last rounded-[20px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/60 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-emerald-900/15 z-[5] mix-blend-multiply" />
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              alt="Analisis data rekrutmen"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 right-6 z-20 bg-[#0a0f0d]/90 border border-amber-500/30 backdrop-blur-sm rounded-[12px] px-4 py-3">
              <p className="text-[0.65rem] text-[#7a9585] mb-1">
                Efisiensi Rekrutmen
              </p>
              <p className="text-[0.9rem] font-bold text-amber-400">
                +65% lebih cepat
              </p>
            </div>
          </LandingFadeIn>

          <LandingFadeIn delay={0.1}>
            <LandingTag>Mengapa RecruitAI</LandingTag>
            <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] mt-4 mb-5">
              Rekrutmen Konvensional Sudah Tidak Cukup
            </h2>
            <p className="text-[#7a9585] text-[0.95rem] leading-[1.78] mb-6">
              Proses screening CV manual memakan waktu berjam-jam per hari,
              rentan bias, dan tidak konsisten. Di sisi lain, kandidat kompeten
              sering gagal di seleksi awal hanya karena CV mereka tidak
              dioptimalkan untuk sistem ATS — bukan karena mereka tidak layak.
            </p>
            <p className="text-[#7a9585] text-[0.95rem] leading-[1.78] mb-6">
              RecruitAI hadir untuk memecahkan gap ini: memberikan kandidat
              analisis CV yang objektif dan rekomendasi konkret, sekaligus
              membantu HR memilah ratusan pelamar dengan efisien berbasis data.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "73% HR menghabiskan lebih dari 6 jam/hari untuk screening manual",
                "75% CV berkualitas gagal di seleksi ATS sebelum dibaca HR",
                "62% keputusan hiring masih dipengaruhi bias tidak disadari",
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 flex-shrink-0 mt-[2px]"
                  />
                  <span className="text-[#7a9585] text-[0.88rem] leading-[1.6]">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </LandingFadeIn>
        </div>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {PROBLEMS.map((p, i) => (
            <LandingFadeIn key={i} delay={i * 0.12}>
              <LandingCard className="h-full flex flex-col">
                <div className="text-emerald-400 mb-4">{p.icon}</div>
                <h3 className="font-syne font-bold text-[1.05rem] mb-3">
                  {p.title}
                </h3>
                <div className="flex gap-3 items-center bg-emerald-500/[0.07] border border-emerald-500/15 rounded-[10px] px-4 py-3 mb-4">
                  <span className="font-syne text-[1.8rem] font-extrabold text-emerald-400 flex-shrink-0">
                    {p.stat}
                  </span>
                  <span className="text-[#7a9585] text-[0.8rem] leading-[1.4]">
                    {p.statLabel}
                  </span>
                </div>
                <p className="text-[#7a9585] text-[0.9rem] leading-[1.65]">
                  {p.desc}
                </p>
              </LandingCard>
            </LandingFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
