// app/company/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Briefcase,
  Users,
  Star,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── API ───────────────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
type Company = {
  id: string;
  name: string;
  description: string;
  company_size: string;
  logo_url: string | null;
  openJobs: number; // dihitung dari jobs aktif
  location: string; // dari jobs terbaru
  tags: string[]; // dari skills jobs
  color: string; // generated
};

// ── Static fallback (dev/demo) ────────────────────────────────────────────────
const DEMO_COMPANIES: Company[] = [
  {
    id: "1",
    name: "AIRecruit",
    description:
      "Platform rekrutmen AI terdepan untuk perusahaan modern yang ingin hire lebih cepat dan akurat.",
    company_size: "51–200 karyawan",
    logo_url: null,
    openJobs: 3,
    location: "Jakarta",
    tags: ["AI", "SaaS", "B2B"],
    color: "#10b981",
  },
  {
    id: "2",
    name: "Digital Nusantara",
    description:
      "Membangun infrastruktur digital untuk UKM Indonesia dengan teknologi terkini.",
    company_size: "200–500 karyawan",
    logo_url: null,
    openJobs: 2,
    location: "Bandung",
    tags: ["Startup", "Fintech", "Remote"],
    color: "#06b6d4",
  },
  {
    id: "3",
    name: "Inovasi AI Labs",
    description:
      "Lab penelitian AI yang mengembangkan model machine learning untuk berbagai industri.",
    company_size: "11–50 karyawan",
    logo_url: null,
    openJobs: 4,
    location: "Remote",
    tags: ["AI/ML", "Research", "Startup"],
    color: "#8b5cf6",
  },
  {
    id: "4",
    name: "GoTech Indonesia",
    description:
      "Platform e-commerce terbesar untuk pasar Indonesia dengan jutaan pengguna aktif.",
    company_size: "1000+ karyawan",
    logo_url: null,
    openJobs: 7,
    location: "Jakarta",
    tags: ["Scale-up", "Tech", "Hybrid"],
    color: "#f59e0b",
  },
  {
    id: "5",
    name: "Fintek Maju",
    description:
      "Solusi pembayaran digital dan pinjaman online yang melayani jutaan nasabah Indonesia.",
    company_size: "200–500 karyawan",
    logo_url: null,
    openJobs: 5,
    location: "Surabaya",
    tags: ["Fintech", "Finance", "Hybrid"],
    color: "#ef4444",
  },
  {
    id: "6",
    name: "Creative Studio JKT",
    description:
      "Studio kreatif yang mengerjakan branding, digital marketing, dan desain produk untuk brand nasional.",
    company_size: "11–50 karyawan",
    logo_url: null,
    openJobs: 2,
    location: "Jakarta",
    tags: ["Creative", "Design", "Agency"],
    color: "#ec4899",
  },
];

const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];
const getColor = (i: number) => COLORS[i % COLORS.length];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const FILTERS = ["Semua", "Jakarta", "Bandung", "Surabaya", "Remote"];

// ── FadeIn ────────────────────────────────────────────────────────────────────
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

