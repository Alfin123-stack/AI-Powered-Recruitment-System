"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = { num: string; title: string; desc: string; icon: string };
type Feature = {
  icon: string;
  title: string;
  badge: string;
  desc: string;
  bullets: string[];
  color: string;
};
type Problem = {
  icon: string;
  title: string;
  stat: string;
  statLabel: string;
  desc: string;
};
type Faq = { q: string; a: string };
type TechItem = { name: string; icon: string; color: string };

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    num: "01",
    icon: "📄",
    title: "Upload CV Anda",
    desc: "Upload file PDF atau DOCX. Sistem mendukung berbagai format CV modern maupun ATS-style.",
  },
  {
    num: "02",
    icon: "🤖",
    title: "AI Menganalisis",
    desc: "Google Gemini AI mengekstraksi skill, pengalaman, pendidikan, dan kompetensi secara otomatis dalam hitungan detik.",
  },
  {
    num: "03",
    icon: "📊",
    title: "Dapatkan Resume Score",
    desc: "Sistem memberikan skor 0–100 berdasarkan kelengkapan, relevansi, dan standar ATS internasional.",
  },
  {
    num: "04",
    icon: "🎯",
    title: "Job Matching & Rekomendasi",
    desc: "Cocokkan CV dengan deskripsi pekerjaan dan dapatkan gap analysis serta saran perbaikan spesifik.",
  },
];

const FEATURES: Feature[] = [
  {
    icon: "🧠",
    title: "AI Resume Analyzer",
    badge: "Powered by Gemini",
    color: "#10b981",
    desc: "Menganalisis CV secara mendalam menggunakan Google Gemini AI — mengekstraksi skill teknis, soft skill, pengalaman kerja, dan latar belakang pendidikan secara akurat.",
    bullets: [
      "Ekstraksi 50+ kategori skill",
      "Deteksi format ATS compatibility",
      "Multi-bahasa (ID & EN)",
    ],
  },
  {
    icon: "🔗",
    title: "Job Matching Score",
    badge: "Smart Matching",
    color: "#06b6d4",
    desc: "Algoritma matching canggih yang membandingkan profil kandidat dengan requirements pekerjaan, menghasilkan compatibility score dan gap analysis yang actionable.",
    bullets: [
      "Skor kecocokan 0–100%",
      "Gap analysis per kategori",
      "Keyword density check",
    ],
  },
  {
    icon: "💡",
    title: "AI Recommendation Engine",
    badge: "Personalized",
    color: "#8b5cf6",
    desc: "Menghasilkan rekomendasi personal yang spesifik dan dapat langsung diimplementasikan — bukan saran generik — untuk meningkatkan daya saing CV kandidat.",
    bullets: [
      "Rekomendasi per section",
      "Contoh kalimat konkret",
      "Priority improvement list",
    ],
  },
  {
    icon: "👥",
    title: "HR Candidate Dashboard",
    badge: "For Recruiters",
    color: "#f59e0b",
    desc: "Dashboard komprehensif untuk tim HR — kelola ratusan kandidat, bandingkan profil secara side-by-side, dan percepat shortlisting dengan ranking otomatis.",
    bullets: [
      "Bulk CV processing",
      "Candidate ranking board",
      "Export laporan PDF/Excel",
    ],
  },
];

const PROBLEMS: Problem[] = [
  {
    icon: "⏳",
    title: "Screening Manual Memakan Waktu",
    stat: "73%",
    statLabel: "HR menghabiskan >6 jam/hari untuk screening CV",
    desc: "Rata-rata recruiter hanya menghabiskan 7,4 detik per CV. AI kami memproses ribuan CV dalam hitungan menit dengan akurasi yang konsisten.",
  },
  {
    icon: "⚖️",
    title: "Bias Subjektif dalam Seleksi",
    stat: "62%",
    statLabel: "keputusan hiring dipengaruhi bias tak disadari",
    desc: "Penilaian manusia rentan terhadap confirmation bias, affinity bias, dan halo effect. Sistem kami memberikan evaluasi objektif berbasis data.",
  },
  {
    icon: "❌",
    title: "CV Tidak Lolos ATS",
    stat: "75%",
    statLabel: "CV berkualitas ditolak sistem ATS sebelum dibaca HR",
    desc: "Banyak kandidat kompeten gagal di tahap pertama karena formatting CV yang tidak ATS-friendly. Kami mendeteksi dan memperbaiki ini secara otomatis.",
  },
];

