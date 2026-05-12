"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Search,
  ArrowRight,
  Clock,
  Sparkles,
  Globe,
  BookOpen,
  TrendingUp,
  FileText,
  Brain,
  Target,
  Zap,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Heart,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type EditorialArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  tag: string;
  icon: React.ReactNode;
};

type DevToArticle = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  thumbnail?: string;
  author?: string;
  authorImage?: string;
  readTime?: number;
  reactions?: number;
  tags?: string[];
};

// ── Editorial Articles ───────────────────────────────────────────────────────
const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    slug: "cara-optimasi-cv-lolos-ats",
    title: "Cara Optimasi CV agar Lolos Sistem ATS Perusahaan",
    excerpt:
      "Sebagian besar perusahaan besar kini menggunakan Applicant Tracking System (ATS) untuk menyaring CV secara otomatis. Pelajari cara memformat dan menyusun CV agar tidak gugur di tahap pertama.",
    category: "Tips CV",
    readTime: "7 menit",
    date: "10 Mei 2025",
    featured: true,
    tag: "ATS",
    icon: <Target size={20} />,
  },
  {
    slug: "skill-yang-paling-dicari-2025",
    title: "10 Skill yang Paling Dicari Perusahaan Teknologi di 2025",
    excerpt:
      "Lanskap teknologi berubah cepat. Dari AI/ML hingga cloud computing — ini daftar skill yang wajib kamu miliki jika ingin bersaing di pasar kerja tech tahun ini.",
    category: "Tren Industri",
    readTime: "6 menit",
    date: "8 Mei 2025",
    featured: true,
    tag: "Karier",
    icon: <TrendingUp size={20} />,
  },
  {
    slug: "tips-cv-fresh-graduate",
    title: "Panduan Lengkap Membuat CV untuk Fresh Graduate",
    excerpt:
      "Belum punya pengalaman kerja tapi ingin CV kamu tetap kuat? Ini strategi yang dipakai fresh graduate untuk menarik perhatian rekruter dan lolos seleksi awal.",
    category: "Tips CV",
    readTime: "8 menit",
    date: "5 Mei 2025",
    tag: "Fresh Graduate",
    icon: <FileText size={20} />,
  },
  {
    slug: "kesalahan-umum-cv-kandidat",
    title: "7 Kesalahan Fatal CV yang Sering Dilakukan Kandidat",
    excerpt:
      "Rekruter hanya menghabiskan 7 detik untuk membaca satu CV. Pastikan CV kamu tidak melakukan kesalahan-kesalahan ini yang langsung mengirimmu ke tumpukan reject.",
    category: "Tips CV",
    readTime: "5 menit",
    date: "2 Mei 2025",
    tag: "CV",
    icon: <Brain size={20} />,
  },
  {
    slug: "cara-menulis-ringkasan-profesional",
    title: "Cara Menulis Professional Summary yang Bikin Rekruter Tertarik",
    excerpt:
      "Professional summary adalah kesan pertama di CV kamu — 3–5 kalimat yang menentukan apakah rekruter akan terus membaca atau melewatinya. Pelajari formulanya di sini.",
    category: "Tips CV",
    readTime: "6 menit",
    date: "28 Apr 2025",
    tag: "CV",
    icon: <FileText size={20} />,
  },
  {
    slug: "persiapan-interview-kerja",
    title: "Strategi Persiapan Interview Kerja yang Terbukti Efektif",
    excerpt:
      "Lolos seleksi CV adalah setengah perjalanan. Pelajari cara mempersiapkan diri untuk interview, mulai dari riset perusahaan hingga menjawab pertanyaan jebakan dengan percaya diri.",
    category: "Karier",
    readTime: "9 menit",
    date: "25 Apr 2025",
    tag: "Interview",
    icon: <Zap size={20} />,
  },
  {
    slug: "memahami-job-description",
    title: "Cara Membaca Job Description dan Menyesuaikan CV",
    excerpt:
      "Mengirim CV yang sama ke semua lowongan adalah kesalahan besar. Pelajari cara membaca job description dengan cermat dan menyesuaikan CV untuk setiap posisi yang kamu lamar.",
    category: "Tips CV",
    readTime: "7 menit",
    date: "20 Apr 2025",
    tag: "CV",
    icon: <BookOpen size={20} />,
  },
  {
    slug: "bangun-personal-branding-linkedin",
    title:
      "Membangun Personal Branding di LinkedIn untuk Karier yang Lebih Baik",
    excerpt:
      "LinkedIn bukan sekadar CV online — ini platform di mana rekruter aktif mencari kandidat. Pelajari cara mengoptimalkan profil dan membangun jaringan yang bermakna.",
    category: "Karier",
    readTime: "8 menit",
    date: "15 Apr 2025",
    tag: "LinkedIn",
    icon: <TrendingUp size={20} />,
  },
];

