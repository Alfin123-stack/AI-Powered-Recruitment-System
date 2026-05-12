"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  Brain,
  Target,
  Shield,
  Zap,
  ArrowRight,
  Users,
  FileText,
  CheckCircle2,
  Globe,
  Heart,
  Code2,
  Lightbulb,
  TrendingUp,
  Building2,
  Mail,
} from "lucide-react";

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 2200,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(timer);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

function FadeIn({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Illustration: People applying / working ───────────────────────────────────
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Background glow */}
      <ellipse cx="260" cy="200" rx="200" ry="120" fill="url(#bgGlow)" />

      {/* ── Main laptop / screen ── */}
      <rect x="130" y="80" width="260" height="165" rx="12" fill="#0f1612" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
      <rect x="138" y="88" width="244" height="149" rx="8" fill="#060b09" />

      {/* Screen content — CV preview */}
      <rect x="148" y="98" width="100" height="6" rx="3" fill="rgba(16,185,129,0.5)" />
      <rect x="148" y="110" width="70" height="4" rx="2" fill="rgba(16,185,129,0.2)" />
      <rect x="148" y="120" width="85" height="4" rx="2" fill="rgba(16,185,129,0.15)" />

      {/* Score rings on screen */}
      <circle cx="310" cy="125" r="28" stroke="rgba(16,185,129,0.15)" strokeWidth="5" />
      <circle cx="310" cy="125" r="28" stroke="#10b981" strokeWidth="5"
        strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round"
        transform="rotate(-90 310 125)" />
      <text x="310" y="130" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">82</text>

      <circle cx="355" cy="125" r="20" stroke="rgba(139,92,246,0.15)" strokeWidth="4" />
      <circle cx="355" cy="125" r="20" stroke="#8b5cf6" strokeWidth="4"
        strokeDasharray="80" strokeDashoffset="20" strokeLinecap="round"
        transform="rotate(-90 355 125)" />
      <text x="355" y="130" textAnchor="middle" fill="#8b5cf6" fontSize="9" fontWeight="bold">76</text>

      {/* Skill tags on screen */}
      {["React", "Next.js", "TypeScript"].map((s, i) => (
        <g key={s}>
          <rect x={148 + i * 72} y="140" width={s.length * 6 + 12} height="16" rx="4"
            fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.8" />
          <text x={154 + i * 72} y="151" fill="rgba(16,185,129,0.8)" fontSize="7.5" fontFamily="monospace">{s}</text>
        </g>
      ))}

      {/* Progress bars */}
      {[
        { label: "Pengalaman", w: 160, color: "#10b981" },
        { label: "Pendidikan", w: 130, color: "#06b6d4" },
        { label: "Skill", w: 180, color: "#f59e0b" },
      ].map((b, i) => (
        <g key={b.label}>
          <text x="148" y={175 + i * 16} fill="rgba(122,149,133,0.7)" fontSize="7">{b.label}</text>
          <rect x="190" y={168 + i * 16} width="180" height="4" rx="2" fill="rgba(255,255,255,0.04)" />
          <rect x="190" y={168 + i * 16} width={b.w} height="4" rx="2" fill={b.color} opacity="0.6" />
        </g>
      ))}

      {/* Laptop base */}
      <path d="M100 245 L420 245 L400 255 H120 Z" fill="#0f1612" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />

      {/* ── Person LEFT — standing, submitting CV ── */}
      {/* Body */}
      <ellipse cx="90" cy="230" rx="22" ry="8" fill="rgba(16,185,129,0.06)" />
      {/* legs */}
      <rect x="80" y="205" width="8" height="28" rx="4" fill="#1a2e24" />
      <rect x="94" y="205" width="8" height="28" rx="4" fill="#1a2e24" />
      {/* torso */}
      <rect x="74" y="165" width="34" height="44" rx="10" fill="#0f1a14" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {/* arm reaching to laptop */}
      <path d="M108 175 Q140 160 155 155" stroke="#10b981" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      {/* head */}
      <circle cx="91" cy="152" r="15" fill="#0f1a14" stroke="rgba(16,185,129,0.3)" strokeWidth="1.2" />
      {/* face detail */}
      <circle cx="87" cy="150" r="2" fill="rgba(16,185,129,0.4)" />
      <circle cx="95" cy="150" r="2" fill="rgba(16,185,129,0.4)" />
      <path d="M87 156 Q91 159 95 156" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Document in hand */}
      <rect x="108" y="162" width="22" height="28" rx="3" fill="#0f1612" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <rect x="111" y="167" width="14" height="2" rx="1" fill="rgba(16,185,129,0.4)" />
      <rect x="111" y="171" width="10" height="2" rx="1" fill="rgba(16,185,129,0.2)" />
      <rect x="111" y="175" width="12" height="2" rx="1" fill="rgba(16,185,129,0.2)" />
      {/* Upload arrow from document */}
      <path d="M119 155 L119 163" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* ── Person RIGHT — celebrating / checking result ── */}
      <ellipse cx="430" cy="230" rx="22" ry="8" fill="rgba(6,182,212,0.06)" />
      <rect x="418" y="205" width="8" height="28" rx="4" fill="#1a2e24" />
      <rect x="432" y="205" width="8" height="28" rx="4" fill="#1a2e24" />
      <rect x="412" y="165" width="34" height="44" rx="10" fill="#0f1a14" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
      {/* Arm raised up in celebration */}
      <path d="M412 172 Q400 155 395 140" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      {/* Star near raised hand */}
      <text x="387" y="135" fill="#f59e0b" fontSize="14">★</text>
      <circle cx="429" cy="152" r="15" fill="#0f1a14" stroke="rgba(6,182,212,0.3)" strokeWidth="1.2" />
      <circle cx="425" cy="150" r="2" fill="rgba(6,182,212,0.4)" />
      <circle cx="433" cy="150" r="2" fill="rgba(6,182,212,0.4)" />
      <path d="M425 157 Q429 161 433 157" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Phone in hand */}
      <rect x="435" y="175" width="18" height="30" rx="4" fill="#0f1612" stroke="rgba(6,182,212,0.4)" strokeWidth="1" />
      <rect x="438" y="179" width="12" height="18" rx="2" fill="rgba(6,182,212,0.08)" />
      <rect x="440" y="182" width="8" height="2" rx="1" fill="rgba(6,182,212,0.4)" />
      <rect x="440" y="186" width="5" height="2" rx="1" fill="rgba(16,185,129,0.5)" />

      {/* ── Floating badges ── */}
      {/* Badge: ATS Score */}
      <g transform="translate(50, 90)">
        <rect width="90" height="32" rx="8" fill="#0a0f0d" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
        <circle cx="14" cy="16" r="5" fill="rgba(16,185,129,0.15)" />
        <circle cx="14" cy="16" r="5" stroke="#10b981" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="5"
          transform="rotate(-90 14 16)" />
        <text x="24" y="13" fill="rgba(200,217,208,0.9)" fontSize="7.5" fontWeight="600">ATS Score</text>
        <text x="24" y="23" fill="#10b981" fontSize="9" fontWeight="bold">76 / 100</text>
      </g>

      {/* Badge: Job Match */}
      <g transform="translate(365, 60)">
        <rect width="100" height="32" rx="8" fill="#0a0f0d" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
        <rect x="8" y="10" width="12" height="12" rx="3" fill="rgba(6,182,212,0.15)" />
        <text x="8" y="19" fill="#06b6d4" fontSize="9">✓</text>
        <text x="24" y="13" fill="rgba(200,217,208,0.9)" fontSize="7.5" fontWeight="600">Job Match</text>
        <text x="24" y="23" fill="#06b6d4" fontSize="9" fontWeight="bold">8 lowongan</text>
      </g>

      {/* Badge: Upload complete */}
      <g transform="translate(190, 258)">
        <rect width="140" height="28" rx="8" fill="#0a0f0d" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
        <circle cx="12" cy="14" r="4" fill="#10b981" opacity="0.9" />
        <text x="22" y="18" fill="rgba(122,149,133,0.8)" fontSize="7.5">CV dianalisis dalam 3 detik</text>
      </g>

      {/* Connecting dotted lines from badges to screen */}
      <path d="M140 106 L148 106" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M365 76 L372 90" stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="3 2" />

      {/* Particle dots */}
      {[
        [170, 68, "#10b981"], [340, 55, "#06b6d4"], [460, 180, "#f59e0b"],
        [65, 195, "#10b981"], [200, 270, "#8b5cf6"], [450, 110, "#10b981"],
      ].map(([x, y, c], i) => (
        <circle key={i} cx={x as number} cy={y as number} r="2.5" fill={c as string} opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}

      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Mission Illustration ──────────────────────────────────────────────────────
function MissionIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <ellipse cx="200" cy="180" rx="160" ry="90" fill="url(#missionGlow)" />

      {/* Central AI brain node */}
      <circle cx="200" cy="150" r="45" fill="#0f1612" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
      <circle cx="200" cy="150" r="35" fill="#060b09" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
      <text x="200" y="144" textAnchor="middle" fill="#10b981" fontSize="20">✦</text>
      <text x="200" y="162" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="8" fontWeight="600" letterSpacing="1">AI ENGINE</text>

      {/* Orbiting nodes */}
      {[
        { x: 95,  y: 85,  icon: "📄", label: "CV Upload",    color: "#10b981" },
        { x: 305, y: 85,  icon: "🎯", label: "Job Match",    color: "#06b6d4" },
        { x: 95,  y: 215, icon: "📊", label: "CV Score",     color: "#f59e0b" },
        { x: 305, y: 215, icon: "👥", label: "HR Dashboard", color: "#8b5cf6" },
      ].map((n, i) => (
        <g key={i}>
          {/* Connecting line */}
          <line x1={n.x} y1={n.y} x2="200" y2="150"
            stroke={n.color} strokeWidth="1" strokeDasharray="5 3" opacity="0.3">
            <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="2s" repeatCount="indefinite" />
          </line>
          {/* Node */}
          <circle cx={n.x} cy={n.y} r="28" fill="#0f1612" stroke={n.color} strokeWidth="1.2" opacity="0.9" />
          <text x={n.x} y={n.y - 4} textAnchor="middle" fontSize="14">{n.icon}</text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" fill={n.color} fontSize="7" fontWeight="600">{n.label}</text>
          {/* Pulse ring */}
          <circle cx={n.x} cy={n.y} r="28" stroke={n.color} strokeWidth="1.5" opacity="0.4">
            <animate attributeName="r" values="28;36;28" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Central pulse */}
      <circle cx="200" cy="150" r="45" stroke="#10b981" strokeWidth="1.5" opacity="0.3">
        <animate attributeName="r" values="45;60;45" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
      </circle>

      <defs>
        <radialGradient id="missionGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Tech Stack Illustration ───────────────────────────────────────────────────
function TechIllustration() {
  const techs = [
    { label: "Next.js", color: "#e8f0ec", x: 60,  y: 60  },
    { label: "Supabase", color: "#10b981", x: 180, y: 40  },
    { label: "Gemini AI", color: "#06b6d4", x: 300, y: 60  },
    { label: "TypeScript", color: "#3b82f6", x: 60,  y: 160 },
    { label: "Express.js", color: "#f59e0b", x: 180, y: 180 },
    { label: "TailwindCSS", color: "#8b5cf6", x: 300, y: 160 },
  ];
  return (
    <svg viewBox="0 0 380 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      {techs.map((t, i) => (
        <g key={t.label}>
          <rect x={t.x - 40} y={t.y - 18} width="80" height="36" rx="10"
            fill="#0f1612" stroke={t.color} strokeWidth="1" opacity="0.9" />
          <text x={t.x} y={t.y + 5} textAnchor="middle" fill={t.color}
            fontSize="9" fontWeight="700">{t.label}</text>
          <circle cx={t.x} cy={t.y} r="40" stroke={t.color} strokeWidth="0.5" opacity="0.07" />
        </g>
      ))}
      {/* Connection lines */}
      {[[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[2,5]].map(([a,b],i) => (
        <line key={i}
          x1={techs[a].x} y1={techs[a].y}
          x2={techs[b].x} y2={techs[b].y}
          stroke="rgba(16,185,129,0.08)" strokeWidth="1" />
      ))}
    </svg>
  );
}

// ── Team Member Card ──────────────────────────────────────────────────────────
function TeamCard({
  initials, name, role, desc, color, delay,
}: {
  initials: string; name: string; role: string; desc: string; color: string; delay: number;
}) {
  return (
    <FadeIn delay={delay}>
      <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[18px] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)] group">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-[14px] flex items-center justify-center font-syne font-extrabold text-[1.1rem] text-black flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          >
            {initials}
          </div>
          <div>
            <h3 className="font-syne font-bold text-[0.95rem] text-[#e8f0ec] group-hover:text-emerald-400 transition-colors">{name}</h3>
            <p className="text-[0.75rem] font-semibold" style={{ color }}>{role}</p>
          </div>
        </div>
        <p className="text-[#7a9585] text-[0.84rem] leading-[1.65]">{desc}</p>
      </div>
    </FadeIn>
  );
}