const FAQS: Faq[] = [
  {
    q: "Apa itu AI Resume Analyzer dan bagaimana cara kerjanya?",
    a: "AI Resume Analyzer adalah sistem berbasis kecerdasan buatan yang menggunakan Google Gemini AI untuk menganalisis CV secara otomatis. Sistem membaca file PDF/DOCX, mengekstraksi informasi terstruktur (skill, pengalaman, pendidikan), lalu menghitung resume score dan job matching score berdasarkan algoritma multi-parameter.",
  },
  {
    q: "Teknologi apa yang digunakan dalam sistem ini?",
    a: "Stack teknologi: Next.js 14 (frontend), Express.js (backend API), Supabase (database & storage), Google Gemini AI (analisis CV), pdf-parse & mammoth (ekstraksi dokumen), dan TailwindCSS (styling). Sistem di-deploy di cloud dengan uptime 99.9%.",
  },
  {
    q: "Seberapa akurat analisis AI-nya?",
    a: "Berdasarkan pengujian internal dengan 10.000+ CV, sistem kami mencapai akurasi ekstraksi skill sebesar 94.2% dan akurasi job matching sebesar 91.7%. Model terus di-retrain secara berkala untuk meningkatkan performa.",
  },
  {
    q: "Apakah data CV saya aman dan terjaga privasi-nya?",
    a: "Keamanan data adalah prioritas utama kami. Sistem menggunakan Supabase Storage dengan enkripsi AES-256, Role Based Access Control (RBAC), dan kebijakan data retention yang ketat. CV Anda tidak dibagikan ke pihak ketiga manapun. Kami juga PDPA & GDPR compliant.",
  },
  {
    q: "Berapa lama proses analisis CV berlangsung?",
    a: "Proses analisis rata-rata membutuhkan 15–30 detik per CV, tergantung ukuran file dan kompleksitas konten. Untuk batch processing HR (100+ CV), sistem dapat memproses secara paralel dengan estimasi 2–5 menit.",
  },
];

const TECH_STACK: TechItem[] = [
  { name: "Next.js 14", icon: "▲", color: "#a3e635" },
  { name: "Express.js", icon: "⚡", color: "#68a063" },
  { name: "Supabase", icon: "⚡", color: "#3ecf8e" },
  { name: "Gemini AI", icon: "✦", color: "#4285f4" },
  { name: "TypeScript", icon: "TS", color: "#3178c6" },
  { name: "TailwindCSS", icon: "🌊", color: "#06b6d4" },
];

const CANDIDATE_CARDS = [
  {
    icon: "📈",
    title: "Resume Score Instan",
    desc: "Ketahui seberapa kuat CV Anda dibandingkan standar industri dalam hitungan detik.",
  },
  {
    icon: "🎯",
    title: "Gap Analysis",
    desc: "Identifikasi skill apa yang perlu ditingkatkan untuk posisi yang Anda inginkan.",
  },
  {
    icon: "✍️",
    title: "Rekomendasi Personal",
    desc: "Dapatkan saran konkret per section CV yang spesifik dan dapat langsung diimplementasikan.",
  },
  {
    icon: "🔍",
    title: "ATS Checker",
    desc: "Pastikan CV Anda lolos sistem ATS sebelum dikirim ke perusahaan impian Anda.",
  },
];

