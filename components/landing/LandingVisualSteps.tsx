import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";

const VISUAL_STEPS = [
  {
    num: "01",
    title: "Upload CV kamu",
    desc: "Cukup upload file CV dalam format PDF. Sistem kami langsung memulai proses ekstraksi dan analisis secara otomatis tanpa perlu konfigurasi tambahan.",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=700&q=80",
    alt: "Upload dokumen CV",
    reverse: false,
    color: "#10b981",
  },
  {
    num: "02",
    title: "AI Menganalisis dalam Detik",
    desc: "Sistem kecerdasan buatan kami membaca setiap bagian CV — mengekstraksi skill, pengalaman, dan pendidikan untuk menghasilkan skor objektif yang komprehensif.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80",
    alt: "Tim berdiskusi dan menganalisis",
    reverse: true,
    color: "#06b6d4",
  },
  {
    num: "03",
    title: "Temukan Lowongan yang Cocok",
    desc: "Berdasarkan profil CV-mu, platform secara otomatis mencocokkan dengan ratusan lowongan yang relevan dari perusahaan terpercaya di seluruh Indonesia.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80",
    alt: "Kandidat mendapat pekerjaan",
    reverse: false,
    color: "#f59e0b",
  },
];

export function LandingVisualSteps() {
  return (
    <section className="py-[100px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <LandingFadeIn className="text-center mb-[60px]">
          <LandingTag>Proses Nyata</LandingTag>
          <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
            Tiga Langkah yang Mengubah Kariermu
          </h2>
          <p className="text-[#7a9585] max-w-[480px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
            Dari unggah CV hingga dapat panggilan interview — prosesnya sederhana, hasilnya nyata.
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
