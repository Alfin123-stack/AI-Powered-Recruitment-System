// app/jobs/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Search,
  SlidersHorizontal,
  Plus,
  Pencil,
  ChevronRight,
  Briefcase,
  Clock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ── Data ──────────────────────────────────────────────────────────────────────
const jobs = [
  {
    id: 0,
    title: "Frontend Developer",
    company: "PT Teknologi Indonesia",
    location: "Jakarta / Remote",
    type: "Full-time",
    posted: "2 hari lalu",
    salary: "Rp 8–15 jt/bln",
    applicants: 12,
    skills: ["React", "Next.js", "Tailwind"],
    color: "#10b981",
    desc: "Bergabunglah dengan tim engineering kami untuk membangun produk digital yang digunakan jutaan pengguna Indonesia.",
  },
  {
    id: 1,
    title: "Fullstack Developer",
    company: "Startup Digital Nusantara",
    location: "Remote",
    type: "Full-time",
    posted: "5 hari lalu",
    salary: "Rp 12–20 jt/bln",
    applicants: 8,
    skills: ["Node.js", "React", "PostgreSQL"],
    color: "#06b6d4",
    desc: "Kami mencari engineer berpengalaman untuk membangun fitur-fitur baru pada platform SaaS B2B kami yang sedang berkembang pesat.",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Fintech Maju Bersama",
    location: "Bandung / Hybrid",
    type: "Full-time",
    posted: "1 minggu lalu",
    salary: "Rp 10–18 jt/bln",
    applicants: 23,
    skills: ["Go", "PostgreSQL", "Docker"],
    color: "#8b5cf6",
    desc: "Kembangkan infrastruktur backend untuk platform pembayaran yang memproses jutaan transaksi per hari.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Agency Jakarta",
    location: "Jakarta",
    type: "Contract",
    posted: "3 hari lalu",
    salary: "Rp 6–10 jt/bln",
    applicants: 31,
    skills: ["Figma", "Prototyping", "Research"],
    color: "#f59e0b",
    desc: "Rancang pengalaman pengguna yang indah dan intuitif untuk klien-klien enterprise kami di berbagai industri.",
  },
];
const filters = ["Semua", "Remote", "Full-time", "Contract", "Hybrid"];