const CATEGORIES = ["Semua", "Tips CV", "Tren Industri", "Karier"];

// ── Sub-components ────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function EditorialCard({
  article,
  index,
}: {
  article: EditorialArticle;
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.07}>
      <Link
        href={`/blog/${article.slug}`}
        className="no-underline block h-full">
        <article className="h-full bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] group cursor-pointer">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-[9px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:bg-emerald-500/15 transition-colors">
              {article.icon}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {article.featured && (
                <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 px-[9px] py-[3px] rounded-full text-[0.62rem] font-bold tracking-[0.08em] uppercase">
                  <Sparkles size={9} /> Pilihan Editor
                </span>
              )}
              <span className="bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-[9px] py-[3px] rounded-full text-[0.62rem] font-semibold">
                {article.tag}
              </span>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1">
            <p className="text-[0.68rem] text-emerald-500/70 font-semibold uppercase tracking-[0.08em] mb-2">
              {article.category}
            </p>
            <h3 className="font-syne font-bold text-[1rem] leading-[1.4] text-[#e8f0ec] mb-3 group-hover:text-emerald-400 transition-colors">
              {article.title}
            </h3>
            <p className="text-[#7a9585] text-[0.845rem] leading-[1.65] line-clamp-3">
              {article.excerpt}
            </p>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-emerald-500/10">
            <div className="flex items-center gap-3 text-[#4a6b58] text-[0.75rem]">
              <span className="flex items-center gap-1">
                <Clock size={11} /> {article.readTime}
              </span>
              <span>·</span>
              <span>{article.date}</span>
            </div>
            <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors">
              <ArrowRight size={14} />
            </span>
          </div>
        </article>
      </Link>
    </FadeIn>
  );
}