// ── Value Card ────────────────────────────────────────────────────────────────
function ValueCard({
  icon, title, desc, color, delay,
}: {
  icon: React.ReactNode; title: string; desc: string; color: string; delay: number;
}) {
  return (
    <FadeIn delay={delay}>
      <div className="bg-[#0a0f0d] border border-emerald-500/10 rounded-[16px] p-6 flex flex-col gap-3 transition-all duration-300 hover:border-emerald-500/22 hover:-translate-y-[2px]">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center"
          style={{ background: `${color}15`, color }}
        >
          {icon}
        </div>
        <h3 className="font-syne font-bold text-[0.95rem] text-[#e8f0ec]">{title}</h3>
        <p className="text-[#7a9585] text-[0.84rem] leading-[1.65]">{desc}</p>
      </div>
    </FadeIn>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <Navbar />
      <main className="pt-16">

        {/* ── HERO ── */}
        <section className="pt-[110px] pb-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none bg-[radial-gradient(ellipse,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid gap-12 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">

              {/* Left: Text */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-5">
                  <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Sparkles size={9} className="animate-pulse" /> Tentang RecruitAI
                  </span>
                </div>
                <h1 className="font-syne font-extrabold text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.09] tracking-tight mb-6">
                  Platform Rekrutmen{" "}
                  <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Berbasis AI
                  </span>{" "}
                  untuk Indonesia
                </h1>
                <p className="text-[#7a9585] text-[1rem] leading-[1.78] mb-8 max-w-[500px]">
                  RecruitAI lahir dari keyakinan bahwa setiap kandidat kompeten berhak ditemukan,
                  dan setiap perusahaan berhak mendapatkan talenta terbaik — tanpa hambatan proses yang lambat dan bias.
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href="/analyze"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.88rem] px-6 py-[11px] rounded-[10px] no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_28px_rgba(16,185,129,0.3)]"
                  >
                    <FileText size={14} /> Coba Analisis CV
                  </Link>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] text-[0.88rem] px-6 py-[10px] rounded-[10px] no-underline transition-all"
                  >
                    Lihat Lowongan <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>

              {/* Right: Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[320px] max-lg:h-[260px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] rounded-[24px]" />
                <HeroIllustration />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-16 bg-[#0f1612] border-y border-emerald-500/[0.08]">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 5000, suffix: "+", label: "CV Dianalisis", color: "#10b981" },
                { value: 98,   suffix: "%", label: "Akurasi Ekstraksi Skill", color: "#06b6d4" },
                { value: 30,   suffix: " dtk", label: "Rata-rata Waktu Analisis", color: "#f59e0b" },
                { value: 200,  suffix: "+", label: "Perusahaan Terdaftar", color: "#8b5cf6" },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.1} className="text-center">
                  <div className="font-syne font-extrabold text-[2.4rem] leading-none mb-1" style={{ color: s.color }}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-[#7a9585] text-[0.82rem]">{s.label}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATAR BELAKANG / WHY ── */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">

              {/* Illustration */}
              <FadeIn y={20} className="h-[280px] relative max-lg:order-last">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
                <MissionIllustration />
              </FadeIn>

              {/* Text */}
              <FadeIn delay={0.1}>
                <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-5 block w-fit">
                  <Lightbulb size={9} /> Mengapa RecruitAI Lahir
                </span>
                <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] mb-5">
                  Rekrutmen Konvensional Sudah Tidak Cukup
                </h2>
                <p className="text-[#7a9585] text-[0.95rem] leading-[1.78] mb-6">
                  Proses screening CV manual memakan waktu berjam-jam per hari, rentan bias, dan tidak konsisten.
                  Di sisi lain, kandidat kompeten sering gagal di seleksi awal hanya karena CV mereka tidak
                  dioptimalkan untuk sistem ATS — bukan karena mereka tidak layak.
                </p>
                <p className="text-[#7a9585] text-[0.95rem] leading-[1.78] mb-8">
                  RecruitAI hadir untuk memecahkan gap ini: memberikan kandidat analisis CV yang objektif dan
                  rekomendasi konkret, sekaligus membantu HR memilah ratusan pelamar dengan efisien berbasis data.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "73% HR menghabiskan lebih dari 6 jam/hari untuk screening manual",
                    "75% CV berkualitas gagal di seleksi ATS sebelum dibaca HR",
                    "62% keputusan hiring masih dipengaruhi bias tidak disadari",
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-[2px]" />
                      <span className="text-[#7a9585] text-[0.88rem] leading-[1.6]">{s}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── MISI & VISI ── */}
        <section className="py-[100px] bg-[#0f1612]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Target size={9} /> Misi & Visi
              </span>
              <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
                Apa yang Kami Perjuangkan
              </h2>
            </FadeIn>

            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              {/* Misi */}
              <FadeIn delay={0}>
                <div className="relative bg-[#0a0f0d] border border-emerald-500/20 rounded-[20px] p-8 overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
                  <div className="w-11 h-11 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                    <Target size={22} />
                  </div>
                  <h3 className="font-syne font-bold text-[1.15rem] mb-4 text-emerald-400">Misi Kami</h3>
                  <p className="text-[#7a9585] text-[0.92rem] leading-[1.78]">
                    Mendemokratisasi akses ke proses rekrutmen yang adil dan efisien — di mana setiap kandidat
                    kompeten punya kesempatan yang sama untuk ditemukan, dan setiap perusahaan dapat menemukan
                    talenta terbaik dengan proses yang lebih cepat, objektif, dan berbasis data.
                  </p>
                </div>
              </FadeIn>

              {/* Visi */}
              <FadeIn delay={0.12}>
                <div className="relative bg-[#0a0f0d] border border-cyan-500/20 rounded-[20px] p-8 overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
                  <div className="w-11 h-11 rounded-[12px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                    <TrendingUp size={22} />
                  </div>
                  <h3 className="font-syne font-bold text-[1.15rem] mb-4 text-cyan-400">Visi Kami</h3>
                  <p className="text-[#7a9585] text-[0.92rem] leading-[1.78]">
                    Menjadi infrastruktur rekrutmen digital terpercaya di Indonesia — tempat di mana teknologi AI
                    bukan pengganti keputusan manusia, melainkan alat yang memperkuat kemampuan HR dan kandidat
                    untuk membuat keputusan yang lebih baik.
                  </p>
                </div>
              </FadeIn>

              {/* Nilai */}
              <FadeIn delay={0.22}>
                <div className="relative bg-[#0a0f0d] border border-amber-500/20 rounded-[20px] p-8 overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.05)_0%,transparent_70%)] pointer-events-none" />
                  <div className="w-11 h-11 rounded-[12px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                    <Heart size={22} />
                  </div>
                  <h3 className="font-syne font-bold text-[1.15rem] mb-4 text-amber-400">Nilai Kami</h3>
                  <div className="flex flex-col gap-2">
                    {["Objektivitas tanpa kompromi", "Transparansi dalam setiap skor", "Inklusif untuk semua latar belakang", "Inovasi yang berpusat pada pengguna"].map((v, i) => (
                      <div key={i} className="flex items-center gap-2 text-[#7a9585] text-[0.88rem]">
                        <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── NILAI-NILAI PRODUK ── */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Shield size={9} /> Prinsip Platform
              </span>
              <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
                Dibangun dengan Prinsip yang Jelas
              </h2>
              <p className="text-[#7a9585] max-w-[500px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
                Setiap fitur dan keputusan desain di RecruitAI berpijak pada nilai-nilai ini.
              </p>
            </FadeIn>
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
              {[
                { icon: <Brain size={20} />, title: "AI yang Transparan", desc: "Setiap skor yang diberikan disertai penjelasan rinci agar pengguna memahami alasan di balik hasilnya.", color: "#10b981", delay: 0 },
                { icon: <Shield size={20} />, title: "Keamanan Data", desc: "CV dan data personal diproses dengan sistem keamanan berlapis. Data kamu hanya bisa diakses oleh akunmu sendiri.", color: "#06b6d4", delay: 0.08 },
                { icon: <Zap size={20} />, title: "Kecepatan Nyata", desc: "Analisis CV selesai dalam hitungan detik, bukan menit — karena waktu kandidat dan rekruter sama berharganya.", color: "#f59e0b", delay: 0.16 },
                { icon: <Globe size={20} />, title: "Konteks Lokal", desc: "Dibangun untuk pasar kerja Indonesia — memahami format CV lokal, kebutuhan industri, dan standar perusahaan di sini.", color: "#8b5cf6", delay: 0.24 },
                { icon: <Users size={20} />, title: "Untuk Dua Pihak", desc: "Tidak hanya untuk kandidat. Fitur HR Dashboard memastikan rekruter juga mendapat value yang setara dari platform ini.", color: "#ec4899", delay: 0.32 },
                { icon: <CheckCircle2 size={20} />, title: "Rekomendasi Konkret", desc: "Bukan sekadar skor — kami memberikan langkah perbaikan yang spesifik dan bisa langsung diimplementasikan.", color: "#10b981", delay: 0.4 },
              ].map((v, i) => (
                <ValueCard key={i} {...v} />
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="py-[100px] bg-[#0f1612]">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid gap-12 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
              <FadeIn>
                <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-5 block w-fit">
                  <Code2 size={9} /> Teknologi
                </span>
                <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] mb-5">
                  Dibangun dengan Teknologi Modern
                </h2>
                <p className="text-[#7a9585] text-[0.95rem] leading-[1.78] mb-8">
                  Arsitektur fullstack modern yang menggabungkan performa, keamanan, dan skalabilitas
                  — dirancang untuk tumbuh bersama kebutuhan pengguna.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Next.js 14",      desc: "Frontend & API Routes",   color: "#e8f0ec" },
                    { name: "Supabase",         desc: "Database & Auth",         color: "#10b981" },
                    { name: "Google Gemini AI", desc: "Analisis CV & NLP",       color: "#06b6d4" },
                    { name: "TypeScript",       desc: "Type-safe codebase",      color: "#3b82f6" },
                    { name: "Express.js",       desc: "Backend API Server",      color: "#f59e0b" },
                    { name: "TailwindCSS",      desc: "Styling & Design System", color: "#8b5cf6" },
                  ].map((t, i) => (
                    <div key={i} className="bg-[#0a0f0d] border border-emerald-500/10 rounded-[10px] px-4 py-3">
                      <div className="font-syne font-bold text-[0.85rem] mb-[2px]" style={{ color: t.color }}>{t.name}</div>
                      <div className="text-[#4a6b58] text-[0.75rem]">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.15} className="h-[260px] max-lg:h-[200px]">
                <TechIllustration />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── TIM ── */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Users size={9} /> Tim & Latar Belakang
              </span>
              <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
                Siapa di Balik RecruitAI
              </h2>
              <p className="text-[#7a9585] max-w-[520px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
                RecruitAI dikembangkan sebagai proyek magang fullstack yang menggabungkan teknologi AI terkini
                dengan kebutuhan nyata pasar rekrutmen Indonesia.
              </p>
            </FadeIn>

            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              <TeamCard
                initials="Dev"
                name="Developer & Architect"
                role="Fullstack Engineer"
                desc="Merancang dan membangun seluruh sistem RecruitAI — dari arsitektur backend, integrasi AI, hingga desain antarmuka yang digunakan kandidat dan rekruter setiap harinya."
                color="#10b981"
                delay={0}
              />
              <TeamCard
                initials="AI"
                name="Gemini AI Engine"
                role="Google Gemini API"
                desc="Model generatif yang memproses dan mengekstraksi informasi dari CV: mengidentifikasi skill, menghitung skor relevansi, dan menghasilkan rekomendasi perbaikan yang kontekstual."
                color="#06b6d4"
                delay={0.1}
              />
              <TeamCard
                initials="SB"
                name="Supabase Infrastructure"
                role="Database & Storage Layer"
                desc="Menyimpan data pengguna, CV, dan hasil analisis dengan aman. Sistem autentikasi berbasis RBAC memastikan hak akses yang tepat untuk setiap role: kandidat maupun HR."
                color="#8b5cf6"
                delay={0.2}
              />
            </div>

            {/* Project context box */}
            <FadeIn delay={0.15} className="mt-8">
              <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[18px] px-8 py-7 flex items-start gap-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-[300px] h-full pointer-events-none bg-[radial-gradient(ellipse_at_right,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
                <div className="w-10 h-10 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                  <Lightbulb size={18} />
                </div>
                <div className="relative">
                  <h3 className="font-syne font-bold text-[0.95rem] text-[#e8f0ec] mb-2">Konteks Proyek</h3>
                  <p className="text-[#7a9585] text-[0.875rem] leading-[1.72] max-w-[680px]">
                    RecruitAI dikembangkan dalam konteks program magang pengembangan aplikasi fullstack berbasis AI.
                    Proyek ini menjadi implementasi nyata dari arsitektur modern menggunakan Next.js, Express.js, Supabase,
                    dan integrasi Google Gemini API — dengan tujuan nyata: membantu kandidat dan perusahaan dalam proses
                    rekrutmen yang lebih efisien, objektif, dan berbasis data.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── RUANG LINGKUP SISTEM ── */}
        <section className="py-[100px] bg-[#0f1612]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Building2 size={9} /> Ruang Lingkup
              </span>
              <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
                Apa yang Dicakup Platform Ini
              </h2>
            </FadeIn>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
              {[
                { num: "01", title: "Autentikasi & RBAC", desc: "Sistem login aman berbasis Supabase Auth dengan dua role: Kandidat dan HR — masing-masing dengan hak akses yang berbeda.", color: "#10b981" },
                { num: "02", title: "Analisis CV AI", desc: "Upload PDF, ekstraksi otomatis skill dan pengalaman, penilaian Resume Score + ATS Score, serta rekomendasi perbaikan konkret.", color: "#06b6d4" },
                { num: "03", title: "Job Matching", desc: "Pencocokan otomatis antara skill terdeteksi dari CV kandidat dengan deskripsi lowongan yang tersedia di platform.", color: "#f59e0b" },
                { num: "04", title: "HR Dashboard", desc: "Dashboard rekruter untuk melihat semua pelamar, membandingkan skor AI, dan mengupdate status kandidat secara real-time.", color: "#8b5cf6" },
                { num: "05", title: "Manajemen Lowongan", desc: "HR dapat membuat, mengedit, dan menutup lowongan. Kandidat dapat melamar langsung dan memantau status lamaran mereka.", color: "#ec4899" },
                { num: "06", title: "Direktori Perusahaan", desc: "Kandidat dapat menjelajahi perusahaan yang merekrut, melihat profil, dan lowongan aktif per perusahaan.", color: "#10b981" },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className="bg-[#0a0f0d] border border-emerald-500/10 rounded-[14px] p-5 h-full transition-all duration-300 hover:border-emerald-500/20 hover:-translate-y-[2px]">
                    <div className="font-syne font-extrabold text-[1.6rem] mb-3 opacity-20" style={{ color: item.color }}>{item.num}</div>
                    <h3 className="font-syne font-bold text-[0.92rem] text-[#e8f0ec] mb-2">{item.title}</h3>
                    <p className="text-[#4a6b58] text-[0.82rem] leading-[1.65]">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-[100px] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
          <div className="max-w-[700px] mx-auto px-6 text-center relative">
            <FadeIn>
              <span className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.68rem] font-semibold tracking-[0.1em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 block w-fit mx-auto">
                <Sparkles size={9} className="animate-pulse" /> Mulai Sekarang
              </span>
              <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3rem)] leading-[1.12] mb-5">
                Siap Merasakan Rekrutmen yang{" "}
                <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Lebih Cerdas?
                </span>
              </h2>
              <p className="text-[#7a9585] text-[0.95rem] leading-[1.72] mb-10 max-w-[480px] mx-auto">
                Upload CV kamu sekarang dan dapatkan analisis mendalam dalam 30 detik.
                Gratis untuk kandidat, tanpa perlu kartu kredit.
              </p>
              <div className="flex items-center gap-4 justify-center flex-wrap">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.95rem] px-8 py-[13px] rounded-[11px] no-underline transition-all hover:-translate-y-[2px] hover:shadow-[0_10px_36px_rgba(16,185,129,0.32)]"
                >
                  <FileText size={16} /> Analisis CV Sekarang
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] text-[0.88rem] px-6 py-[12px] rounded-[10px] no-underline transition-all"
                >
                  <Mail size={14} /> Hubungi Kami
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>
    </div>
  );
}