// ── Company Card ──────────────────────────────────────────────────────────────
function CompanyCard({ company, index }: { company: Company; index: number }) {
  const color = company.color || getColor(index);
  const initials = getInitials(company.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-[22px] flex flex-col gap-[14px] transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start gap-[14px]">
        <div
          className="w-12 h-12 rounded-[12px] flex items-center justify-center font-syne font-extrabold text-[0.9rem] flex-shrink-0 border border-white/[0.08]"
          style={{ background: `${color}18`, color }}>
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-full h-full object-cover rounded-[12px]"
            />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-syne font-bold text-[1rem] mb-[3px] truncate">
            {company.name}
          </div>
          {company.company_size && (
            <div className="text-[0.75rem] text-[#7a9585]">
              👥 {company.company_size}
            </div>
          )}
        </div>
        <div
          className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-[6px] text-[0.7rem] font-bold flex-shrink-0"
          style={{
            background: `${color}15`,
            color,
            border: `1px solid ${color}30`,
          }}>
          <Briefcase size={10} /> {company.openJobs} lowongan
        </div>
      </div>

      {/* Description */}
      <p className="text-[#7a9585] text-[0.82rem] leading-relaxed line-clamp-2">
        {company.description || "Perusahaan ini belum menambahkan deskripsi."}
      </p>

      {/* Meta */}
      <div className="flex gap-[14px] flex-wrap">
        {company.location && (
          <span className="flex items-center gap-[5px] text-[#7a9585] text-[0.75rem]">
            <MapPin size={12} /> {company.location}
          </span>
        )}
        <span className="flex items-center gap-[5px] text-[#7a9585] text-[0.75rem]">
          <Users size={12} /> {company.company_size || "—"}
        </span>
      </div>

      {/* Tags */}
      {company.tags?.length > 0 && (
        <div className="flex flex-wrap gap-[5px]">
          {company.tags.map((t) => (
            <span
              key={t}
              className="bg-white/[0.04] border border-white/[0.08] text-[#e8f0ec] px-[9px] py-[3px] rounded-[5px] text-[0.72rem] font-medium">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="flex gap-2 mt-auto pt-1">
        <Link
          href={`/jobs?company=${company.id}`}
          className="flex-1 flex items-center justify-center gap-[6px] px-[9px] py-[9px] rounded-[9px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/15 transition-all">
          <Briefcase size={13} /> Lihat Lowongan <ChevronRight size={12} />
        </Link>
        <button className="px-[14px] py-[9px] rounded-[9px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] text-[0.8rem] font-medium hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all cursor-pointer">
          Ikuti
        </button>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  // ── Fetch companies dari Express backend ────────────────────────────────────
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // GET /api/companies → public, tidak butuh auth
        // Backend return companies yang punya jobs aktif + jumlah openJobs
        const res = await fetch(`${API}/api/companies`);
        if (!res.ok) throw new Error("Gagal fetch");
        const data = await res.json();
        setCompanies(
          data.map((c: any, i: number) => ({
            ...c,
            color: getColor(i),
          })),
        );
      } catch {
        // Fallback ke demo data kalau backend belum siap
        setCompanies(DEMO_COMPANIES);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "Semua" || c.location === filter;
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
            <span className="text-emerald-400">✦</span> Recruit
            <em className="not-italic text-emerald-400">AI</em>
          </Link>
          <div className="flex items-center gap-7">
            {[
              { label: "Jobs", href: "/jobs", active: false },
              { label: "Company", href: "/company", active: true },
              { label: "Analyze", href: "/analyze", active: false },
            ].map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
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
              <span className="animate-pulse">●</span> Direktori Perusahaan
            </div>

            <h1
              className="font-syne font-extrabold leading-[1.1] tracking-tight mb-[14px]"
              style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>
              Perusahaan yang{" "}
              <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Sedang Merekrut
              </span>
            </h1>

            <p className="text-[#7a9585] text-[0.95rem] leading-[1.7] mb-8 max-w-[520px] mx-auto">
              Temukan perusahaan impian kamu, pelajari kultur kerja mereka, dan
              lamar ke posisi yang tersedia sekarang.
            </p>

            {/* Stats bar */}
            <div className="inline-flex items-center gap-6 bg-[#0f1612] border border-emerald-500/15 rounded-full px-6 py-[10px] text-[0.75rem]">
              <span className="flex items-center gap-[6px] text-[#7a9585]">
                <Building2 size={13} className="text-emerald-400" />
                <span className="text-[#e8f0ec] font-bold">
                  {loading ? "—" : companies.length}
                </span>{" "}
                perusahaan
              </span>
              <span className="w-px h-3 bg-emerald-500/20" />
              <span className="flex items-center gap-[6px] text-[#7a9585]">
                <Briefcase size={13} className="text-emerald-400" />
                <span className="text-[#e8f0ec] font-bold">
                  {loading
                    ? "—"
                    : companies.reduce((a, c) => a + (c.openJobs || 0), 0)}
                </span>{" "}
                lowongan aktif
              </span>
              <span className="w-px h-3 bg-emerald-500/20" />
              <span className="flex items-center gap-[6px] text-[#7a9585]">
                <Globe size={13} className="text-emerald-400" />
                <span className="text-[#e8f0ec] font-bold">Remote</span>{" "}
                tersedia
              </span>
            </div>
          </motion.div>
        </section>

        {/* TOOLBAR */}
        <section className="pt-6">
          <div className="max-w-[1180px] mx-auto px-6">
            <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-4 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  size={16}
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
                />
                <Input
                  placeholder="Cari nama perusahaan, industri, atau tag..."
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
                      ${
                        filter === f
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-transparent border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"
                      }`}>
                    {f}
                  </button>
                ))}
              </div>
              <span className="flex items-center gap-[6px] text-[#7a9585] text-[0.78rem] ml-auto">
                <SlidersHorizontal size={13} />
                {loading ? "Memuat..." : `${filtered.length} perusahaan`}
              </span>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="py-8 pb-20">
          <div className="max-w-[1180px] mx-auto px-6">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <Loader2
                    size={28}
                    className="text-emerald-400 animate-spin"
                  />
                  <span className="text-[#7a9585] text-[0.85rem]">
                    Memuat perusahaan...
                  </span>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 text-[#7a9585]">
                    <div className="text-5xl mb-4 opacity-40">🏢</div>
                    <div className="font-syne text-[1.1rem] font-bold text-[#e8f0ec] mb-2">
                      Tidak ada perusahaan ditemukan
                    </div>
                    <p className="text-[0.85rem]">
                      Coba kata kunci lain atau hapus filter.
                    </p>
                  </motion.div>
                ) : (
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(320px, 1fr))",
                    }}>
                    {filtered.map((company, i) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>

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