// ── Dev.to Card (improved) ────────────────────────────────────────────────────
function DevToCard({
  article,
  index,
}: {
  article: DevToArticle;
  index: number;
}) {
  const cleanDesc = article.description
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 130);

  const formattedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // Extract just the author name from "dev.to — Name"
  const authorName = article.author || article.source.replace("dev.to — ", "");
  const visibleTags = (article.tags || []).slice(0, 3);

  return (
    <FadeIn delay={index * 0.05}>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline block h-full">
        <article className="h-full bg-[#080d0b] border border-emerald-500/10 rounded-[16px] overflow-hidden flex flex-col transition-all duration-300 hover:border-emerald-500/25 hover:-translate-y-[3px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] group cursor-pointer">
          {/* Thumbnail */}
          {article.thumbnail ? (
            <div className="relative h-[140px] overflow-hidden bg-[#0f1612] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d0b] via-transparent to-transparent" />
              {/* Dev.to badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-emerald-500/20 text-emerald-400 px-2 py-[3px] rounded-full text-[0.58rem] font-bold tracking-[0.08em] uppercase">
                  <Globe size={7} /> dev.to
                </span>
              </div>
            </div>
          ) : (
            /* No thumbnail: decorative header strip */
            <div className="h-[6px] bg-gradient-to-r from-emerald-500/40 via-cyan-500/30 to-emerald-500/10 flex-shrink-0" />
          )}

          {/* Body */}
          <div className="flex flex-col gap-3 p-5 flex-1">
            {/* Author row */}
            <div className="flex items-center gap-2">
              {article.authorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.authorImage}
                  alt={authorName}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/20"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <User size={10} className="text-emerald-500/60" />
                </div>
              )}
              <span className="text-[0.68rem] text-[#5a7a68] font-medium truncate max-w-[160px]">
                {authorName}
              </span>
              {!article.thumbnail && (
                <span className="ml-auto inline-flex items-center gap-1 bg-[#0f1612] border border-emerald-500/15 text-emerald-400/70 px-[7px] py-[2px] rounded-full text-[0.58rem] font-bold tracking-[0.08em] uppercase">
                  <Globe size={7} /> dev.to
                </span>
              )}
            </div>

            {/* Title */}
            <h4 className="font-syne font-bold text-[0.92rem] leading-[1.45] text-[#c8d9d0] group-hover:text-emerald-400 transition-colors line-clamp-2">
              {article.title}
            </h4>

            {/* Description */}
            {cleanDesc && (
              <p className="text-[#4a6b58] text-[0.80rem] leading-[1.6] line-clamp-2 flex-1">
                {cleanDesc}
                {cleanDesc.length >= 130 ? "…" : ""}
              </p>
            )}

            {/* Tags */}
            {visibleTags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag size={9} className="text-emerald-500/30" />
                {visibleTags.map((t) => (
                  <span
                    key={t}
                    className="text-[0.60rem] text-emerald-500/50 bg-emerald-500/[0.05] border border-emerald-500/10 px-[6px] py-[1px] rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-500/[0.07] mt-auto">
              <div className="flex items-center gap-3 text-[#3a5545] text-[0.70rem]">
                {article.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {article.readTime} min
                  </span>
                )}
                {typeof article.reactions === "number" && (
                  <span className="flex items-center gap-1">
                    <Heart size={10} />
                    {article.reactions}
                  </span>
                )}
                {formattedDate && (
                  <span className="hidden sm:inline">{formattedDate}</span>
                )}
              </div>
              <span className="flex items-center gap-1 text-cyan-500/50 group-hover:text-cyan-400 transition-colors text-[0.70rem]">
                Baca <ExternalLink size={10} />
              </span>
            </div>
          </div>
        </article>
      </a>
    </FadeIn>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-[#080d0b] border border-emerald-500/10 rounded-[16px] overflow-hidden animate-pulse">
      <div className="h-[140px] bg-emerald-500/[0.05]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10" />
          <div className="h-2 w-24 bg-emerald-500/10 rounded" />
        </div>
        <div className="h-4 w-full bg-emerald-500/[0.07] rounded" />
        <div className="h-4 w-4/5 bg-emerald-500/[0.07] rounded" />
        <div className="h-3 w-3/5 bg-emerald-500/[0.05] rounded mt-1" />
        <div className="flex gap-1 mt-1">
          <div className="h-4 w-12 bg-emerald-500/[0.04] rounded-full" />
          <div className="h-4 w-16 bg-emerald-500/[0.04] rounded-full" />
        </div>
        <div className="h-[1px] bg-emerald-500/[0.07] mt-1" />
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-emerald-500/[0.05] rounded" />
          <div className="h-3 w-12 bg-emerald-500/[0.05] rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [devToArticles, setDevToArticles] = useState<DevToArticle[]>([]);
  const [devToLoading, setDevToLoading] = useState(true);
  const [devToError, setDevToError] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 6;

  const fetchDevTo = async () => {
    setDevToLoading(true);
    setDevToError(false);
    setCurrentPage(1);
    try {
      const res = await fetch("/api/rss");
      if (!res.ok) throw new Error("fetch failed");
      const data: DevToArticle[] = await res.json();
      setDevToArticles(data);
      if (data.length === 0) setDevToError(true);
    } catch {
      setDevToError(true);
    } finally {
      setDevToLoading(false);
      setLastFetched(new Date());
    }
  };

  useEffect(() => {
    fetchDevTo();
  }, []);

  const filteredEditorial = useMemo(() => {
    return EDITORIAL_ARTICLES.filter((a) => {
      const matchCat =
        activeCategory === "Semua" || a.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        q === "" ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const filteredDevTo = useMemo(() => {
    if (search === "") return devToArticles;
    const q = search.toLowerCase();
    return devToArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [search, devToArticles]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredDevTo.length / ARTICLES_PER_PAGE);
  const paginatedDevTo = filteredDevTo.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE,
  );

  const featuredArticles = filteredEditorial.filter((a) => a.featured);
  const regularArticles = filteredEditorial.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <Navbar />
      <main className="pt-16">
        {/* ── HERO ── */}
        <section className="pt-[100px] pb-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
          <div className="max-w-[1180px] mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[640px]">
              <div className="mb-5">
                <span className="inline-flex items-center gap-[5px] px-[12px] py-[4px] rounded-full text-[0.68rem] font-semibold tracking-[0.09em] uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <BookOpen size={9} /> Blog & Insight Karier
                </span>
              </div>
              <h1 className="font-syne font-extrabold text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.1] tracking-tight mb-5">
                Tips, Tren, dan{" "}
                <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Insight Karier
                </span>{" "}
                Terkini
              </h1>
              <p className="text-[#7a9585] text-[1rem] leading-[1.72] max-w-[520px]">
                Artikel pilihan editor RecruitAI tentang tips CV, tren industri,
                dan strategi karier — plus konten terbaru dari komunitas
                developer global via dev.to.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 max-w-[520px]">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b58] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Cari artikel, tips, atau topik..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0f1612] border border-emerald-500/20 rounded-[10px] pl-10 pr-10 py-[11px] text-[0.9rem] text-[#e8f0ec] placeholder-[#4a6b58] focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6b58] hover:text-emerald-400 transition-colors text-[0.75rem] cursor-pointer">
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── EDITORIAL SECTION ── */}
        <section className="pb-[80px]">
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Category filter */}
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-[7px] rounded-[8px] text-[0.82rem] font-medium transition-all border cursor-pointer
                    ${
                      activeCategory === cat
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                        : "bg-transparent border-emerald-500/10 text-[#7a9585] hover:text-[#e8f0ec] hover:border-emerald-500/20"
                    }`}>
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-[#4a6b58] text-[0.78rem]">
                {filteredEditorial.length} artikel editorial
              </span>
            </div>

            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="font-syne font-bold text-[0.85rem] text-[#e8f0ec]">
                  Pilihan Editor RecruitAI
                </span>
              </div>
              <div className="flex-1 h-[1px] bg-emerald-500/10" />
            </div>

            {filteredEditorial.length === 0 ? (
              <div className="text-center py-16 text-[#4a6b58]">
                <Search size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-[0.9rem]">
                  Tidak ada artikel yang cocok dengan pencarian kamu.
                </p>
              </div>
            ) : (
              <>
                {/* Featured 2-col */}
                {featuredArticles.length > 0 &&
                  search === "" &&
                  activeCategory === "Semua" && (
                    <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] mb-5">
                      {featuredArticles.map((a, i) => (
                        <EditorialCard key={a.slug} article={a} index={i} />
                      ))}
                    </div>
                  )}
                {/* Regular 3-col */}
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                  {(search !== "" || activeCategory !== "Semua"
                    ? filteredEditorial
                    : regularArticles
                  ).map((a, i) => (
                    <EditorialCard key={a.slug} article={a} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        {search === "" && (
          <section className="pb-[80px]">
            <div className="max-w-[1180px] mx-auto px-6">
              <div className="bg-[#0f1612] border border-emerald-500/20 rounded-[18px] px-8 py-7 flex items-center justify-between gap-6 flex-wrap relative overflow-hidden">
                <div className="absolute right-0 top-0 w-[300px] h-full pointer-events-none bg-[radial-gradient(ellipse_at_right,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
                <div className="relative">
                  <p className="font-syne font-extrabold text-[1.2rem] text-[#e8f0ec] mb-2">
                    Sudah tahu cara optimasi CV yang benar?
                  </p>
                  <p className="text-[#7a9585] text-[0.875rem] max-w-[440px] leading-[1.65]">
                    Sekarang coba analisis CV kamu — lihat Resume Score, ATS
                    Score, dan rekomendasi spesifik yang bisa langsung kamu
                    terapkan.
                  </p>
                </div>
                <Link
                  href="/analyze"
                  className="relative inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.9rem] px-7 py-[12px] rounded-[10px] no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_28px_rgba(16,185,129,0.3)] flex-shrink-0">
                  <Brain size={15} /> Analisis CV Saya
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── DEV.TO SECTION ── */}
        <section
          id="devto-section"
          className="bg-[#060b09] py-[80px] pb-[100px] border-t border-emerald-500/[0.07]">
          <div className="max-w-[1180px] mx-auto px-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-10 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-[6px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Globe size={12} className="text-emerald-400" />
                  </div>
                  <span className="font-syne font-bold text-[1rem] text-[#e8f0ec]">
                    Dari Komunitas Global
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/[0.07] border border-emerald-500/15 text-emerald-400/70 px-[8px] py-[2px] rounded-full text-[0.6rem] font-bold tracking-[0.07em] uppercase">
                    dev.to
                  </span>
                </div>
                <p className="text-[#4a6b58] text-[0.82rem] max-w-[480px] leading-[1.6]">
                  Artikel terbaru seputar{" "}
                  <span className="text-emerald-500/60">career</span>,{" "}
                  <span className="text-emerald-500/60">productivity</span>,{" "}
                  <span className="text-emerald-500/60">AI</span>, dan{" "}
                  <span className="text-emerald-500/60">programming</span> dari
                  komunitas developer global.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {lastFetched && (
                  <span className="text-[#3a5545] text-[0.70rem]">
                    Diperbarui{" "}
                    {lastFetched.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                <button
                  onClick={fetchDevTo}
                  disabled={devToLoading}
                  className="flex items-center gap-[6px] text-[#4a6b58] hover:text-emerald-400 transition-colors text-[0.75rem] cursor-pointer disabled:opacity-40 border border-emerald-500/10 hover:border-emerald-500/25 px-3 py-[6px] rounded-[8px]">
                  <RefreshCw
                    size={11}
                    className={devToLoading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats bar — show when loaded */}
            {!devToLoading && !devToError && filteredDevTo.length > 0 && (
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-[#3a5545] text-[0.75rem]">
                  {filteredDevTo.length} artikel ditemukan
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {["career", "productivity", "ai", "programming"].map((t) => (
                    <span
                      key={t}
                      className="text-[0.62rem] text-emerald-500/40 bg-emerald-500/[0.04] border border-emerald-500/[0.08] px-[8px] py-[2px] rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton grid */}
            {devToLoading && (
              <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error state */}
            {!devToLoading && devToError && (
              <div className="text-center py-16 text-[#4a6b58]">
                <AlertCircle size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-[0.875rem] mb-4">
                  Gagal memuat artikel dari dev.to. Coba refresh.
                </p>
                <button
                  onClick={fetchDevTo}
                  className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 px-5 py-[9px] rounded-[8px] text-[0.82rem] hover:bg-emerald-500/[0.06] transition-colors cursor-pointer">
                  <RefreshCw size={13} /> Coba Lagi
                </button>
              </div>
            )}

            {/* Articles grid — 2 columns, 6 per page */}
            {!devToLoading && !devToError && filteredDevTo.length > 0 && (
              <>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                  {paginatedDevTo.map((a, i) => (
                    <DevToCard key={`${a.link}-${i}`} article={a} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-emerald-500/[0.08]">
                    {/* Info */}
                    <span className="text-[#3a5545] text-[0.75rem]">
                      Halaman{" "}
                      <span className="text-emerald-400/70">{currentPage}</span>{" "}
                      dari{" "}
                      <span className="text-emerald-400/70">{totalPages}</span>
                      <span className="hidden sm:inline text-[#2a4035]">
                        {" "}
                        · {filteredDevTo.length} artikel total
                      </span>
                    </span>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      {/* Prev */}
                      <button
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          document
                            .getElementById("devto-section")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-[7px] rounded-[8px] border border-emerald-500/10 text-[#4a6b58] text-[0.78rem] hover:border-emerald-500/25 hover:text-emerald-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                        <ChevronLeft size={13} /> Sebelumnya
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => {
                            // Show: first, last, current ±1, and ellipsis slots
                            return (
                              p === 1 ||
                              p === totalPages ||
                              Math.abs(p - currentPage) <= 1
                            );
                          })
                          .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                            if (
                              idx > 0 &&
                              (p as number) - (arr[idx - 1] as number) > 1
                            ) {
                              acc.push("…");
                            }
                            acc.push(p);
                            return acc;
                          }, [])
                          .map((p, idx) =>
                            p === "…" ? (
                              <span
                                key={`ellipsis-${idx}`}
                                className="text-[#2a4035] text-[0.75rem] px-1">
                                …
                              </span>
                            ) : (
                              <button
                                key={p}
                                onClick={() => {
                                  setCurrentPage(p as number);
                                  document
                                    .getElementById("devto-section")
                                    ?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "start",
                                    });
                                }}
                                className={`w-8 h-8 rounded-[7px] text-[0.78rem] font-medium transition-all border cursor-pointer
                                  ${
                                    currentPage === p
                                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                      : "border-emerald-500/10 text-[#4a6b58] hover:border-emerald-500/20 hover:text-[#e8f0ec]"
                                  }`}>
                                {p}
                              </button>
                            ),
                          )}
                      </div>

                      {/* Next */}
                      <button
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          document
                            .getElementById("devto-section")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-[7px] rounded-[8px] border border-emerald-500/10 text-[#4a6b58] text-[0.78rem] hover:border-emerald-500/25 hover:text-emerald-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                        Berikutnya <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Empty search state */}
            {!devToLoading &&
              !devToError &&
              filteredDevTo.length === 0 &&
              search !== "" && (
                <div className="text-center py-10 text-[#4a6b58] text-[0.875rem]">
                  Tidak ada artikel dev.to yang cocok dengan pencarian kamu.
                </div>
              )}

            {/* Disclaimer */}
            {!devToLoading && !devToError && filteredDevTo.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="h-[1px] w-16 bg-emerald-500/[0.07]" />
                <p className="text-[#1e3028] text-[0.70rem] text-center">
                  Konten di atas adalah milik penulis aslinya di dev.to.
                  RecruitAI hanya menampilkan ringkasan & tautan ke artikel
                  original.
                </p>
                <div className="h-[1px] w-16 bg-emerald-500/[0.07]" />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