// ── JobCard ───────────────────────────────────────────────────────────────────
function JobCard({ job, role }: { job: Job; role: string }) {
  return (
    <div
      className="group relative bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden"
      style={{ "--card-color": job.color } as React.CSSProperties}>
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${job.color}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 items-start">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
            style={{ background: `${job.color}15`, color: job.color }}>
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-syne font-bold text-[1.05rem] leading-snug mb-1">
              {job.title}
            </div>
            <div className="text-[0.82rem] text-[#7a9585]">{job.company}</div>
          </div>
        </div>

        {role === "hr" ? (
          <span className="inline-flex items-center gap-1 bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 px-[10px] py-1 rounded-[6px] text-[0.72rem] font-semibold whitespace-nowrap">
            <Users size={11} /> {job.applicants} pelamar
          </span>
        ) : (
          <span
            className="px-[10px] py-1 rounded-[6px] text-[0.7rem] font-semibold whitespace-nowrap flex-shrink-0"
            style={{
              background: `${job.color}15`,
              border: `1px solid ${job.color}30`,
              color: job.color,
            }}>
            {job.type}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-[10px]">
        {[
          { Icon: MapPin, text: job.location },
          { Icon: Clock, text: job.posted },
          { Icon: Briefcase, text: job.salary },
        ].map(({ Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-[5px] text-[#7a9585] text-[0.78rem]">
            <Icon size={12} /> {text}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-[#7a9585] text-[0.82rem] leading-relaxed">
        {job.desc}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-[6px]">
        {job.skills.map((s) => (
          <span
            key={s}
            className="bg-white/[0.04] border border-white/[0.08] text-[#e8f0ec] px-[10px] py-1 rounded-[6px] text-[0.75rem] font-medium font-mono transition-all duration-200 hover:border-emerald-500/35 hover:text-emerald-400 cursor-default">
            {s}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {role === "candidate" ? (
          <>
            <Link
              href={`/jobs/${job.id}`}
              className="flex-1 flex items-center justify-center gap-[6px] px-[9px] py-[9px] rounded-[9px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/15 transition-all">
              Detail <ChevronRight size={13} />
            </Link>
            <Button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[9px] text-[0.82rem] hover:shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:-translate-y-[1px]">
              Apply Sekarang →
            </Button>
          </>
        ) : (
          <>
            <Link
              href={`/jobs/${job.id}/applicants`}
              className="flex-1 flex items-center justify-center gap-[6px] px-[9px] py-[9px] rounded-[9px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/15 transition-all">
              <Users size={13} /> Lihat Pelamar
            </Link>
            <Button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[9px] text-[0.82rem]">
              <Pencil size={13} /> Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [role, setRole] = useState("candidate");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchFilter =
      filter === "Semua" || j.location.includes(filter) || j.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.85)] backdrop-blur-[16px] border-b border-emerald-500/15">
        <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-syne font-extrabold text-[1.1rem] text-[#e8f0ec] no-underline">
            <span className="text-emerald-400">✦</span> RecruitAI
          </Link>
          <div className="flex items-center gap-7">
            {["Jobs", "Fitur", "Dashboard"].map((l, i) => (
              <Link
                key={l}
                href="#"
                className={`text-[0.88rem] font-medium no-underline transition-colors ${i === 0 ? "text-emerald-400" : "text-[#7a9585] hover:text-emerald-400"}`}>
                {l}
              </Link>
            ))}
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[0.82rem] px-[18px] py-2 rounded-[8px] hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
              Masuk →
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* HERO */}
        <section
          className="pt-[120px] pb-[72px] relative overflow-hidden text-center"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 70%), #0a0f0d",
          }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <motion.div
            className="relative max-w-[720px] mx-auto px-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            {/* Tag */}
            <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase mb-5">
              <span className="animate-pulse">●</span>
              {role === "candidate" ? "Job Board" : "HR Dashboard"}
            </div>

            <h1
              className="font-syne font-extrabold leading-[1.1] tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>
              {role === "candidate" ? (
                <>
                  Temukan Karir{" "}
                  <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Impian Anda
                  </span>
                </>
              ) : (
                <>
                  Kelola Lowongan{" "}
                  <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Pekerjaan
                  </span>
                </>
              )}
            </h1>

            <p className="text-[#7a9585] text-base leading-[1.65] mb-9 max-w-[520px] mx-auto">
              {role === "candidate"
                ? "Temukan pekerjaan yang cocok dengan skill dan passion Anda. Lamar langsung dan analisis kecocokan CV Anda dengan AI."
                : "Posting lowongan, analisis kandidat dengan AI, dan temukan talenta terbaik lebih cepat dari sebelumnya."}
            </p>

            {/* Role toggle */}
            <div className="inline-flex bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-1 gap-1">
              {[
                { key: "candidate", label: "👤 Candidate" },
                { key: "hr", label: "🏢 HR Mode" },
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

        {/* TOOLBAR */}
        <section className="pt-7">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-4 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  size={16}
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
                />
                <Input
                  placeholder="Cari posisi, perusahaan, atau skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                />
              </div>

              <div className="flex gap-[6px] flex-wrap">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-[14px] py-2 rounded-[8px] border font-medium text-[0.78rem] cursor-pointer transition-all duration-200 whitespace-nowrap
                      ${
                        filter === f
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-transparent border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"
                      }`}>
                    {f}
                  </button>
                ))}
              </div>

              {role === "hr" && (
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.85rem] px-[18px] py-[10px] rounded-[10px] whitespace-nowrap hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:-translate-y-[1px]">
                  <Plus size={15} /> Buat Lowongan
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* JOBS GRID */}
        <section className="py-8 pb-20">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="flex justify-between items-center mb-5">
              <p className="text-[0.82rem] text-[#7a9585]">
                Menampilkan{" "}
                <strong className="text-[#e8f0ec]">{filtered.length}</strong>{" "}
                lowongan
                {search && ` untuk "${search}"`}
              </p>
              <span className="flex items-center gap-[6px] text-[#7a9585] text-[0.78rem]">
                <SlidersHorizontal size={13} /> Urutkan: Terbaru
              </span>
            </div>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              }}>
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-[#7a9585]">
                    <div className="text-5xl mb-4 opacity-40">🔍</div>
                    <div className="font-syne text-[1.1rem] font-bold text-[#e8f0ec] mb-2">
                      Tidak ada lowongan ditemukan
                    </div>
                    <p>Coba kata kunci lain atau hapus filter yang aktif.</p>
                  </div>
                ) : (
                  filtered.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}>
                      <JobCard job={job} role={role} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#0f1612] border-t border-emerald-500/15 py-10 px-6 text-center">
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