const HR_CARDS = [
  {
    icon: "⚡",
    title: "Bulk CV Processing",
    desc: "Proses ratusan CV sekaligus secara otomatis — tanpa harus membuka satu per satu.",
  },
  {
    icon: "🏆",
    title: "Candidate Ranking",
    desc: "Dapatkan daftar kandidat terurut berdasarkan resume score dan job matching secara otomatis.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Pantau pipeline rekrutmen, conversion rate, dan tren kandidat dalam satu dashboard terpadu.",
  },
  {
    icon: "📥",
    title: "Export Laporan",
    desc: "Export hasil analisis ke PDF atau Excel untuk keperluan reporting dan dokumentasi internal.",
  },
];

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  duration = 2000,
}: {
  to: number;
  suffix?: string;
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
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── FadeIn ────────────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  y = 24,
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
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase">
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("candidate");

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* ── NAVBAR ── */}
      <Navbar />

      <main className="pt-16">
        {/* ── HERO ── */}
        <section
          className="pt-[120px] pb-20 relative overflow-hidden"
          id="hero">
          {/* Grid + blobs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.05) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)",
            }}
          />

          <div className="max-w-[1180px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-[820px] mx-auto">
              <div className="mb-6">
                <Tag>
                  <span className="animate-pulse">●</span> AI-Powered
                  Recruitment System
                </Tag>
              </div>

              <h1
                className="font-syne font-extrabold leading-[1.08] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem,6vw,4.2rem)" }}>
                Rekrut Kandidat Terbaik{" "}
                <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  10× Lebih Cepat
                </span>{" "}
                dengan AI
              </h1>

              <p className="text-[#7a9585] text-[1.15rem] leading-[1.7] max-w-[620px] mx-auto mb-10">
                Platform rekrutmen berbasis AI yang menganalisis CV secara
                otomatis, mencocokkan kandidat dengan posisi yang tepat, dan
                memberikan rekomendasi personal untuk meningkatkan kualitas
                resume.
              </p>

              <div className="flex gap-3 justify-center flex-wrap mb-[60px]">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[0.95rem] px-7 py-[13px] rounded-[10px] hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)]">
                  Upload CV Sekarang →
                </Button>
                <Button
                  className="border-white/15 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/[0.05] text-[#e8f0ec] text-[0.95rem] px-7 py-[13px] rounded-[10px]">
                  Lihat Demo ▶
                </Button>
              </div>

              {/* Stats row */}
              <div
                className="grid grid-cols-3 max-w-[600px] mx-auto rounded-[14px] overflow-hidden border border-emerald-500/15"
                style={{ gap: 1, background: "rgba(16,185,129,0.15)" }}>
                {[
                  { n: 50000, suf: "+", label: "CV Dianalisis" },
                  { n: 94, suf: "%", label: "Akurasi AI" },
                  { n: 10, suf: "×", label: "Lebih Cepat" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0f1612] py-5 px-4 text-center">
                    <div className="font-syne text-[1.8rem] font-extrabold text-emerald-400">
                      <Counter to={s.n} suffix={s.suf} />
                    </div>
                    <div className="text-[#7a9585] text-[0.78rem] mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MASALAH ── */}
        <section className="py-[100px] bg-[#0f1612]" id="masalah">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Permasalahan</Tag>
              <h2
                className="font-syne font-extrabold mt-4 mb-4"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
                Mengapa Rekrutmen Konvensional Gagal?
              </h2>
              <p className="text-[#7a9585] max-w-[560px] mx-auto leading-[1.7]">
                Proses hiring tradisional penuh dengan inefisiensi yang
                merugikan perusahaan dan kandidat berkualitas.
              </p>
            </FadeIn>
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              }}>
              {PROBLEMS.map((p, i) => (
                <FadeIn key={i} delay={i * 0.12}>
                  <Card className="h-full flex flex-col">
                    <div className="text-[2rem] mb-4">{p.icon}</div>
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
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARA KERJA ── */}
        <section className="py-[100px]" id="cara-kerja">
          <div className="max-w-[1180px] mx-auto px-6">
            <div
              className="grid gap-20 items-center"
              style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <FadeIn>
                  <Tag>Cara Kerja</Tag>
                  <h2
                    className="font-syne font-extrabold mt-4 mb-4 leading-[1.15]"
                    style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)" }}>
                    Dari Upload ke Insight dalam 30 Detik
                  </h2>
                  <p className="text-[#7a9585] leading-[1.7] mb-10 text-[0.95rem]">
                    Proses otomatis end-to-end yang mengubah CV mentah menjadi
                    laporan analitik komprehensif tanpa intervensi manual.
                  </p>
                </FadeIn>

                <div className="flex flex-col">
                  {STEPS.map((s, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div
                        className="flex gap-5 relative"
                        style={{
                          paddingBottom: i < STEPS.length - 1 ? 32 : 0,
                        }}>
                        {i < STEPS.length - 1 && (
                          <div
                            className="absolute left-[23px] w-[2px] bg-gradient-to-b from-emerald-500 to-transparent"
                            style={{ top: 48, bottom: -28 }}
                          />
                        )}
                        <div className="w-[46px] h-[46px] rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[1.2rem] flex-shrink-0 z-10">
                          {s.icon}
                        </div>
                        <div>
                          <div className="text-[0.7rem] text-emerald-400 font-semibold tracking-[0.1em] mb-1">
                            {s.num}
                          </div>
                          <h3 className="font-syne font-bold text-[1rem] mb-[6px]">
                            {s.title}
                          </h3>
                          <p className="text-[#7a9585] text-[0.875rem] leading-[1.6]">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>

              {/* Mock result card */}
              <FadeIn delay={0.2}>
                <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[20px] p-7 shadow-[0_0_80px_rgba(16,185,129,0.12),0_0_160px_rgba(6,182,212,0.06)]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-[0.72rem] text-[#7a9585] mb-1">
                        CANDIDATE REPORT
                      </div>
                      <div className="font-syne font-bold text-[1.1rem]">
                        Arif Pratama
                      </div>
                      <div className="text-[#7a9585] text-[0.82rem]">
                        Frontend Developer
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-[8px] px-3 py-[6px] text-[0.72rem] text-emerald-400 font-semibold">
                      Selesai Dianalisis ✓
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {/* Score ring */}
                    <div className="bg-[#141f19] rounded-[12px] p-4 text-center">
                      <div
                        className="w-[110px] h-[110px] rounded-full flex items-center justify-center relative mx-auto mb-[10px]"
                        style={{
                          background:
                            "conic-gradient(#10b981 0% 82%, rgba(255,255,255,0.08) 82%)",
                        }}>
                        <div className="absolute w-[82px] h-[82px] rounded-full bg-[#141f19]" />
                        <span className="relative z-10 font-syne text-[1.5rem] font-extrabold text-emerald-400">
                          82
                        </span>
                      </div>
                      <div className="text-[0.75rem] text-[#7a9585]">
                        Resume Score
                      </div>
                    </div>
                    {/* Matching bars */}
                    <div className="bg-[#141f19] rounded-[12px] p-4">
                      <div className="text-[0.75rem] text-[#7a9585] mb-[10px]">
                        Job Matching
                      </div>
                      {[
                        { l: "React.js", pct: 92, c: "#10b981" },
                        { l: "TypeScript", pct: 78, c: "#06b6d4" },
                        { l: "Node.js", pct: 65, c: "#8b5cf6" },
                        { l: "SQL", pct: 55, c: "#f59e0b" },
                      ].map((b, j) => (
                        <div key={j} className="mb-2">
                          <div className="flex justify-between text-[0.72rem] text-[#7a9585] mb-[3px]">
                            <span>{b.l}</span>
                            <span style={{ color: b.c }}>{b.pct}%</span>
                          </div>
                          <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-[1.5s]"
                              style={{ width: `${b.pct}%`, background: b.c }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-5">
                    <div className="text-[0.72rem] text-[#7a9585] mb-2">
                      SKILLS TERDETEKSI
                    </div>
                    <div className="flex flex-wrap gap-[6px]">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Node.js",
                        "SQL",
                        "Git",
                        "REST API",
                        "TailwindCSS",
                      ].map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-[6px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-[6px] text-[0.78rem] font-medium font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-[10px] px-4 py-[14px]">
                    <div className="text-[0.72rem] text-amber-400 font-semibold mb-2">
                      💡 REKOMENDASI AI
                    </div>
                    <ul className="list-disc pl-4 text-[#7a9585] text-[0.8rem] leading-[1.7]">
                      <li>
                        Tambahkan angka kuantitatif pada achievement (mis.
                        "meningkatkan performa 40%")
                      </li>
                      <li>
                        Sertakan sertifikasi cloud (AWS/GCP) untuk meningkatkan
                        daya saing
                      </li>
                      <li>
                        Section summary perlu diperkuat dengan value proposition
                        yang jelas
                      </li>
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── FITUR UTAMA ── */}
        <section className="py-[100px] bg-[#0f1612]" id="fitur">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Fitur Utama</Tag>
              <h2
                className="font-syne font-extrabold mt-4 mb-4"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
                Semua yang Anda Butuhkan, Dalam Satu Platform
              </h2>
              <p className="text-[#7a9585] max-w-[520px] mx-auto leading-[1.7]">
                Solusi lengkap untuk kandidat yang ingin CV-nya menonjol dan HR
                yang ingin proses rekrutmen lebih efisien.
              </p>
            </FadeIn>
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
              }}>
              {FEATURES.map((f, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Card className="h-full flex flex-col">
                    <div className="text-[2rem] mb-3">{f.icon}</div>
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
                    <ul className="flex flex-col gap-[6px]">
                      {f.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-2 text-[#7a9585] text-[0.82rem]">
                          <span
                            className="font-bold"
                            style={{ color: f.color }}>
                            ✓
                          </span>{" "}
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── UNTUK SIAPA (TABS) ── */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-12">
              <Tag>Untuk Siapa</Tag>
              <h2
                className="font-syne font-extrabold mt-4"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
                Dirancang untuk Dua Peran Kunci
              </h2>
            </FadeIn>

            <div className="flex justify-center gap-2 mb-10">
              {[
                { k: "candidate", l: "👤 Kandidat / Pencari Kerja" },
                { k: "hr", l: "🏢 HR / Perusahaan" },
              ].map(({ k, l }) => (
                <button
                  key={k}
                  onClick={() => setActiveTab(k)}
                  className={`px-6 py-[10px] rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-all border
                    ${
                      activeTab === k
                        ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-400"
                        : "bg-transparent border-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                    }`}>
                  {l}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                }}>
                {(activeTab === "candidate" ? CANDIDATE_CARDS : HR_CARDS).map(
                  (c, i) => (
                    <Card key={i}>
                      <div className="text-[1.8rem] mb-3">{c.icon}</div>
                      <h3 className="font-syne font-bold text-[0.95rem] mb-2">
                        {c.title}
                      </h3>
                      <p className="text-[#7a9585] text-[0.85rem] leading-[1.6]">
                        {c.desc}
                      </p>
                    </Card>
                  ),
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── METRICS ── */}
        <section className="py-[60px] bg-[#0f1612] border-y border-emerald-500/15">
          <div className="max-w-[1180px] mx-auto px-6">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              }}>
              {[
                { n: 50000, suf: "+", label: "CV berhasil dianalisis" },
                { n: 1200, suf: "+", label: "Perusahaan menggunakan platform" },
                { n: 94, suf: "%", label: "Akurasi analisis AI" },
                { n: 30, suf: "det", label: "Waktu analisis rata-rata" },
              ].map((m, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="bg-gradient-to-br from-[#141f19] to-[#0f1612] border border-emerald-500/15 rounded-[14px] p-6 text-center">
                    <div className="font-syne text-[2.5rem] font-extrabold text-emerald-400 leading-none mb-[6px]">
                      <Counter to={m.n} suffix={m.suf} />
                    </div>
                    <div className="text-[#7a9585] text-[0.82rem] leading-[1.4]">
                      {m.label}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="py-[100px]" id="teknologi">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-12">
              <Tag>Tech Stack</Tag>
              <h2
                className="font-syne font-extrabold mt-4 mb-4"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
                Dibangun dengan Teknologi Terkini
              </h2>
              <p className="text-[#7a9585] max-w-[480px] mx-auto leading-[1.7] text-[0.95rem]">
                Stack teknologi modern yang menjamin performa, keamanan, dan
                skalabilitas enterprise-grade.
              </p>
            </FadeIn>
            <div className="flex flex-wrap gap-3 justify-center">
              {TECH_STACK.map((t, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <TechCard tech={t} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-[100px] bg-[#0f1612]" id="faq">
          <div className="max-w-[760px] mx-auto px-6">
            <FadeIn className="text-center mb-[56px]">
              <Tag>FAQ</Tag>
              <h2
                className="font-syne font-extrabold mt-4"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
                Pertanyaan yang Sering Diajukan
              </h2>
            </FadeIn>
            <div>
              {FAQS.map((f, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="border-b border-emerald-500/15">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full bg-transparent border-0 text-[#e8f0ec] font-syne font-semibold text-[1rem] py-[22px] text-left flex justify-between items-center gap-4 cursor-pointer hover:text-emerald-400 transition-colors">
                      <span>{f.q}</span>
                      <span
                        className="text-emerald-400 text-[1.2rem] flex-shrink-0 transition-transform duration-300"
                        style={{
                          transform:
                            openFaq === i ? "rotate(45deg)" : "rotate(0)",
                        }}>
                        +
                      </span>
                    </button>
                    <div
                      style={{
                        maxHeight: openFaq === i ? 200 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.4s ease, padding 0.3s",
                        paddingBottom: openFaq === i ? 20 : 0,
                      }}>
                      <p className="text-[#7a9585] leading-[1.7] text-[0.95rem]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-[100px] relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.05) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center,rgba(16,185,129,0.08) 0%,transparent 70%)",
            }}
          />
          <div className="max-w-[1180px] mx-auto px-6 text-center relative">
            <FadeIn>
              <Tag>Mulai Sekarang</Tag>
              <h2
                className="font-syne font-extrabold mt-6 mb-5 leading-[1.15]"
                style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
                Siap Revolusi Proses
                <br />
                Rekrutmen Anda?
              </h2>
              <p className="text-[#7a9585] text-[1rem] max-w-[480px] mx-auto mb-10 leading-[1.7]">
                Mulai gratis. Tidak perlu kartu kredit. Analisis CV pertama Anda
                dalam kurang dari satu menit.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[1rem] px-8 py-[15px] rounded-[10px] hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)]">
                  Upload CV Gratis →
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-500 text-emerald-400 text-black text-[1rem] px-8 py-[15px] rounded-[10px]">
                  Hubungi Tim Sales
                </Button>
              </div>
              <p className="text-[#7a9585] text-[0.8rem] mt-6">
                ✓ Gratis untuk kandidat &nbsp;·&nbsp; ✓ Trial 14 hari untuk HR
                &nbsp;·&nbsp; ✓ Tanpa setup biaya
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#0f1612] border-t border-emerald-500/15 pt-12 pb-8">
          <div className="max-w-[1180px] mx-auto px-6">
            <div
              className="grid gap-10 mb-12"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              <div>
                <div className="flex items-center gap-2 font-syne font-extrabold text-[1.15rem] mb-3">
                  <span className="text-emerald-400">✦</span> RecruitAI
                </div>
                <p className="text-[#7a9585] text-[0.85rem] leading-[1.7] max-w-[260px]">
                  Platform rekrutmen AI terdepan yang membantu perusahaan dan
                  kandidat bertemu dengan cara yang lebih cerdas.
                </p>
              </div>
              {[
                {
                  title: "Produk",
                  links: ["Fitur", "Cara Kerja", "Harga", "Demo"],
                },
                {
                  title: "Perusahaan",
                  links: ["Tentang Kami", "Blog", "Karir", "Kontak"],
                },
                {
                  title: "Legal",
                  links: [
                    "Kebijakan Privasi",
                    "Syarat & Ketentuan",
                    "Keamanan Data",
                  ],
                },
              ].map((col, i) => (
                <div key={i}>
                  <div className="font-bold text-[0.85rem] tracking-[0.05em] mb-4 text-[#e8f0ec]">
                    {col.title}
                  </div>
                  <ul className="flex flex-col gap-[10px]">
                    {col.links.map((l) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="text-[#7a9585] text-[0.85rem] no-underline hover:text-emerald-400 transition-colors">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-emerald-500/15 pt-6 flex justify-between items-center flex-wrap gap-3">
              <p className="text-[#7a9585] text-[0.78rem]">
                © 2025 RecruitAI. All rights reserved.
              </p>
              <p className="text-[#7a9585] text-[0.78rem]">
                Built with Next.js · Supabase · Google Gemini AI
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ── TechCard (separate to avoid inline onMouseEnter/Leave) ────────────────────
function TechCard({ tech }: { tech: TechItem }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-[12px] px-[22px] py-[14px] flex items-center gap-[10px] cursor-default transition-all duration-200"
      style={{
        background: hovered ? "#141f19" : "#0f1612",
        border: `1px solid ${hovered ? tech.color + "60" : "rgba(16,185,129,0.15)"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <span
        className="text-[1.1rem] font-mono font-extrabold"
        style={{ color: tech.color }}>
        {tech.icon}
      </span>
      <span className="font-semibold text-[0.9rem]">{tech.name}</span>
    </div>
  );
}
