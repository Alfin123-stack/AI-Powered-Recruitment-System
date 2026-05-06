"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  ChevronRight,
  TrendingUp,
  Zap,
  CheckCircle2,
  FileText,
  Search,
  LayoutDashboard,
  Bookmark,
  Settings,
  Shield,
  Award,
  ArrowRight,
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

const CANDIDATE_CARDS = [
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
];

const HR_CARDS = [
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
export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("candidate");

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <Navbar />

      <main className="pt-16">
        {/* ── HERO ── */}
        <section
          className="pt-[120px] pb-20 relative overflow-hidden"
          id="hero"
          aria-labelledby="hero-heading">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
          <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(6,182,212,0.07)_0%,transparent_70%)]" />

          <div className="max-w-[1180px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-[820px] mx-auto">
              <div className="mb-6">
                <Tag>
                  <Sparkles size={10} className="animate-pulse" /> Platform
                  Rekrutmen Berbasis Kecerdasan Buatan
                </Tag>
              </div>

              <h1
                id="hero-heading"
                className="font-syne font-extrabold leading-[1.08] tracking-tight mb-6 text-[clamp(2.6rem,6vw,4.2rem)]">
                Upload CV. Dapat Skor.{" "}
                <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Temukan Pekerjaan yang Cocok.
                </span>
              </h1>

              <p className="text-[#7a9585] text-[1.15rem] leading-[1.7] max-w-[620px] mx-auto mb-10">
                RecruitAI menggunakan kecerdasan buatan untuk menganalisis CV
                kamu secara otomatis — menghasilkan skor kualitas, tingkat
                kompatibilitas seleksi, rekomendasi perbaikan, dan menyarankan
                lowongan yang paling sesuai dengan profilmu.
              </p>

              <div className="flex gap-3 justify-center flex-wrap mb-[60px]">
                <Button
                  asChild
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[0.95rem] px-7 py-[13px] rounded-[10px] hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)]">
                  <Link href="/analyze" className="flex items-center gap-2">
                    Analisis CV Sekarang <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/15 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/[0.05] text-[#e8f0ec] text-[0.95rem] px-7 py-[13px] rounded-[10px]">
                  <Link href="/jobs" className="flex items-center gap-2">
                    <Briefcase size={16} /> Lihat Lowongan
                  </Link>
                </Button>
              </div>

              {/* 3 nilai utama */}
              <div className="grid grid-cols-3 max-w-[600px] mx-auto rounded-[14px] overflow-hidden border border-emerald-500/15 gap-[1px] bg-[rgba(16,185,129,0.15)]">
                {[
                  { icon: <Brain size={20} />, label: "Analisis berbasis AI" },
                  {
                    icon: <Zap size={20} />,
                    label: "Hasil dalam hitungan detik",
                  },
                  {
                    icon: <Target size={20} />,
                    label: "Pencocokan lowongan otomatis",
                  },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0f1612] py-5 px-4 text-center">
                    <div className="flex justify-center text-emerald-400 mb-1">
                      {s.icon}
                    </div>
                    <div className="text-[#7a9585] text-[0.78rem]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MASALAH ── */}
        <section
          className="py-[100px] bg-[#0f1612]"
          id="masalah"
          aria-labelledby="masalah-heading">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Permasalahan</Tag>
              <h2
                id="masalah-heading"
                className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
                Mengapa Rekrutmen Konvensional Gagal?
              </h2>
              <p className="text-[#7a9585] max-w-[560px] mx-auto leading-[1.7]">
                Proses hiring tradisional penuh dengan inefisiensi yang
                merugikan perusahaan dan kandidat berkualitas.
              </p>
            </FadeIn>
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              {PROBLEMS.map((p, i) => (
                <FadeIn key={i} delay={i * 0.12}>
                  <Card className="h-full flex flex-col">
                    <div className="text-emerald-400 mb-4" aria-hidden="true">
                      {p.icon}
                    </div>
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
        <section
          className="py-[100px]"
          id="cara-kerja"
          aria-labelledby="cara-kerja-heading">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid gap-20 items-center [grid-template-columns:1fr_1fr]">
              <div>
                <FadeIn>
                  <Tag>Cara Kerja</Tag>
                  <h2
                    id="cara-kerja-heading"
                    className="font-syne font-extrabold mt-4 mb-4 leading-[1.15] text-[clamp(1.8rem,3vw,2.4rem)]">
                    Dari Upload ke Insight dalam 30 Detik
                  </h2>
                  <p className="text-[#7a9585] leading-[1.7] mb-10 text-[0.95rem]">
                    Proses otomatis dari awal hingga akhir: isi CV dibaca dan
                    dikirim ke sistem AI untuk dianalisis, lalu hasilnya
                    langsung ditampilkan dan tersimpan ke akunmu.
                  </p>
                </FadeIn>

                <ol className="flex flex-col">
                  {STEPS.map((s, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <li
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
                        <div
                          className="w-[46px] h-[46px] rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 z-10"
                          aria-hidden="true">
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
              </div>

              {/* Mock result card */}
              <FadeIn delay={0.2}>
                <div
                  className="bg-[#0f1612] border border-emerald-500/15 rounded-[20px] p-7 shadow-[0_0_80px_rgba(16,185,129,0.12),0_0_160px_rgba(6,182,212,0.06)]"
                  aria-label="Contoh tampilan hasil analisis CV">
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

                  {/* 3 score rings */}
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
                            background: `conic-gradient(${ring.color} 0% ${ring.val}%, rgba(255,255,255,0.08) ${ring.val}%)`,
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

                  {/* Skills */}
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

                  {/* Recommendations */}
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

                  {/* Job matches CTA */}
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

        {/* ── FITUR UTAMA ── */}
        <section
          className="py-[100px] bg-[#0f1612]"
          id="fitur"
          aria-labelledby="fitur-heading">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Fitur Utama</Tag>
              <h2
                id="fitur-heading"
                className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
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
                          />{" "}
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

        {/* ── UNTUK SIAPA (TABS) ── */}
        <section className="py-[100px]" aria-labelledby="untuk-siapa-heading">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-12">
              <Tag>Untuk Siapa</Tag>
              <h2
                id="untuk-siapa-heading"
                className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
                Dirancang untuk Dua Peran Kunci
              </h2>
            </FadeIn>

            <div
              className="flex justify-center gap-2 mb-10"
              role="tablist"
              aria-label="Pilih peran">
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
                  role="tab"
                  aria-selected={activeTab === k}
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
              role="tabpanel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                {(activeTab === "candidate" ? CANDIDATE_CARDS : HR_CARDS).map(
                  (c, i) => (
                    <Link key={i} href={c.href} className="no-underline block">
                      <Card className="h-full cursor-pointer group">
                        <div
                          className="text-emerald-400 mb-3 group-hover:text-emerald-300 transition-colors"
                          aria-hidden="true">
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
                  ),
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section
          className="py-[100px] bg-[#0f1612]"
          id="testimoni"
          aria-labelledby="testimoni-heading">
          <div className="max-w-[1180px] mx-auto px-6">
            <FadeIn className="text-center mb-[60px]">
              <Tag>Testimoni</Tag>
              <h2
                id="testimoni-heading"
                className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
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
                  <article className="bg-[#0a0f0d] border border-emerald-500/15 rounded-[16px] p-7 flex flex-col gap-5 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-[2px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex gap-[3px]"
                        aria-label={`Rating ${t.rating} dari 5`}>
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star
                            key={j}
                            size={14}
                            className="text-amber-400 fill-amber-400"
                            aria-hidden="true"
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
                      <span
                        className="text-emerald-400 text-[1.4rem] font-syne leading-none mr-1"
                        aria-hidden="true">
                        "
                      </span>
                      {t.quote}
                      <span
                        className="text-emerald-400 text-[1.4rem] font-syne leading-none ml-1"
                        aria-hidden="true">
                        "
                      </span>
                    </blockquote>

                    <footer className="flex items-center gap-3 pt-1 border-t border-emerald-500/10">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-extrabold text-[0.78rem] flex-shrink-0"
                        style={{ background: `${t.color}18`, color: t.color }}
                        aria-hidden="true">
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

        {/* ── FAQ ── */}
        <section className="py-[100px]" id="faq" aria-labelledby="faq-heading">
          <div className="max-w-[760px] mx-auto px-6">
            <FadeIn className="text-center mb-[56px]">
              <Tag>FAQ</Tag>
              <h2
                id="faq-heading"
                className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
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
                        aria-expanded={openFaq === i}
                        className="w-full bg-transparent border-0 text-[#e8f0ec] font-syne font-semibold text-[1rem] py-[22px] text-left flex justify-between items-center gap-4 cursor-pointer hover:text-emerald-400 transition-colors">
                        <span>{f.q}</span>
                        <Plus
                          size={18}
                          className={`text-emerald-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : "rotate-0"}`}
                          aria-hidden="true"
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

        {/* ── CTA ── */}
        <section
          className="py-[100px] relative overflow-hidden bg-[#0f1612]"
          aria-labelledby="cta-heading">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
          <div className="max-w-[1180px] mx-auto px-6 text-center relative">
            <FadeIn>
              <Tag>Mulai Sekarang</Tag>
              <h2
                id="cta-heading"
                className="font-syne font-extrabold mt-6 mb-5 leading-[1.15] text-[clamp(2rem,4vw,3rem)]">
                Siap Analisis CV
                <br />
                atau Rekrut Lebih Cerdas?
              </h2>
              <p className="text-[#7a9585] text-[1rem] max-w-[480px] mx-auto mb-10 leading-[1.7]">
                Pilih peran yang sesuai dan mulai sekarang — gratis, tanpa perlu
                kartu kredit.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    asChild
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[1rem] px-8 py-[15px] rounded-[10px] hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)]">
                    <Link href="/analyze" className="flex items-center gap-2">
                      <FileText size={16} /> Analisis CV Saya
                    </Link>
                  </Button>
                  <p className="text-[#7a9585] text-[0.75rem] flex items-center gap-1">
                    <Users size={11} /> Untuk Kandidat
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/[0.06] text-[1rem] px-8 py-[15px] rounded-[10px]">
                    <Link
                      href="/dashboard/hr/overview"
                      className="flex items-center gap-2">
                      <LayoutDashboard size={16} /> Buka Dashboard HR
                    </Link>
                  </Button>
                  <p className="text-[#7a9585] text-[0.75rem] flex items-center gap-1">
                    <Building2 size={11} /> Untuk Rekruter
                  </p>
                </div>
              </div>
              <p className="text-[#7a9585] text-[0.8rem] mt-8 flex items-center justify-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Gratis
                  untuk kandidat
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Brain size={13} className="text-emerald-400" /> Analisis
                  berbasis AI
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Shield size={13} className="text-emerald-400" /> Data aman &
                  terenkripsi
                </span>
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#0a0f0d] border-t border-emerald-500/15 pt-12 pb-8">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="grid gap-10 mb-12 [grid-template-columns:2fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-2 font-syne font-extrabold text-[1.15rem] mb-3">
                  <Sparkles
                    size={16}
                    className="text-emerald-400"
                    aria-hidden="true"
                  />{" "}
                  RecruitAI
                </div>
                <p className="text-[#7a9585] text-[0.85rem] leading-[1.7] max-w-[260px]">
                  Platform rekrutmen berbasis kecerdasan buatan yang
                  menghubungkan kandidat terbaik dengan perusahaan yang tepat.
                </p>
              </div>

              {[
                {
                  title: "Produk",
                  links: [
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
                    {
                      label: "Dashboard HR",
                      href: "/dashboard/hr/overview",
                      icon: <LayoutDashboard size={12} />,
                    },
                  ],
                },
                {
                  title: "Kandidat",
                  links: [
                    {
                      label: "Dashboard",
                      href: "/dashboard/candidate",
                      icon: <LayoutDashboard size={12} />,
                    },
                    {
                      label: "Lamaran Saya",
                      href: "/dashboard/candidate/applications",
                      icon: <Briefcase size={12} />,
                    },
                    {
                      label: "Job Matches",
                      href: "/dashboard/candidate/matches",
                      icon: <Target size={12} />,
                    },
                    {
                      label: "Lowongan Tersimpan",
                      href: "/dashboard/candidate/saved",
                      icon: <Bookmark size={12} />,
                    },
                  ],
                },
                {
                  title: "Perusahaan",
                  links: [
                    {
                      label: "Overview",
                      href: "/dashboard/hr/overview",
                      icon: <BarChart3 size={12} />,
                    },
                    {
                      label: "Kelola Kandidat",
                      href: "/dashboard/hr/candidates",
                      icon: <Users size={12} />,
                    },
                    {
                      label: "Buat Lowongan",
                      href: "/dashboard/hr/jobs",
                      icon: <Plus size={12} />,
                    },
                    {
                      label: "Pengaturan",
                      href: "/dashboard/hr/settings",
                      icon: <Settings size={12} />,
                    },
                  ],
                },
              ].map((col, i) => (
                <nav key={i} aria-label={`Navigasi ${col.title}`}>
                  <div className="font-bold text-[0.85rem] tracking-[0.05em] mb-4 text-[#e8f0ec]">
                    {col.title}
                  </div>
                  <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-[#7a9585] text-[0.85rem] no-underline hover:text-emerald-400 transition-colors flex items-center gap-[6px]">
                          <span className="opacity-60">{l.icon}</span>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
            <div className="border-t border-emerald-500/15 pt-6 flex justify-between items-center flex-wrap gap-3">
              <p className="text-[#7a9585] text-[0.78rem]">
                © 2025 RecruitAI. All rights reserved.
              </p>
              <p className="text-[#7a9585] text-[0.78rem] flex items-center gap-1">
                <Shield size={11} /> Platform rekrutmen berbasis kecerdasan
                buatan
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
