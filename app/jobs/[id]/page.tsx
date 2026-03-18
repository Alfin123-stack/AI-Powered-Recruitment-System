// app/jobs/[id]/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Users,
  Clock,
  Briefcase,
  ChevronLeft,
  CheckCircle2,
  Building2,
  Share2,
  Bookmark,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
const jobsData = [
  {
    id: "0",
    title: "Frontend Developer",
    company: "PT Teknologi Indonesia",
    companyDesc:
      "Perusahaan teknologi terkemuka yang fokus pada pengembangan produk digital untuk pasar Indonesia dan Asia Tenggara.",
    companySize: "200–500 karyawan",
    location: "Jakarta / Remote",
    type: "Full-time",
    salary: "Rp 8–15 jt/bln",
    posted: "2 hari lalu",
    deadline: "30 April 2025",
    applicants: 12,
    color: "#10b981",
    skills: ["React", "Next.js", "Tailwind", "TypeScript", "Git"],
    description:
      "Kami mencari Frontend Developer berpengalaman untuk membangun user interface modern yang cepat, responsif, dan accessible. Anda akan bekerja langsung bersama tim product dan desainer untuk mewujudkan pengalaman pengguna terbaik.",
    responsibilities: [
      "Membangun dan memelihara UI komponen menggunakan React dan Next.js",
      "Mengoptimalkan performa web (Core Web Vitals, lazy loading, caching)",
      "Berkolaborasi dengan tim backend untuk integrasi API",
      "Mengimplementasikan desain dari Figma menjadi kode yang pixel-perfect",
      "Menulis unit test dan melakukan code review",
      "Berkontribusi pada dokumentasi teknis tim engineering",
    ],
    requirements: [
      "Minimal 2 tahun pengalaman profesional dengan React.js",
      "Menguasai HTML5, CSS3, dan JavaScript (ES6+)",
      "Pengalaman dengan TypeScript dan state management (Redux/Zustand)",
      "Familiar dengan Tailwind CSS dan component library",
      "Pengalaman menggunakan Git dan workflow CI/CD",
      "Mampu bekerja secara mandiri maupun dalam tim lintas fungsi",
    ],
    benefits: [
      "Gaji kompetitif + bonus performa",
      "Remote-friendly culture",
      "Budget pelatihan & sertifikasi",
      "Asuransi kesehatan & gigi",
      "Laptop MacBook Pro disediakan",
    ],
  },
  {
    id: "1",
    title: "Fullstack Developer",
    company: "Startup Digital Nusantara",
    companyDesc:
      "Startup SaaS B2B yang membangun platform manajemen bisnis untuk UKM Indonesia.",
    companySize: "50–100 karyawan",
    location: "Remote",
    type: "Full-time",
    salary: "Rp 12–20 jt/bln",
    posted: "5 hari lalu",
    deadline: "15 Mei 2025",
    applicants: 8,
    color: "#06b6d4",
    skills: ["Node.js", "React", "PostgreSQL", "Docker"],
    description:
      "Bergabunglah sebagai Fullstack Developer dan bangun fitur-fitur baru pada platform SaaS kami yang digunakan ribuan UKM Indonesia.",
    responsibilities: [
      "Mengembangkan fitur frontend dan backend end-to-end",
      "Merancang dan mengelola skema database PostgreSQL",
      "Membangun RESTful API dan GraphQL endpoint",
      "Mengoptimalkan query database dan performa server",
    ],
    requirements: [
      "Minimal 3 tahun pengalaman fullstack development",
      "Menguasai Node.js dan React",
      "Berpengalaman dengan PostgreSQL dan query optimization",
      "Familiar dengan Docker dan deployment workflow",
    ],
    benefits: [
      "Equity / ESOP program",
      "100% Remote",
      "Jam kerja fleksibel",
      "Allowance internet & co-working space",
    ],
  },
];
// ── Types ─────────────────────────────────────────────────────────────────────
type Job = {
  id: string;
  title: string;
  company: string;
  companyDesc: string;
  companySize: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  deadline: string;
  applicants: number;
  color: string;
  match: number;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

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
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
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
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 mb-4 ${className}`}>
      {children}
    </div>
  );
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-[18px] font-syne text-[1.05rem] font-bold">
      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobDetailPage() {
  const { id } = useParams();
  const job = jobsData.find((j) => j.id === String(id)) ?? jobsData[0];
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.85)] backdrop-blur-[16px] border-b border-emerald-500/15">
        <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/jobs"
            className="flex items-center gap-[6px] text-[#7a9585] text-[0.85rem] no-underline hover:text-emerald-400 transition-colors">
            <ChevronLeft size={16} /> Kembali ke Jobs
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-syne font-extrabold text-[1.1rem] text-[#e8f0ec] no-underline">
            <span className="text-emerald-400">✦</span> RecruitAI
          </Link>
          <div className="flex items-center gap-[10px]">
            <button className="w-9 h-9 rounded-[8px] bg-[#0f1612] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all cursor-pointer">
              <Share2 size={15} />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`w-9 h-9 rounded-[8px] flex items-center justify-center cursor-pointer border transition-all
                ${
                  saved
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-[#0f1612] border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"
                }`}>
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* HERO */}
        <section
          className="pt-[100px] pb-14 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
          }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <FadeIn>
            <div className="max-w-[1100px] mx-auto px-6">
              <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase mb-5">
                Job Details
              </div>
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-[14px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                  style={{ background: `${job.color}18`, color: job.color }}>
                  <Building2 size={28} />
                </div>
                <div>
                  <h1
                    className="font-syne font-extrabold leading-[1.1] tracking-tight mb-2"
                    style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)" }}>
                    {job.title}
                  </h1>
                  <div className="text-[#7a9585] text-[0.95rem] mb-4">
                    {job.company} · {job.location}
                  </div>
                  <div className="flex flex-wrap gap-[14px] mb-5">
                    {[
                      { Icon: MapPin, text: job.location },
                      { Icon: Briefcase, text: job.type },
                      { Icon: Clock, text: `Diposting ${job.posted}` },
                      { Icon: Users, text: `${job.applicants} pelamar` },
                    ].map(({ Icon, text }) => (
                      <span
                        key={text}
                        className="flex items-center gap-[6px] text-[#7a9585] text-[0.82rem]">
                        <Icon size={13} /> {text}
                      </span>
                    ))}
                    <span
                      className="flex items-center gap-[6px] text-[0.82rem] font-semibold"
                      style={{ color: job.color }}>
                      💰 {job.salary}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-[7px]">
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="bg-white/[0.04] border border-white/[0.09] text-[#e8f0ec] px-3 py-[5px] rounded-[7px] text-[0.78rem] font-medium font-mono hover:border-emerald-500/35 hover:text-emerald-400 transition-all cursor-default">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* CONTENT */}
        <div
          className="max-w-[1100px] mx-auto px-6 pt-10 pb-20 grid gap-6"
          style={{ gridTemplateColumns: "1fr 320px" }}>
          {/* LEFT */}
          <div>
            <FadeIn delay={0.05}>
              <Card>
                <CardTitle>Deskripsi Pekerjaan</CardTitle>
                <p className="text-[#7a9585] text-[0.9rem] leading-[1.75]">
                  {job.description}
                </p>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardTitle>Tanggung Jawab</CardTitle>
                <div className="flex flex-col gap-[10px]">
                  {job.responsibilities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-[10px] text-[#7a9585] text-[0.88rem] leading-[1.55]">
                      <CheckCircle2
                        size={16}
                        className="flex-shrink-0 mt-[1px]"
                        style={{ color: job.color }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card>
                <CardTitle>Kualifikasi & Persyaratan</CardTitle>
                <div className="flex flex-col gap-[10px]">
                  {job.requirements.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-[10px] text-[#7a9585] text-[0.88rem] leading-[1.55]">
                      <CheckCircle2
                        size={16}
                        className="flex-shrink-0 mt-[1px] text-cyan-400"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardTitle>Benefit & Fasilitas</CardTitle>
                <div className="grid grid-cols-2 gap-2">
                  {job.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-[9px] px-[14px] py-[10px] text-[0.8rem] text-[#e8f0ec] flex items-center gap-[7px]">
                      <span className="text-emerald-400">✦</span> {b}
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.25}>
              <Card>
                <CardTitle>Tentang Perusahaan</CardTitle>
                <div className="flex gap-[14px] items-start mb-[14px]">
                  <div
                    className="w-12 h-12 rounded-[11px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                    style={{ background: `${job.color}18`, color: job.color }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="font-syne font-bold mb-1">
                      {job.company}
                    </div>
                    <div className="text-[0.78rem] text-[#7a9585]">
                      👥 {job.companySize}
                    </div>
                  </div>
                </div>
                <p className="text-[#7a9585] text-[0.9rem] leading-[1.75]">
                  {job.companyDesc}
                </p>
              </Card>
            </FadeIn>
          </div>

          {/* SIDEBAR */}
          <FadeIn delay={0.1}>
            <div className="sticky top-20">
              <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 mb-4">
                {/* Apply */}
                {applied ? (
                  <Button className="w-full py-[14px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-[11px] font-bold text-[0.95rem] cursor-default mb-[10px]">
                    <CheckCircle2 size={16} /> Sudah Dilamar
                  </Button>
                ) : (
                  <Button
                    onClick={() => setApplied(true)}
                    className="w-full py-[14px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[11px] text-[0.95rem] hover:shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] mb-[10px]">
                    <Upload size={15} /> Apply Sekarang
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => setSaved(!saved)}
                  className={`w-full py-3 rounded-[11px] text-[0.88rem] border transition-all
                    ${
                      saved
                        ? "bg-emerald-500/[0.07] text-emerald-400 border-emerald-500/30"
                        : "bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] hover:border-emerald-500/35 hover:bg-emerald-500/[0.04]"
                    }`}>
                  <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Tersimpan" : "Simpan Lowongan"}
                </Button>

                <Separator className="my-5 bg-emerald-500/15" />

                {/* Info rows */}
                <div className="mb-5">
                  {[
                    { label: "Tipe Pekerjaan", value: job.type },
                    { label: "Gaji", value: job.salary },
                    { label: "Lokasi", value: job.location },
                    { label: "Deadline", value: job.deadline },
                    {
                      label: "Total Pelamar",
                      value: `${job.applicants} orang`,
                    },
                  ].map((row, i, arr) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-[9px] ${i < arr.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
                      <span className="text-[0.75rem] text-[#7a9585]">
                        {row.label}
                      </span>
                      <span className="text-[0.82rem] font-semibold">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI Match */}
                <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-[12px] p-4">
                  <div className="text-[0.75rem] font-bold text-emerald-400 tracking-[0.07em] uppercase mb-2">
                    ✦ AI Match Score
                  </div>
                  <p className="text-[0.82rem] text-[#7a9585] leading-relaxed mb-[10px]">
                    Upload CV Anda untuk mengetahui tingkat kecocokan dengan
                    posisi ini.
                  </p>
                  <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${job.match}%`,
                        background: "linear-gradient(90deg,#10b981,#06b6d4)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[0.72rem] text-[#7a9585]">
                    <span>Estimasi match</span>
                    <span className="text-emerald-400 font-bold">
                      {job.match}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] px-[22px] py-[18px]">
                <div className="text-[0.78rem] text-[#7a9585] mb-3">
                  Bagikan lowongan ini
                </div>
                <div className="flex gap-2">
                  {["LinkedIn", "WhatsApp", "Twitter"].map((p) => (
                    <button
                      key={p}
                      className="flex-1 bg-[#141f19] border border-emerald-500/15 rounded-[8px] py-2 px-[6px] text-[#7a9585] text-[0.72rem] font-semibold hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all cursor-pointer">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

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
