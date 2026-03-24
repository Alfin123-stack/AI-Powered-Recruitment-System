"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Briefcase,
  Clock,
  Building2,
  Loader2,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

type Job = {
  id: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  created_at: string;
  companies: { name: string; logo_url: string | null; company_size: string };
  color: string;
};

const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];
const getColor = (i: number) => COLORS[i % COLORS.length];

const timeAgo = (dateStr: string) => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari lalu";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
};

const FILTERS = [
  "Semua",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const DEMO_JOBS: Job[] = [
  {
    id: "0",
    title: "Frontend Developer",
    description:
      "Bergabunglah dengan tim engineering kami untuk membangun produk digital yang digunakan jutaan pengguna Indonesia.",
    salary: "Rp 8–15 jt/bln",
    location: "Jakarta / Remote",
    type: "Full-time",
    skills: ["React", "Next.js", "Tailwind"],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    companies: {
      name: "PT Teknologi Indonesia",
      logo_url: null,
      company_size: "200–500 karyawan",
    },
    color: "#10b981",
  },
  {
    id: "1",
    title: "Fullstack Developer",
    description:
      "Kami mencari engineer berpengalaman untuk membangun fitur-fitur baru pada platform SaaS B2B kami.",
    salary: "Rp 12–20 jt/bln",
    location: "Remote",
    type: "Full-time",
    skills: ["Node.js", "React", "PostgreSQL"],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    companies: {
      name: "Startup Digital Nusantara",
      logo_url: null,
      company_size: "50–100 karyawan",
    },
    color: "#06b6d4",
  },
  {
    id: "2",
    title: "Backend Engineer",
    description:
      "Kembangkan infrastruktur backend untuk platform pembayaran yang memproses jutaan transaksi per hari.",
    salary: "Rp 10–18 jt/bln",
    location: "Bandung / Hybrid",
    type: "Full-time",
    skills: ["Go", "PostgreSQL", "Docker"],
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    companies: {
      name: "Fintech Maju Bersama",
      logo_url: null,
      company_size: "200–500 karyawan",
    },
    color: "#8b5cf6",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    description:
      "Rancang pengalaman pengguna yang indah dan intuitif untuk klien-klien enterprise kami.",
    salary: "Rp 6–10 jt/bln",
    location: "Jakarta",
    type: "Contract",
    skills: ["Figma", "Prototyping", "Research"],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    companies: {
      name: "Creative Agency Jakarta",
      logo_url: null,
      company_size: "11–50 karyawan",
    },
    color: "#f59e0b",
  },
];

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

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job, index }: { job: Job; index: number }) {
  const color = job.color || getColor(index);
  return (
    <div className="group relative bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 items-start">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
            style={{ background: `${color}15`, color }}>
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-syne font-bold text-[1.05rem] leading-snug mb-1">
              {job.title}
            </div>
            <div className="text-[0.82rem] text-[#7a9585]">
              {job.companies?.name}
            </div>
          </div>
        </div>
        <span
          className="px-[10px] py-1 rounded-[6px] text-[0.7rem] font-semibold whitespace-nowrap flex-shrink-0"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
            color,
          }}>
          {job.type}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-[10px]">
        {[
          { Icon: MapPin, text: job.location },
          { Icon: Clock, text: timeAgo(job.created_at) },
          { Icon: Briefcase, text: job.salary },
        ]
          .filter((m) => m.text)
          .map(({ Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-[5px] text-[#7a9585] text-[0.78rem]">
              <Icon size={12} /> {text}
            </span>
          ))}
      </div>

      {/* Description */}
      <p className="text-[#7a9585] text-[0.82rem] leading-relaxed line-clamp-2">
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-[6px]">
        {(job.skills || []).map((s) => (
          <span
            key={s}
            className="bg-white/[0.04] border border-white/[0.08] text-[#e8f0ec] px-[10px] py-1 rounded-[6px] text-[0.75rem] font-medium font-mono transition-all duration-200 hover:border-emerald-500/35 hover:text-emerald-400 cursor-default">
            {s}
          </span>
        ))}
      </div>

      {/* Actions — keduanya ke halaman detail */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center gap-[6px] px-[9px] py-[9px] rounded-[9px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/15 transition-all">
          Detail <ChevronRight size={13} />
        </Link>
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[9px] text-[0.82rem] no-underline hover:shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] transition-all">
          Apply Sekarang →
        </Link>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API}/api/jobs`);
        if (!res.ok) throw new Error("Gagal fetch");
        const data = await res.json();
        setJobs(
          data.map((j: any, i: number) => ({ ...j, color: getColor(i) })),
        );
      } catch {
        setJobs(DEMO_JOBS);
      } finally {
        setLoading(false);
      }
    };

    // Cek session untuk navbar
    const checkSession = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      setSession(s);
      setSessionLoading(false);
    };

    fetchJobs();
    checkSession();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companies?.name.toLowerCase().includes(search.toLowerCase()) ||
      (j.skills || []).some((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      );
    const matchFilter =
      filter === "Semua" || j.location?.includes(filter) || j.type === filter;
    return matchSearch && matchFilter;
  });

  // Tentukan dashboard URL berdasarkan role
  const dashboardHref =
    session?.user?.user_metadata?.role === "hr"
      ? "/dashboard/hr/overview"
      : "/dashboard/candidate";

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
              { label: "Jobs", href: "/jobs", active: true },
              { label: "Company", href: "/company", active: false },
              { label: "Analyze", href: "/analyze", active: false },
            ].map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`text-[0.88rem] font-medium no-underline transition-colors ${active ? "text-emerald-400" : "text-[#7a9585] hover:text-emerald-400"}`}>
                {label}
              </Link>
            ))}

            {/* Auth area */}
            {sessionLoading ? (
              <div className="w-8 h-8 rounded-[8px] bg-[#0f1612] border border-emerald-500/15 flex items-center justify-center">
                <Loader2 size={13} className="text-emerald-400 animate-spin" />
              </div>
            ) : session ? (
              // Sudah login — tampilkan avatar + link dashboard
              <div className="flex items-center gap-3">
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-[7px] text-[0.82rem] text-emerald-400 no-underline hover:text-emerald-300 transition-colors font-semibold">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <div className="w-8 h-8 rounded-[8px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-extrabold text-[0.72rem] text-emerald-400">
                  {(
                    session.user?.user_metadata?.full_name ||
                    session.user?.email ||
                    "U"
                  )
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              </div>
            ) : (
              // Belum login
              <Link href="/login">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[0.82rem] px-[18px] py-2 rounded-[8px] hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
                  Masuk →
                </Button>
              </Link>
            )}
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
            <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase mb-5">
              <span className="animate-pulse">●</span> Job Board
            </div>

            <h1
              className="font-syne font-extrabold leading-[1.1] tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>
              Temukan Karir{" "}
              <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Impian Anda
              </span>
            </h1>

            <p className="text-[#7a9585] text-base leading-[1.65] mb-9 max-w-[520px] mx-auto">
              Temukan pekerjaan yang cocok dengan skill dan passion Anda. Lamar
              langsung dan analisis kecocokan CV Anda dengan AI.
            </p>

            {/* Stats bar */}
            <div className="inline-flex items-center gap-6 bg-[#0f1612] border border-emerald-500/15 rounded-full px-6 py-[10px] text-[0.75rem]">
              <span className="flex items-center gap-[6px] text-[#7a9585]">
                <Briefcase size={13} className="text-emerald-400" />
                <span className="text-[#e8f0ec] font-bold">
                  {loading ? "—" : jobs.length}
                </span>{" "}
                lowongan
              </span>
              <span className="w-px h-3 bg-emerald-500/20" />
              <span className="flex items-center gap-[6px] text-[#7a9585]">
                <Building2 size={13} className="text-emerald-400" />
                <span className="text-[#e8f0ec] font-bold">
                  {loading
                    ? "—"
                    : new Set(jobs.map((j) => j.companies?.name)).size}
                </span>{" "}
                perusahaan
              </span>
              <span className="w-px h-3 bg-emerald-500/20" />
              <span className="flex items-center gap-[6px] text-[#7a9585]">
                <MapPin size={13} className="text-emerald-400" />
                <span className="text-[#e8f0ec] font-bold">Remote</span>{" "}
                tersedia
              </span>
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
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-[14px] py-2 rounded-[8px] border font-medium text-[0.78rem] cursor-pointer transition-all duration-200 whitespace-nowrap
                      ${filter === f ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-transparent border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* JOBS GRID */}
        <section className="py-8 pb-20">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="flex justify-between items-center mb-5">
              <p className="text-[0.82rem] text-[#7a9585]">
                Menampilkan{" "}
                <strong className="text-[#e8f0ec]">
                  {loading ? "—" : filtered.length}
                </strong>{" "}
                lowongan
                {search && ` untuk "${search}"`}
              </p>
              <span className="flex items-center gap-[6px] text-[#7a9585] text-[0.78rem]">
                <SlidersHorizontal size={13} /> Urutkan: Terbaru
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <Loader2
                    size={28}
                    className="text-emerald-400 animate-spin"
                  />
                  <span className="text-[#7a9585] text-[0.85rem]">
                    Memuat lowongan...
                  </span>
                </div>
              </div>
            ) : (
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
                        <JobCard job={job} index={i} />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
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
