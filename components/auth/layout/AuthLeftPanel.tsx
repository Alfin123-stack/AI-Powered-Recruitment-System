import Image from "next/image";
import { FEATURES, STATS } from "@/constants/auth/auth";

export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex flex-col relative w-[52%] xl:w-[55%] flex-shrink-0 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=85"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(min-width: 1280px) 55vw, 52vw"
          className="object-cover"
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f0d]/95 via-[#0a0f0d]/80 to-[#0a0f0d]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-transparent" />
        {/* Green tint */}
        <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />
      </div>

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.12)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-10">
        {/* Main headline */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px]">
          <h1 className="font-syne text-[2.6rem] xl:text-[3rem] font-extrabold leading-[1.1] tracking-tight text-[#e8f0ec] mb-5">
            Rekrutmen lebih{" "}
            <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              cerdas
            </span>{" "}
            dimulai di sini.
          </h1>
          <p className="text-[#7a9585] text-[0.92rem] leading-[1.75] mb-10 max-w-[360px]">
            Analisis CV otomatis, job matching cerdas, dan rekrutmen lebih cepat
            dengan kecerdasan buatan.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {FEATURES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-[14px] group">
                <div
                  className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20
                  flex items-center justify-center flex-shrink-0 mt-[1px]
                  group-hover:bg-emerald-500/15 group-hover:border-emerald-500/35
                  transition-all duration-200">
                  <Icon size={15} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[0.86rem] font-semibold text-[#d4e8dd] leading-snug">
                    {label}
                  </p>
                  <p className="text-[0.76rem] text-[#5a7a6a] mt-[2px]">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.03] border border-emerald-500/12 rounded-[12px] px-3 py-4 text-center
                backdrop-blur-sm hover:bg-white/[0.05] hover:border-emerald-500/22 transition-all duration-200">
              <p className="font-syne text-[1.4rem] font-extrabold text-emerald-400 leading-none mb-[4px]">
                {s.value}
              </p>
              <p className="text-[0.68rem] text-[#5a7a6a]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right edge fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0f0d] to-transparent pointer-events-none" />
    </div>
  );
}
