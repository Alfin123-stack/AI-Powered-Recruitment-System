"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Upload,
  Brain,
  BarChart3,
  Target,
  Sparkles,
  Briefcase,
  Users,
  Building2,
  Clock,
  Scale,
  XCircle,
  Star,
  Plus,
  TrendingUp,
  Zap,
  CheckCircle2,
  FileText,
  Search,
  LayoutDashboard,
  Shield,
  Award,
  ArrowRight,
  Heart,
  Lightbulb,
  Globe,
  Mail,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = { num: string; title: string; desc: string; icon: React.ReactNode };
type Feature = {
  icon: React.ReactNode;
  title: string;
  badge: string;
  desc: string;
  bullets: string[];
  color: string;
  href: string;
};
type Problem = {
  icon: React.ReactNode;
  title: string;
  stat: string;
  statLabel: string;
  desc: string;
};
type Faq = { q: string; a: string };
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  color: string;
  rating: number;
  tag: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    num: "01",
    icon: <Upload size={20} />,
    title: "Upload CV Anda",
    desc: "Upload file PDF CV kamu. Sistem membaca dan memproses isi dokumen secara otomatis — tidak perlu isi form manual.",
  },
  {
    num: "02",
    icon: <Brain size={20} />,
    title: "AI Menganalisis CV",
    desc: "Model AI kami mengekstraksi skill, pengalaman, pendidikan, dan menilai kesesuaian dengan standar seleksi otomatis dalam hitungan detik.",
  },
  {
    num: "03",
    icon: <BarChart3 size={20} />,
    title: "Dapatkan Skor & Analisis",
    desc: "Sistem memberikan Resume Score, ATS Score, dan Overall Rating dengan penjelasan per kategori yang mudah ditindaklanjuti.",
  },
  {
    num: "04",
    icon: <Target size={20} />,
    title: "Temukan Job yang Cocok",
    desc: "Skill yang terdeteksi dari CV kamu otomatis dipakai untuk menyarankan lowongan paling relevan — langsung dari halaman Job Matches.",
  },
];

const FEATURES: Feature[] = [
  {
    icon: <Brain size={24} />,
    title: "Analisis CV dengan AI",
    badge: "Analisis Cerdas",
    color: "#10b981",
    href: "/analyze",
    desc: "Upload PDF CV dan dapatkan analisis mendalam — ekstraksi skill, penilaian skor, dan rekomendasi perbaikan konkret per bagian.",
    bullets: [
      "Resume Score + ATS Score + Overall Rating",
      "Breakdown skor per kategori (Pengalaman, Pendidikan, dll.)",
      "Rekomendasi perbaikan spesifik per bagian CV",
    ],
  },
  {
    icon: <Briefcase size={24} />,
    title: "Pencocokan Lowongan Otomatis",
    badge: "Smart Matching",
    color: "#06b6d4",
    href: "/jobs",
    desc: "Skill yang terdeteksi dari CV kamu langsung dipakai untuk mencocokkan lowongan paling relevan — tanpa perlu input ulang.",
    bullets: [
      "Skill terdeteksi otomatis dari CV",
      "Saran lowongan berdasarkan profil terkini",
      "Lihat semua lowongan aktif di direktori Jobs",
    ],
  },
  {
    icon: <Users size={24} />,
    title: "Dashboard Rekruter",
    badge: "Untuk HR",
    color: "#f59e0b",
    href: "/dashboard/hr/overview",
    desc: "Dashboard komprehensif untuk tim HR — lihat semua pelamar, bandingkan skor kandidat, dan update status secara real-time.",
    bullets: [
      "Ranking kandidat otomatis berdasarkan skor AI",
      "Shortlist, review, atau tolak kandidat dengan mudah",
      "Lihat CV asli & detail skill setiap kandidat",
    ],
  },
  {
    icon: <Building2 size={24} />,
    title: "Direktori Perusahaan",
    badge: "Company Directory",
    color: "#8b5cf6",
    href: "/company",
    desc: "Kandidat dapat menjelajahi perusahaan yang sedang merekrut, melihat lowongan aktif, dan langsung melamar ke posisi yang tersedia.",
    bullets: [
      "Filter perusahaan per kota & industri",
      "Lihat lowongan aktif per perusahaan",
      "Ikuti perusahaan yang diminati",
    ],
  },
];

