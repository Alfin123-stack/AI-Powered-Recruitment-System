// app/company/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Globe,
  MapPin,
  Briefcase,
  Users,
  Upload,
  Save,
  ChevronRight,
  Star,
  Camera,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const company = {
  name: "AIRecruit",
  tagline: "Smarter Hiring, Powered by AI",
  industry: "Software & Artificial Intelligence",
  website: "https://airecruit.ai",
  location: "Jakarta, Indonesia",
  size: "51–200 karyawan",
  founded: "2023",
  description:
    "AIRecruit adalah platform rekrutmen berbasis Artificial Intelligence yang membantu perusahaan melakukan screening kandidat secara otomatis, efisien, dan akurat. Kami menggunakan teknologi Google Gemini AI untuk menganalisis ribuan CV dalam hitungan menit.",
  stats: [
    { num: "128", label: "Total Pelamar" },
    { num: "6", label: "Posisi Aktif" },
    { num: "4.8★", label: "Rating Glassdoor" },
    { num: "94%", label: "Akurasi AI" },
  ],
  culture: ["Remote-friendly", "Flat hierarchy", "Fast-growing", "AI-first"],
  benefits: [
    "Gaji kompetitif",
    "Saham / ESOP",
    "Laptop MacBook",
    "Budget belajar",
    "Asuransi kesehatan",
    "Jam kerja fleksibel",
  ],
};

const companies = [
  {
    name: "AIRecruit",
    initial: "AI",
    industry: "Software & AI",
    location: "Jakarta",
    openJobs: 3,
    size: "51–200",
    rating: 4.8,
    color: "#10b981",
    tags: ["AI", "SaaS", "B2B"],
    desc: "Platform rekrutmen AI terdepan untuk perusahaan modern.",
  },
  {
    name: "Digital Nusantara",
    initial: "DN",
    industry: "Technology",
    location: "Bandung",
    openJobs: 2,
    size: "200–500",
    rating: 4.5,
    color: "#06b6d4",
    tags: ["Startup", "Fintech", "Remote"],
    desc: "Membangun infrastruktur digital untuk UKM Indonesia.",
  },
  {
    name: "Inovasi AI Labs",
    initial: "IL",
    industry: "Artificial Intelligence",
    location: "Remote",
    openJobs: 4,
    size: "11–50",
    rating: 4.9,
    color: "#8b5cf6",
    tags: ["AI/ML", "Research", "Startup"],
    desc: "Lab penelitian AI yang mengembangkan model untuk industri.",
  },
  {
    name: "GoTech Indonesia",
    initial: "GT",
    industry: "E-Commerce",
    location: "Jakarta",
    openJobs: 7,
    size: "1000+",
    rating: 4.3,
    color: "#f59e0b",
    tags: ["Scale-up", "Tech", "Hybrid"],
    desc: "Platform e-commerce terbesar untuk pasar Indonesia.",
  },
];

// ── FadeIn helper ─────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Card primitives ───────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-[26px] mb-4 ${className}`}>
      {children}
    </div>
  );
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5 font-syne font-bold text-[1rem]">
      <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
  );
}

