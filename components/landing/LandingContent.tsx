"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Target,
  Search,
  ArrowRight,
  FileText,
  Building2,
  TrendingUp,
  Zap,
  LayoutDashboard,
  Award,
  Heart,
} from "lucide-react";
import { FadeIn, Tag, Card } from "./landing-components";
import { STEPS, FEATURES, PROBLEMS } from "./landing-types";

// ── Section: Masalah ──────────────────────────────────────────────────────────

export function LandingProblems() {
  return (
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
  );
}

// ── Section: Cara Kerja ───────────────────────────────────────────────────────

export function LandingHowItWorks() {
  return (
    <section className="py-[100px] bg-[#0f1612]">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Header with photo */}
        <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1 mb-[80px]">
          <FadeIn>
            <Tag>Cara Kerja</Tag>
            <h2 className="font-syne font-extrabold mt-4 mb-5 leading-[1.15] text-[clamp(1.8rem,3vw,2.4rem)]">
              Dari Upload ke Insight dalam 30 Detik
            </h2>
            <p className="text-[#7a9585] leading-[1.7] text-[0.95rem]">
              Proses otomatis dari awal hingga akhir: isi CV dibaca dan dikirim
              ke sistem AI untuk dianalisis, lalu hasilnya langsung ditampilkan
              dan tersimpan ke akunmu.
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

        {/* Steps + mock result card */}
        <div className="grid gap-20 items-start [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
          {/* Steps */}
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

              {/* Score rings */}
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

              {/* Skill tags */}
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
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-[6px] text-[0.75rem] font-medium font-mono">
                      {skill}
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

              {/* Job match footer */}
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
  );
}

// ── Section: 3 Langkah Visual ─────────────────────────────────────────────────

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
          {VISUAL_STEPS.map((step, i) => (
            <FadeIn key={i} delay={0.1}>
              <div className="grid gap-12 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
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
  );
}

// ── Section: Fitur Utama ──────────────────────────────────────────────────────

export function LandingFeatures() {
  return (
    <section className="py-[100px] bg-[#0f1612]">
      <div className="max-w-[1180px] mx-auto px-6">
        <FadeIn className="text-center mb-[60px]">
          <Tag>Fitur Utama</Tag>
          <h2 className="font-syne font-extrabold mt-4 mb-4 text-[clamp(1.8rem,3.5vw,2.6rem)]">
            Semua yang Anda Butuhkan, Dalam Satu Platform
          </h2>
          <p className="text-[#7a9585] max-w-[520px] mx-auto leading-[1.7]">
            Dari analisis CV untuk kandidat hingga dashboard rekrutmen untuk HR
            — semua tersedia dan terintegrasi.
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
  );
}

// ── Section: Untuk Siapa ──────────────────────────────────────────────────────

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
    href: "/dashboard/hr",
  },
  {
    icon: <Search size={28} />,
    title: "Detail Kandidat & CV",
    desc: "Lihat skill terdeteksi, rincian skor, dan akses CV asli kandidat langsung dari dashboard tanpa berpindah halaman.",
    href: "/dashboard/hr",
  },
  {
    icon: <Zap size={28} />,
    title: "Update Status Cepat",
    desc: "Shortlist, pindahkan ke review, atau tolak kandidat dengan satu klik. Status terupdate langsung ke sistem.",
    href: "/dashboard/hr",
  },
  {
    icon: <LayoutDashboard size={28} />,
    title: "Ringkasan per Posisi",
    desc: "Lihat jumlah pelamar dan persentase shortlisted per posisi lowongan dalam tampilan yang mudah dibaca.",
    href: "/dashboard/hr",
  },
];

export function LandingForWho() {
  const [activeTab, setActiveTab] = useState("candidate");
  const cards = activeTab === "candidate" ? CANDIDATE_CARDS : HR_CARDS;

  return (
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
              Platform ini melayani dua sisi proses rekrutmen — pencari kerja
              yang ingin tampil lebih kuat, dan tim HR yang ingin proses seleksi
              lebih efisien berbasis data.
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
            { k: "hr", l: "HR / Perusahaan", icon: <Building2 size={15} /> },
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
            {cards.map((c, i) => (
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
  );
}

// ── Section: Misi & Visi ──────────────────────────────────────────────────────

const MISSION_CARDS = [
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
];

export function LandingMission() {
  return (
    <section className="py-[100px] bg-[#0f1612]">
      <div className="max-w-[1180px] mx-auto px-6">
        <FadeIn className="text-center mb-[60px]">
          <Tag>Misi & Visi</Tag>
          <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)]">
            Apa yang Kami Perjuangkan
          </h2>
          <p className="text-[#7a9585] max-w-[480px] mx-auto mt-4 leading-[1.7] text-[0.95rem]">
            RecruitAI bukan sekadar alat — ini adalah upaya mewujudkan rekrutmen
            yang lebih adil dan efisien untuk semua.
          </p>
        </FadeIn>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {MISSION_CARDS.map((card, i) => (
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
  );
}