const PROBLEMS: Problem[] = [
  {
    icon: <Clock size={28} />,
    title: "Screening Manual Memakan Waktu",
    stat: "73%",
    statLabel:
      "HR menghabiskan lebih dari 6 jam per hari hanya untuk membaca CV",
    desc: "Rata-rata rekruter hanya menghabiskan 7 detik per CV. AI kami memproses dan memberikan skor CV dalam hitungan detik dengan konsistensi yang tidak bisa dilakukan secara manual.",
  },
  {
    icon: <Scale size={28} />,
    title: "Penilaian yang Tidak Objektif",
    stat: "62%",
    statLabel: "Keputusan hiring dipengaruhi penilaian subjektif tak disadari",
    desc: "Penilaian manusia rentan bias. Sistem kami memberikan skor yang objektif dan konsisten, berbasis konten CV yang sebenarnya — bukan kesan pertama.",
  },
  {
    icon: <XCircle size={28} />,
    title: "CV Tidak Lolos Seleksi Awal",
    stat: "75%",
    statLabel: "CV berkualitas gagal di seleksi otomatis sebelum dibaca HR",
    desc: "Banyak kandidat kompeten gugur di tahap pertama. Fitur ATS Score kami mendeteksi masalah sebelum CV dikirim, sehingga kamu punya waktu memperbaikinya.",
  },
];