// ── HR Profile View ───────────────────────────────────────────────────────────
function HRView() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...company });
  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <motion.div
      key="hr"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <section className="py-12 pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-[1fr_320px] gap-6 items-start">
            {/* LEFT */}
            <FadeIn>
              <Card>
                <CardTitle>Informasi Perusahaan</CardTitle>

                {/* Logo upload */}
                <div className="flex items-center gap-5 mb-7 pb-6 border-b border-emerald-500/15">
                  <div className="relative group w-[72px] h-[72px] rounded-[16px] bg-emerald-500/[0.12] border-[1.5px] border-dashed border-emerald-500/35 flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/[0.18] transition-all overflow-hidden flex-shrink-0">
                    <span className="font-syne font-extrabold text-[1.4rem] text-emerald-400">
                      AI
                    </span>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={18} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-syne font-bold text-[0.95rem] mb-1">
                      Logo Perusahaan
                    </div>
                    <div className="text-[#7a9585] text-[0.78rem] mb-[10px]">
                      PNG atau JPG · Maks 2MB · Rekomendasi 200×200px
                    </div>
                    <Button
                      variant="outline"
                      className="border-emerald-500/15 text-[#7a9585] rounded-[8px] text-[0.78rem] px-[14px] py-[7px] hover:border-emerald-500/35 hover:text-[#e8f0ec]">
                      <Upload size={13} /> Upload Logo
                    </Button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Nama Perusahaan", key: "name" },
                    { label: "Industri", key: "industry" },
                    { label: "Website", key: "website" },
                    { label: "Lokasi", key: "location" },
                    { label: "Ukuran Tim", key: "size" },
                    { label: "Tahun Berdiri", key: "founded" },
                  ].map((f) => (
                    <div key={f.key}>
                      <Label className="text-[0.72rem] font-bold text-[#7a9585] tracking-[0.08em] uppercase mb-[6px]">
                        {f.label}
                      </Label>
                      <Input
                        value={
                          (form[f.key as keyof typeof form] as string) ?? ""
                        }
                        onChange={set(f.key)}
                        className="bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <Label className="text-[0.72rem] font-bold text-[#7a9585] tracking-[0.08em] uppercase mb-[6px]">
                      Tagline Perusahaan
                    </Label>
                    <Input
                      value={form.tagline ?? ""}
                      onChange={set("tagline")}
                      placeholder="Slogan singkat perusahaan Anda..."
                      className="bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[0.72rem] font-bold text-[#7a9585] tracking-[0.08em] uppercase mb-[6px]">
                      Deskripsi Perusahaan
                    </Label>
                    <Textarea
                      value={form.description ?? ""}
                      onChange={set("description")}
                      rows={5}
                      className="bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] rounded-[10px] resize-y min-h-[110px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2500);
                    }}
                    className={
                      saved
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-7 py-3 rounded-[10px] cursor-default"
                        : "bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-7 py-3 rounded-[10px] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:-translate-y-[1px]"
                    }>
                    {saved ? (
                      <>
                        <Check size={15} /> Tersimpan!
                      </>
                    ) : (
                      <>
                        <Save size={15} /> Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </FadeIn>

            {/* RIGHT */}
            <FadeIn delay={0.08}>
              {/* Preview */}
              <Card className="bg-gradient-to-br from-emerald-500/[0.07] to-cyan-500/[0.05]">
                <div className="flex items-center gap-[14px] mb-4">
                  <div className="w-[52px] h-[52px] rounded-[13px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-syne font-extrabold text-[1rem] text-emerald-400 flex-shrink-0">
                    AI
                  </div>
                  <div>
                    <div className="font-syne font-extrabold text-[1rem]">
                      {form.name}
                    </div>
                    <div className="text-[0.75rem] text-[#7a9585]">
                      {form.tagline}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[6px]">
                  {[
                    { Icon: Globe, val: form.website },
                    { Icon: MapPin, val: form.location },
                    { Icon: Building2, val: form.industry },
                    { Icon: Users, val: form.size },
                  ].map(({ Icon, val }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-[7px] text-[0.78rem] text-[#7a9585]">
                      <span className="text-emerald-400">
                        <Icon size={12} />
                      </span>{" "}
                      {val}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Stats */}
              <Card>
                <CardTitle>Statistik</CardTitle>
                <div className="grid grid-cols-2 gap-[10px]">
                  {company.stats.map((s, i) => (
                    <div
                      key={i}
                      className="bg-[#141f19] border border-emerald-500/15 rounded-[10px] p-[14px] text-center">
                      <div className="font-syne text-[1.4rem] font-extrabold text-emerald-400 leading-none">
                        {s.num}
                      </div>
                      <div className="text-[0.68rem] text-[#7a9585] mt-1">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Culture */}
              <Card>
                <CardTitle>Kultur Kerja</CardTitle>
                <div className="flex flex-wrap gap-[7px]">
                  {company.culture.map((c, i) => (
                    <span
                      key={i}
                      className="bg-emerald-500/[0.07] border border-emerald-500/[0.18] text-emerald-300 px-3 py-[5px] rounded-[7px] text-[0.78rem] font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Benefits */}
              <Card>
                <CardTitle>Benefit</CardTitle>
                <div className="flex flex-col gap-2">
                  {company.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[0.83rem] text-[#7a9585]">
                      <Check
                        size={13}
                        className="text-emerald-400 flex-shrink-0"
                      />{" "}
                      {b}
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ── Candidate View ────────────────────────────────────────────────────────────
function CandidateView() {
  return (
    <motion.div
      key="candidate"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <section className="py-12 pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}>
            {companies.map((c, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="group relative bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-[22px] flex flex-col gap-[14px] transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden cursor-default">
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${c.color}, transparent)`,
                    }}
                  />

                  <div className="flex items-start gap-[14px]">
                    <div
                      className="w-12 h-12 rounded-[12px] flex items-center justify-center font-syne font-extrabold text-[0.9rem] flex-shrink-0 border border-white/[0.08]"
                      style={{ background: `${c.color}18`, color: c.color }}>
                      {c.initial}
                    </div>
                    <div className="flex-1">
                      <div className="font-syne font-bold text-[1rem] mb-[3px]">
                        {c.name}
                      </div>
                      <div className="text-[0.78rem] text-[#7a9585]">
                        {c.industry}
                      </div>
                    </div>
                    <div
                      className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-[6px] text-[0.7rem] font-bold flex-shrink-0"
                      style={{
                        background: `${c.color}15`,
                        color: c.color,
                        border: `1px solid ${c.color}30`,
                      }}>
                      <Briefcase size={10} /> {c.openJobs} lowongan
                    </div>
                  </div>

                  <p className="text-[#7a9585] text-[0.82rem] leading-relaxed">
                    {c.desc}
                  </p>

                  <div className="flex gap-[14px] flex-wrap">
                    <span className="flex items-center gap-[5px] text-[#7a9585] text-[0.75rem]">
                      <MapPin size={12} /> {c.location}
                    </span>
                    <span className="flex items-center gap-[5px] text-[#7a9585] text-[0.75rem]">
                      <Users size={12} /> {c.size} orang
                    </span>
                    <span className="flex items-center gap-1 text-[0.75rem] font-semibold text-amber-400">
                      <Star size={11} fill="currentColor" /> {c.rating}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-[5px]">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-white/[0.04] border border-white/[0.08] text-[#e8f0ec] px-[9px] py-[3px] rounded-[5px] text-[0.72rem] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      href="/jobs"
                      className="flex-1 flex items-center justify-center gap-[6px] px-[9px] py-[9px] rounded-[9px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/15 transition-all">
                      <Briefcase size={13} /> Lihat Lowongan{" "}
                      <ChevronRight size={12} />
                    </Link>
                    <button className="px-[14px] py-[9px] rounded-[9px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] text-[0.8rem] font-medium hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all cursor-pointer">
                      Ikuti
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CompanyPage() {
  const [role, setRole] = useState("hr");
  const isHR = role === "hr";

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.85)] backdrop-blur-[16px] border-b border-emerald-500/15">
        <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-syne font-extrabold text-[1.1rem] text-[#e8f0ec] no-underline">
            <span className="text-emerald-400">✦</span> Recruit
            <em className="not-italic text-emerald-400">AI</em>
          </Link>
          <div className="flex items-center gap-7">
            {[
              ["Jobs", "/jobs"],
              ["Company", "#", true],
              ["Analyze", "/analyze"],
            ].map(([label, href, active]) => (
              <Link
                key={label}
                href={href as string}
                className={`text-[0.88rem] font-medium no-underline transition-colors ${active ? "text-emerald-400" : "text-[#7a9585] hover:text-emerald-400"}`}>
                {label}
              </Link>
            ))}
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[0.82rem] px-[18px] py-2 rounded-[8px]">
              Masuk →
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* HERO */}
        <section
          className="pt-[108px] pb-[60px] relative overflow-hidden text-center"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
          }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <motion.div
            className="relative max-w-[700px] mx-auto px-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase mb-[18px]">
              <span className="animate-pulse">●</span>
              {isHR ? "HR Dashboard" : "Direktori Perusahaan"}
            </div>

            <h1
              className="font-syne font-extrabold leading-[1.1] tracking-tight mb-[14px]"
              style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>
              {isHR ? (
                "Profil Perusahaan"
              ) : (
                <>
                  Perusahaan yang{" "}
                  <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Sedang Merekrut
                  </span>
                </>
              )}
            </h1>

            <p className="text-[#7a9585] text-[0.95rem] leading-[1.7] mb-8 max-w-[540px] mx-auto">
              {isHR
                ? "Kelola informasi perusahaan Anda, tampilkan brand employer yang kuat untuk menarik kandidat terbaik."
                : "Temukan perusahaan impian Anda, pelajari kultur kerja mereka, dan lamar ke posisi yang tersedia."}
            </p>

            {/* Role toggle */}
            <div className="inline-flex bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-1 gap-1">
              {[
                { key: "hr", label: "🏢 HR Mode" },
                { key: "candidate", label: "👤 Candidate" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className={`px-[22px] py-[9px] rounded-[9px] border-0 text-[0.85rem] font-semibold cursor-pointer transition-all duration-200
                    ${
                      role === key
                        ? "bg-emerald-500 text-black shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
                        : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                    }`}>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {isHR ? <HRView key="hr" /> : <CandidateView key="candidate" />}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="bg-[#0f1612] border-t border-emerald-500/15 py-9 px-6 text-center">
          <div className="flex items-center justify-center gap-[6px] font-syne font-extrabold text-base mb-[6px]">
            <span className="text-emerald-400">✦</span> RecruitAI
          </div>
          <p className="text-[#7a9585] text-[0.78rem]">
            Built with Next.js · Supabase · Gemini AI
          </p>
        </footer>
      </main>
    </div>
  );
}