const FAQS: Faq[] = [
  {
    q: "Apa itu fitur Analisis CV dan bagaimana cara kerjanya?",
    a: "Fitur Analisis CV memproses file PDF menggunakan model kecerdasan buatan. Sistem membaca isi dokumen, mengidentifikasi skill, pengalaman, dan pendidikan, lalu menghasilkan Resume Score (kualitas konten), ATS Score (kesesuaian dengan sistem seleksi otomatis), dan Overall Rating beserta rekomendasi perbaikan yang spesifik.",
  },
  {
    q: "Apakah hasil analisis CV saya tersimpan?",
    a: "Ya, jika kamu sudah login. Hasil analisis termasuk skor, skill yang terdeteksi, dan rekomendasi tersimpan ke akunmu dan bisa dibuka kembali kapan saja. Jika belum login, analisis tetap berjalan tapi tidak tersimpan untuk sesi berikutnya.",
  },
  {
    q: "Bagaimana cara Job Matching bekerja setelah analisis CV?",
    a: "Setelah analisis selesai, skill yang terdeteksi dari CV kamu ditampilkan sebagai label di halaman hasil. Kamu bisa langsung klik 'Lihat Job Matches' untuk melihat lowongan yang paling relevan berdasarkan skill tersebut, atau jelajahi semua lowongan yang tersedia.",
  },
  {
    q: "Apakah data CV saya aman dan terlindungi?",
    a: "CV diproses langsung di perangkat kamu sebelum dikirim untuk dianalisis. File asli disimpan dengan sistem keamanan berlapis sehingga data kamu hanya bisa diakses oleh akunmu sendiri.",
  },
  {
    q: "Apa perbedaan akun Kandidat dan HR?",
    a: "Akun Kandidat dapat menganalisis CV, melihat job matches, menyimpan lowongan, dan memantau status lamaran. Akun HR mendapat akses ke dashboard rekrutmen: melihat semua pelamar, membandingkan skor kandidat, serta mengubah status kandidat.",
  },
  {
    q: "Apakah platform ini gratis digunakan?",
    a: "Fitur analisis CV tersedia gratis untuk kandidat. Cukup buat akun dan langsung upload CV untuk mendapatkan skor dan rekomendasi. Untuk fitur rekrutmen tim HR, tersedia paket yang bisa disesuaikan dengan kebutuhan perusahaan.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Sebelumnya saya sudah lamar ke 20+ perusahaan tapi tidak lolos seleksi awal sama sekali. Setelah pakai RecruitAI, ATS Score saya naik signifikan — dan akhirnya dapat interview pertama dalam 2 minggu.",
    name: "Rizky Aditya",
    role: "Fresh Graduate",
    company: "Teknik Informatika, Universitas Brawijaya",
    avatar: "RA",
    color: "#10b981",
    rating: 5,
    tag: "Kandidat",
  },
  {
    quote:
      "Sebagai HR di startup dengan tim kecil, kami tidak punya waktu untuk baca 200+ CV satu per satu. Dashboard RecruitAI langsung mengurutkan kandidat berdasarkan skor — proses shortlist yang biasanya 3 hari jadi 2 jam.",
    name: "Dinda Maharani",
    role: "HR Manager",
    company: "Inovasi Digital Nusantara",
    avatar: "DM",
    color: "#06b6d4",
    rating: 5,
    tag: "Rekruter",
  },
  {
    quote:
      "Rekomendasinya sangat spesifik — bukan cuma 'perbaiki summary' tapi langsung memberi contoh kalimat yang bisa dipakai. Dalam 3 hari revisi CV, skor match saya ke posisi Frontend Engineer naik signifikan.",
    name: "Fajar Nugroho",
    role: "Frontend Developer",
    company: "2 tahun pengalaman, aktif mencari kerja",
    avatar: "FN",
    color: "#8b5cf6",
    rating: 5,
    tag: "Kandidat",
  },
  {
    quote:
      "Fitur melihat CV asli kandidat langsung dari dashboard sangat membantu — tidak perlu buka tab baru atau download satu per satu. Kombinasi skor AI dan akses CV asli membuat keputusan shortlist jauh lebih percaya diri.",
    name: "Budi Santoso",
    role: "Talent Acquisition Lead",
    company: "GoTech Indonesia",
    avatar: "BS",
    color: "#f59e0b",
    rating: 5,
    tag: "Rekruter",
  },
  {
    quote:
      "Yang paling berguna adalah pencocokan lowongan otomatis setelah upload CV — skill saya langsung dicocokkan dan lowongan yang muncul benar-benar relevan. Tidak perlu filter manual lagi.",
    name: "Sari Wulandari",
    role: "UI/UX Designer",
    company: "Portfolio freelance, 3 tahun pengalaman",
    avatar: "SW",
    color: "#ec4899",
    rating: 5,
    tag: "Kandidat",
  },
  {
    quote:
      "Ranking kandidat berdasarkan skor langsung terurut otomatis. Tim kami bisa fokus ke kandidat terbaik saja dan tidak buang waktu untuk yang jelas tidak sesuai kualifikasi.",
    name: "Andika Pratama",
    role: "Head of People",
    company: "Fintek Maju",
    avatar: "AP",
    color: "#ef4444",
    rating: 5,
    tag: "Rekruter",
  },
];

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  duration = 2200,
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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase">
      {children}
    </span>
  );
}

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
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("candidate");

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <Navbar />

      <main className="pt-16">
        {/* ══════════════════════════════════════════════════════════════════
            1. HERO — foto nyata + badge floating + CTA
        ══════════════════════════════════════════════════════════════════ */}
        <section className="pt-[110px] pb-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none bg-[radial-gradient(ellipse,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid gap-12 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
              {/* Left: Teks */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <div className="mb-5">
                  <Tag>
                    <Sparkles size={9} className="animate-pulse" /> Platform
                    Rekrutmen Berbasis AI
                  </Tag>
                </div>
                <h1 className="font-syne font-extrabold text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.09] tracking-tight mb-6">
                  Upload CV. Dapat Skor.{" "}
                  <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Temukan Pekerjaan yang Cocok.
                  </span>
                </h1>
                <p className="text-[#7a9585] text-[1rem] leading-[1.78] mb-8 max-w-[500px]">
                  RecruitAI menggunakan kecerdasan buatan untuk menganalisis CV
                  kamu secara otomatis — menghasilkan skor kualitas, tingkat
                  kompatibilitas seleksi, rekomendasi perbaikan, dan menyarankan
                  lowongan yang paling sesuai dengan profilmu.
                </p>

                {/* 3 nilai utama */}
                <div className="grid grid-cols-3 rounded-[12px] overflow-hidden border border-emerald-500/15 gap-[1px] bg-[rgba(16,185,129,0.12)] mb-8 max-w-[460px]">
                  {[
                    { icon: <Brain size={16} />, label: "Analisis AI" },
                    { icon: <Zap size={16} />, label: "Hasil 30 detik" },
                    { icon: <Target size={16} />, label: "Job Matching" },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#0f1612] py-4 px-3 text-center">
                      <div className="flex justify-center text-emerald-400 mb-1">
                        {s.icon}
                      </div>
                      <div className="text-[#7a9585] text-[0.72rem]">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href="/analyze"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.88rem] px-6 py-[11px] rounded-[10px] no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_28px_rgba(16,185,129,0.3)]">
                    <FileText size={14} /> Analisis CV Sekarang
                  </Link>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] text-[0.88rem] px-6 py-[10px] rounded-[10px] no-underline transition-all">
                    Lihat Lowongan <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>

              {/* Right: Foto nyata dengan badge floating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative h-[420px] max-lg:h-[280px] rounded-[24px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0d]/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-emerald-900/20 z-[5] mix-blend-multiply" />
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
                  alt="Tim profesional bekerja bersama"
                  className="w-full h-full object-cover"
                />
                {/* Badge ATS Score */}
                <div className="absolute bottom-6 left-6 z-20 bg-[#0a0f0d]/90 border border-emerald-500/30 backdrop-blur-sm rounded-[12px] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <BarChart3 size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-[#7a9585]">ATS Score</p>
                    <p className="text-[0.9rem] font-bold text-emerald-400">
                      82 / 100
                    </p>
                  </div>
                </div>
                {/* Badge Job Match */}
                <div className="absolute top-6 right-6 z-20 bg-[#0a0f0d]/90 border border-cyan-500/30 backdrop-blur-sm rounded-[12px] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Award size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-[#7a9585]">Job Match</p>
                    <p className="text-[0.9rem] font-bold text-cyan-400">
                      8 lowongan
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            2. STATS BAR
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-14 bg-[#0f1612] border-y border-emerald-500/[0.08]">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  value: 5000,
                  suffix: "+",
                  label: "CV Dianalisis",
                  color: "#10b981",
                },
                {
                  value: 98,
                  suffix: "%",
                  label: "Akurasi Ekstraksi Skill",
                  color: "#06b6d4",
                },
                {
                  value: 30,
                  suffix: " dtk",
                  label: "Rata-rata Waktu Analisis",
                  color: "#f59e0b",
                },
                {
                  value: 200,
                  suffix: "+",
                  label: "Perusahaan Terdaftar",
                  color: "#8b5cf6",
                },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.1} className="text-center">
                  <div
                    className="font-syne font-extrabold text-[2.4rem] leading-none mb-1"
                    style={{ color: s.color }}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-[#7a9585] text-[0.82rem]">{s.label}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            3. MASALAH (foto data analitik di kiri)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Photo + intro */}
            <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1 mb-[80px]">
              <FadeIn
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
              </FadeIn>

              <FadeIn delay={0.1}>
                <Tag>Mengapa RecruitAI</Tag>
                <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] mt-4 mb-5">
                  Rekrutmen Konvensional Sudah Tidak Cukup
                </h2>
                <p className="text-[#7a9585] text-[0.95rem] leading-[1.78] mb-6">
                  Proses screening CV manual memakan waktu berjam-jam per hari,
                  rentan bias, dan tidak konsisten. Di sisi lain, kandidat
                  kompeten sering gagal di seleksi awal hanya karena CV mereka
                  tidak dioptimalkan untuk sistem ATS — bukan karena mereka
                  tidak layak.
                </p>
                <p className="text-[#7a9585] text-[0.95rem] leading-[1.78] mb-6">
                  RecruitAI hadir untuk memecahkan gap ini: memberikan kandidat
                  analisis CV yang objektif dan rekomendasi konkret, sekaligus
                  membantu HR memilah ratusan pelamar dengan efisien berbasis
                  data.
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
              </FadeIn>
            </div>

            {/* Problem cards */}
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              {PROBLEMS.map((p, i) => (
                <FadeIn key={i} delay={i * 0.12}>
                  <Card className="h-full flex flex-col">
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
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            4. CARA KERJA — steps + mock result card
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px] bg-[#0f1612]">
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Section header with photo */}
            <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1 mb-[80px]">
              <FadeIn>
                <Tag>Cara Kerja</Tag>
                <h2 className="font-syne font-extrabold mt-4 mb-5 leading-[1.15] text-[clamp(1.8rem,3vw,2.4rem)]">
                  Dari Upload ke Insight dalam 30 Detik
                </h2>
                <p className="text-[#7a9585] leading-[1.7] text-[0.95rem]">
                  Proses otomatis dari awal hingga akhir: isi CV dibaca dan
                  dikirim ke sistem AI untuk dianalisis, lalu hasilnya langsung
                  ditampilkan dan tersimpan ke akunmu.
                </p>
              </FadeIn>
              <FadeIn
                delay={0.1}
                className="relative h-[260px] rounded-[20px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1612]/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-cyan-900/20 z-[5] mix-blend-multiply" />
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"
                  alt="Analisis data AI"
                  className="w-full h-full object-cover"
                />
              </FadeIn>
            </div>

            {/* Steps + mock card */}
            <div className="grid gap-20 items-start [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
              <ol className="flex flex-col">
                {STEPS.map((s, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <li
                      className="flex gap-5 relative"
                      style={{ paddingBottom: i < STEPS.length - 1 ? 32 : 0 }}>
                      {i < STEPS.length - 1 && (
                        <div
                          className="absolute left-[23px] w-[2px] bg-gradient-to-b from-emerald-500 to-transparent"
                          style={{ top: 48, bottom: -28 }}
                        />
                      )}
                      <div className="w-[46px] h-[46px] rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 z-10">
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
                    </li>
                  </FadeIn>
                ))}
              </ol>

              {/* Mock result card */}
              <FadeIn delay={0.2}>
                <div className="bg-[#0a0f0d] border border-emerald-500/15 rounded-[20px] p-7 shadow-[0_0_80px_rgba(16,185,129,0.1)]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-[0.72rem] text-[#7a9585] mb-1">
                        LAPORAN ANALISIS CV
                      </div>
                      <div className="font-syne font-bold text-[1.1rem]">
                        Arif Pratama
                      </div>
                      <div className="text-[#7a9585] text-[0.82rem]">
                        Frontend Developer
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-[8px] px-3 py-[6px] text-[0.72rem] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Analisis Selesai
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                      { label: "Resume Score", val: 82, color: "#10b981" },
                      { label: "ATS Score", val: 76, color: "#8b5cf6" },
                      { label: "Overall", val: 79, color: "#f59e0b" },
                    ].map((ring, i) => (
                      <div
                        key={i}
                        className="bg-[#141f19] rounded-[12px] p-3 text-center">
                        <div
                          className="w-[70px] h-[70px] rounded-full flex items-center justify-center relative mx-auto mb-2"
                          style={{
                            background: `conic-gradient(${ring.color} 0% ${ring.val}%, rgba(255,255,255,0.06) ${ring.val}%)`,
                          }}>
                          <div className="absolute w-[52px] h-[52px] rounded-full bg-[#141f19]" />
                          <span
                            className="relative z-10 font-syne text-[1rem] font-extrabold"
                            style={{ color: ring.color }}>
                            {ring.val}
                          </span>
                        </div>
                        <div className="text-[0.65rem] text-[#7a9585]">
                          {ring.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-5">
                    <div className="text-[0.72rem] text-[#7a9585] mb-2 flex items-center gap-1">
                      <Search size={10} /> SKILL TERDETEKSI
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
                          className="inline-flex items-center bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-[6px] text-[0.75rem] font-medium font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-[10px] px-4 py-[14px] mb-4">
                    <div className="text-[0.72rem] text-amber-400 font-semibold mb-2 flex items-center gap-1">
                      <Sparkles size={10} /> REKOMENDASI PERBAIKAN
                    </div>
                    <ul className="list-disc pl-4 text-[#7a9585] text-[0.8rem] leading-[1.7]">
                      <li>
                        Tambahkan angka kuantitatif pada pencapaian (mis.
                        "meningkatkan performa 40%")
                      </li>
                      <li>
                        Bagian ringkasan perlu diperkuat dengan nilai jual yang
                        jelas
                      </li>
                    </ul>
                  </div>

                  <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-[10px] px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[0.72rem] text-emerald-400 font-semibold mb-[2px] flex items-center gap-1">
                        <Target size={10} /> LOWONGAN YANG COCOK TERSEDIA
                      </div>
                      <div className="text-[0.72rem] text-[#7a9585]">
                        Berdasarkan 8 skill yang terdeteksi
                      </div>
                    </div>
                    <div className="text-[0.75rem] text-emerald-400 font-bold whitespace-nowrap flex items-center gap-1">
                      Lihat Lowongan <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            5. CARA KERJA VISUAL (3 langkah foto)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Proses Nyata</Tag>
              <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
                Tiga Langkah yang Mengubah Kariermu
              </h2>
              <p className="text-[#7a9585] max-w-[480px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
                Dari unggah CV hingga dapat panggilan interview — prosesnya
                sederhana, hasilnya nyata.
              </p>
            </FadeIn>

            <div className="flex flex-col gap-16">
              {[
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
              ].map((step, i) => (
                <FadeIn key={i} delay={0.1}>
                  <div
                    className={`grid gap-12 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1`}>
                    <div
                      className={
                        step.reverse ? "order-last max-lg:order-none" : ""
                      }>
                      <div
                        className="font-syne font-extrabold text-[4.5rem] leading-none mb-3 opacity-[0.07]"
                        style={{ color: step.color }}>
                        {step.num}
                      </div>
                      <h3 className="font-syne font-bold text-[1.5rem] text-[#e8f0ec] mb-4">
                        {step.title}
                      </h3>
                      <p className="text-[#7a9585] text-[0.95rem] leading-[1.78]">
                        {step.desc}
                      </p>
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
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            6. FITUR UTAMA — 4 kartu
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px] bg-[#0f1612]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Fitur Utama</Tag>
              <h2 className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
                Semua yang Anda Butuhkan, Dalam Satu Platform
              </h2>
              <p className="text-[#7a9585] max-w-[520px] mx-auto leading-[1.7]">
                Dari analisis CV untuk kandidat hingga dashboard rekrutmen untuk
                HR — semua tersedia dan terintegrasi.
              </p>
            </FadeIn>
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
              {FEATURES.map((f, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Card className="h-full flex flex-col">
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                      style={{ background: `${f.color}15`, color: f.color }}>
                      {f.icon}
                    </div>
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
                    <ul className="flex flex-col gap-[6px] mb-4">
                      {f.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-[#7a9585] text-[0.82rem]">
                          <CheckCircle2
                            size={14}
                            className="flex-shrink-0 mt-[1px]"
                            style={{ color: f.color }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={f.href}
                      className="mt-auto text-[0.78rem] font-semibold flex items-center gap-1 transition-colors"
                      style={{ color: f.color }}>
                      Coba fitur ini <ArrowRight size={13} />
                    </Link>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            7. UNTUK SIAPA — tab kandidat / HR
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Header with team photo */}
            <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1 mb-[60px]">
              <FadeIn>
                <Tag>Untuk Siapa</Tag>
                <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] mb-5">
                  Dirancang untuk Kandidat dan Tim HR
                </h2>
                <p className="text-[#7a9585] text-[0.95rem] leading-[1.78]">
                  Platform ini melayani dua sisi proses rekrutmen — pencari
                  kerja yang ingin tampil lebih kuat, dan tim HR yang ingin
                  proses seleksi lebih efisien berbasis data.
                </p>
              </FadeIn>
              <FadeIn
                delay={0.1}
                className="relative rounded-[20px] overflow-hidden h-[260px]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-emerald-900/20 z-[5] mix-blend-multiply" />
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Tim developer dan HR bekerja bersama"
                  className="w-full h-full object-cover"
                />
              </FadeIn>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-2 mb-10">
              {[
                {
                  k: "candidate",
                  l: "Kandidat / Pencari Kerja",
                  icon: <FileText size={15} />,
                },
                {
                  k: "hr",
                  l: "HR / Perusahaan",
                  icon: <Building2 size={15} />,
                },
              ].map(({ k, l, icon }) => (
                <button
                  key={k}
                  onClick={() => setActiveTab(k)}
                  className={`px-6 py-[10px] rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-all border flex items-center gap-2
                    ${
                      activeTab === k
                        ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-400"
                        : "bg-transparent border-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                    }`}>
                  {icon} {l}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                {(activeTab === "candidate"
                  ? [
                      {
                        icon: <TrendingUp size={28} />,
                        title: "Skor CV Instan",
                        desc: "Ketahui seberapa kuat CV kamu berdasarkan Resume Score, ATS Score, dan Overall Rating dalam hitungan detik.",
                        href: "/analyze",
                      },
                      {
                        icon: <Target size={28} />,
                        title: "Pencocokan Lowongan Otomatis",
                        desc: "Skill yang terdeteksi dari CV langsung dipakai untuk menyarankan lowongan paling relevan — tidak perlu input ulang.",
                        href: "/dashboard/candidate/matches",
                      },
                      {
                        icon: <Sparkles size={28} />,
                        title: "Rekomendasi Konkret",
                        desc: "Dapatkan saran perbaikan spesifik per bagian CV yang bisa langsung diimplementasikan untuk meningkatkan skor.",
                        href: "/analyze",
                      },
                      {
                        icon: <CheckCircle2 size={28} />,
                        title: "Cek Kompatibilitas Seleksi",
                        desc: "ATS Score menunjukkan seberapa baik CV kamu akan terbaca oleh sistem seleksi otomatis perusahaan sebelum sampai ke HR.",
                        href: "/analyze",
                      },
                    ]
                  : [
                      {
                        icon: <Award size={28} />,
                        title: "Ranking Kandidat Otomatis",
                        desc: "Semua pelamar diurutkan otomatis berdasarkan skor AI — tanpa perlu membaca satu per satu secara manual.",
                        href: "/dashboard/hr/overview",
                      },
                      {
                        icon: <Search size={28} />,
                        title: "Detail Kandidat & CV",
                        desc: "Lihat skill terdeteksi, rincian skor, dan akses CV asli kandidat langsung dari dashboard tanpa berpindah halaman.",
                        href: "/dashboard/hr/overview",
                      },
                      {
                        icon: <Zap size={28} />,
                        title: "Update Status Cepat",
                        desc: "Shortlist, pindahkan ke review, atau tolak kandidat dengan satu klik. Status terupdate langsung ke sistem.",
                        href: "/dashboard/hr/overview",
                      },
                      {
                        icon: <LayoutDashboard size={28} />,
                        title: "Ringkasan per Posisi",
                        desc: "Lihat jumlah pelamar dan persentase shortlisted per posisi lowongan dalam tampilan yang mudah dibaca.",
                        href: "/dashboard/hr/overview",
                      },
                    ]
                ).map((c, i) => (
                  <Link key={i} href={c.href} className="no-underline block">
                    <Card className="h-full cursor-pointer group">
                      <div className="text-emerald-400 mb-3 group-hover:text-emerald-300 transition-colors">
                        {c.icon}
                      </div>
                      <h3 className="font-syne font-bold text-[0.95rem] mb-2 group-hover:text-emerald-400 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-[#7a9585] text-[0.85rem] leading-[1.6]">
                        {c.desc}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            8. MISI & VISI — 3 kartu foto
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px] bg-[#0f1612]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Misi & Visi</Tag>
              <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
                Apa yang Kami Perjuangkan
              </h2>
              <p className="text-[#7a9585] max-w-[480px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
                RecruitAI bukan sekadar alat — ini adalah upaya mewujudkan
                rekrutmen yang lebih adil dan efisien untuk semua.
              </p>
            </FadeIn>

            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              {[
                {
                  img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
                  imgAlt: "Tim berdiskusi misi",
                  overlayColor: "#10b981",
                  borderColor: "border-emerald-500/20",
                  iconBg: "bg-emerald-500/10 border-emerald-500/20",
                  icon: <Target size={22} className="text-emerald-400" />,
                  titleColor: "text-emerald-400",
                  title: "Misi Kami",
                  desc: "Mendemokratisasi akses ke proses rekrutmen yang adil dan efisien — di mana setiap kandidat kompeten punya kesempatan yang sama untuk ditemukan, dan setiap perusahaan dapat menemukan talenta terbaik dengan proses yang lebih cepat, objektif, dan berbasis data.",
                },
                {
                  img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
                  imgAlt: "Visi masa depan",
                  overlayColor: "#06b6d4",
                  borderColor: "border-cyan-500/20",
                  iconBg: "bg-cyan-500/10 border-cyan-500/20",
                  icon: <TrendingUp size={22} className="text-cyan-400" />,
                  titleColor: "text-cyan-400",
                  title: "Visi Kami",
                  desc: "Menjadi infrastruktur rekrutmen digital terpercaya di Indonesia — tempat di mana teknologi AI bukan pengganti keputusan manusia, melainkan alat yang memperkuat kemampuan HR dan kandidat untuk membuat keputusan yang lebih baik.",
                },
                {
                  img: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=600&q=80",
                  imgAlt: "Nilai dan budaya tim",
                  overlayColor: "#f59e0b",
                  borderColor: "border-amber-500/20",
                  iconBg: "bg-amber-500/10 border-amber-500/20",
                  icon: <Heart size={22} className="text-amber-400" />,
                  titleColor: "text-amber-400",
                  title: "Nilai Kami",
                  isValues: true,
                  values: [
                    "Objektivitas tanpa kompromi",
                    "Transparansi dalam setiap skor",
                    "Inklusif untuk semua latar belakang",
                    "Inovasi yang berpusat pada pengguna",
                  ],
                },
              ].map((card, i) => (
                <FadeIn key={i} delay={i * 0.1}>
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
                          {card.values!.map((v, j) => (
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
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            9. TESTIMONI
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px]">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Testimoni</Tag>
              <h2 className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
                Dipercaya Kandidat & Tim HR
              </h2>
              <p className="text-[#7a9585] max-w-[480px] mx-auto leading-[1.7] text-[0.95rem]">
                Dari pencari kerja yang akhirnya lolos seleksi awal hingga
                rekruter yang mempersingkat proses shortlist dari hari ke jam.
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

        {/* ══════════════════════════════════════════════════════════════════
            10. FAQ
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px] bg-[#0f1612]">
          <div className="max-w-[760px] mx-auto px-6">
            <FadeIn className="text-center mb-[56px]">
              <Tag>FAQ</Tag>
              <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
                Pertanyaan yang Sering Diajukan
              </h2>
            </FadeIn>
            <dl>
              {FAQS.map((f, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="border-b border-emerald-500/15">
                    <dt>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full bg-transparent border-0 text-[#e8f0ec] font-syne font-semibold text-[1rem] py-[22px] text-left flex justify-between items-center gap-4 cursor-pointer hover:text-emerald-400 transition-colors">
                        <span>{f.q}</span>
                        <Plus
                          size={18}
                          className={`text-emerald-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : "rotate-0"}`}
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
                </FadeIn>
              ))}
            </dl>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            11. CTA FINAL — foto background + tombol utama
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-[100px] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=60"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-[0.04]"
            />
          </div>
          <div className="max-w-[700px] mx-auto px-6 text-center relative">
            <FadeIn>
              <Tag>
                <Sparkles size={9} className="animate-pulse" /> Mulai Gratis
              </Tag>
              <h2 className="font-syne font-extrabold mt-6 mb-5 leading-[1.12] text-[clamp(2rem,4vw,3.2rem)]">
                CV Kamu Sudah Siap. <br />
                <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Tahu Seberapa Kuatnya?
                </span>
              </h2>
              <p className="text-[#7a9585] text-[0.95rem] leading-[1.72] mb-10 max-w-[480px] mx-auto">
                Upload PDF CV kamu dan dalam 30 detik kamu tahu skor kualitas,
                seberapa lolos seleksi otomatis, serta lowongan mana yang paling
                cocok dengan profilmu.
              </p>
              <div className="flex items-center gap-4 justify-center flex-wrap mb-6">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.95rem] px-8 py-[13px] rounded-[11px] no-underline transition-all hover:-translate-y-[2px] hover:shadow-[0_10px_36px_rgba(16,185,129,0.32)]">
                  <FileText size={16} /> Analisis CV Sekarang
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] text-[0.88rem] px-6 py-[12px] rounded-[10px] no-underline transition-all">
                  <Mail size={14} /> Hubungi Kami
                </Link>
              </div>
              <p className="text-[#4a6b58] text-[0.78rem] flex items-center justify-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" /> Gratis
                  untuk kandidat
                </span>
                <span className="text-[#2a4035]">·</span>
                <span className="flex items-center gap-1">
                  <Zap size={12} className="text-emerald-600" /> Hasil dalam 30
                  detik
                </span>
                <span className="text-[#2a4035]">·</span>
                <span className="flex items-center gap-1">
                  <Shield size={12} className="text-emerald-600" /> Data aman &
                  terenkripsi
                </span>
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <footer className="bg-[#0a0f0d] border-t border-emerald-500/10 pt-14 pb-8">
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Strip HR */}
            <div className="flex items-center justify-between gap-6 flex-wrap bg-emerald-500/[0.05] border border-emerald-500/15 rounded-[14px] px-7 py-5 mb-14">
              <div>
                <p className="font-syne font-bold text-[0.95rem] text-[#e8f0ec] mb-[3px]">
                  Kamu dari tim HR atau perusahaan?
                </p>
                <p className="text-[#7a9585] text-[0.82rem]">
                  Hubungi kami untuk akses dashboard rekrutmen dan mulai terima
                  lamaran dengan analisis AI.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex items-center gap-2 border border-emerald-500/35 text-emerald-400 hover:bg-emerald-500/[0.08] px-5 py-[9px] rounded-[9px] no-underline text-[0.84rem] font-semibold transition-all whitespace-nowrap flex-shrink-0">
                <Building2 size={14} /> Hubungi Kami
              </Link>
            </div>

            {/* Grid kolom */}
            <div className="grid gap-10 mb-12 [grid-template-columns:2fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-2 font-syne font-extrabold text-[1.15rem] mb-3 text-[#e8f0ec]">
                  <Sparkles size={16} className="text-emerald-400" />
                  RecruitAI
                </div>
                <p className="text-[#7a9585] text-[0.855rem] leading-[1.72] max-w-[270px] mb-5">
                  Platform rekrutmen berbasis kecerdasan buatan. Membantu
                  kandidat tampil lebih baik dan perusahaan menemukan talenta
                  yang tepat.
                </p>
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-2 text-[#4a6b58] text-[0.78rem]">
                    <Brain size={13} className="text-emerald-700" />
                    Didukung model AI generatif terkini
                  </div>
                  <div className="flex items-center gap-2 text-[#4a6b58] text-[0.78rem]">
                    <Shield size={13} className="text-emerald-700" />
                    Dibuat di Indonesia, untuk pasar lokal
                  </div>
                </div>
              </div>

              <nav>
                <div className="font-syne font-bold text-[0.82rem] tracking-[0.07em] uppercase text-[#c8d9d0] mb-4">
                  Platform
                </div>
                <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
                  {[
                    {
                      label: "Analisis CV",
                      href: "/analyze",
                      icon: <FileText size={12} />,
                    },
                    {
                      label: "Cari Lowongan",
                      href: "/jobs",
                      icon: <Search size={12} />,
                    },
                    {
                      label: "Direktori Perusahaan",
                      href: "/company",
                      icon: <Building2 size={12} />,
                    },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[#7a9585] text-[0.855rem] no-underline hover:text-emerald-400 transition-colors flex items-center gap-[7px]">
                        <span className="opacity-55">{l.icon}</span>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav>
                <div className="font-syne font-bold text-[0.82rem] tracking-[0.07em] uppercase text-[#c8d9d0] mb-4">
                  Informasi
                </div>
                <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
                  {[
                    { label: "Pertanyaan Umum", href: "/faq" },
                    { label: "Hubungi Kami", href: "/contact" },
                    { label: "Kebijakan Privasi", href: "/privacy" },
                    { label: "Syarat & Ketentuan", href: "/terms" },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[#7a9585] text-[0.855rem] no-underline hover:text-emerald-400 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-emerald-500/10 pt-6 flex justify-between items-center flex-wrap gap-3">
              <p className="text-[#4a6b58] text-[0.775rem]">
                © 2025 RecruitAI. Hak cipta dilindungi undang-undang.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-[6px] text-[#4a6b58] text-[0.775rem]">
                  <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 inline-block" />
                  Semua sistem berjalan normal
                </span>
                <Link
                  href="/privacy"
                  className="text-[#4a6b58] text-[0.775rem] no-underline hover:text-[#7a9585] transition-colors">
                  Privasi
                </Link>
                <Link
                  href="/terms"
                  className="text-[#4a6b58] text-[0.775rem] no-underline hover:text-[#7a9585] transition-colors">
                  Ketentuan
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
