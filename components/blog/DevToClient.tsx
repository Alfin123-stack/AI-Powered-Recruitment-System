"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Clock,
  Heart,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  User,
  Tag,
} from "lucide-react";
import { FadeIn } from "./blog-components";
import Pagination from "@/components/Pagination";
import { DevToArticle } from "@/types/blogs";
import { ARTICLES_PER_PAGE } from "@/constants/blogs";

// ── Card ───────────────────────────────────────────────────────────────────────
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
          {article.thumbnail ? (
            <div className="relative h-[140px] overflow-hidden bg-[#0f1612] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d0b] via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-emerald-500/20 text-emerald-400 px-2 py-[3px] rounded-full text-[0.58rem] font-bold tracking-[0.08em] uppercase">
                  <Globe size={7} /> dev.to
                </span>
              </div>
            </div>
          ) : (
            <div className="h-[6px] bg-gradient-to-r from-emerald-500/40 via-cyan-500/30 to-emerald-500/10 flex-shrink-0" />
          )}

          <div className="flex flex-col gap-3 p-5 flex-1">
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

            <h4 className="font-syne font-bold text-[0.92rem] leading-[1.45] text-[#c8d9d0] group-hover:text-emerald-400 transition-colors line-clamp-2">
              {article.title}
            </h4>

            {cleanDesc && (
              <p className="text-[#4a6b58] text-[0.80rem] leading-[1.6] line-clamp-2 flex-1">
                {cleanDesc}
                {cleanDesc.length >= 130 ? "…" : ""}
              </p>
            )}

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

// ── Main ───────────────────────────────────────────────────────────────────────
interface DevToClientProps {
  articles: DevToArticle[];
  topicTags: string[];
  // search prop: passed down from BlogSearchClient if you wire it via context/prop
  // For now we keep local search state here for the dev.to section independently
  search?: string;
}

export default function DevToClient({
  articles,
  topicTags,
  search: externalSearch,
}: DevToClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // Internal search — used when externalSearch prop is not provided
  const [localSearch, setLocalSearch] = useState("");
  const search = externalSearch ?? localSearch;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    if (!search) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [search, articles]);

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE,
  );

  // Refresh triggers Next.js ISR revalidation by calling router.refresh()
  // This re-runs the Server Component (DevToSection) and re-fetches
  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    // Give the server a moment to respond
    await new Promise((r) => setTimeout(r, 1500));
    setIsRefreshing(false);
  };

  return (
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
              {topicTags.map((t, i) => (
                <span key={t}>
                  <span className="text-emerald-500/60">{t}</span>
                  {i < topicTags.length - 1 ? ", " : ""}
                </span>
              ))}{" "}
              dari komunitas developer global.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#3a5545] text-[0.70rem]">
              Diperbarui setiap 1 jam
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-[6px] text-[#4a6b58] hover:text-emerald-400 transition-colors text-[0.75rem] cursor-pointer disabled:opacity-40 border border-emerald-500/10 hover:border-emerald-500/25 px-3 py-[6px] rounded-[8px]">
              <RefreshCw
                size={11}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        {filtered.length > 0 && (
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-[#3a5545] text-[0.75rem]">
              {filtered.length} artikel ditemukan
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {topicTags.map((t) => (
                <span
                  key={t}
                  className="text-[0.62rem] text-emerald-500/40 bg-emerald-500/[0.04] border border-emerald-500/[0.08] px-[8px] py-[2px] rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Articles grid */}
        {filtered.length > 0 ? (
          <>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
              {paginated.map((a, i) => (
                <DevToCard key={`${a.link}-${i}`} article={a} index={i} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                scrollTargetId="devto-section"
              />
            )}
          </>
        ) : (
          <div className="text-center py-10 text-[#4a6b58] text-[0.875rem]">
            {search ? (
              "Tidak ada artikel dev.to yang cocok dengan pencarian kamu."
            ) : (
              <div className="py-16">
                <AlertCircle size={32} className="mx-auto mb-3 opacity-40" />
                <p className="mb-4">Gagal memuat artikel. Coba refresh.</p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 px-5 py-[9px] rounded-[8px] text-[0.82rem] hover:bg-emerald-500/[0.06] transition-colors cursor-pointer">
                  <RefreshCw size={13} /> Coba Lagi
                </button>
              </div>
            )}
          </div>
        )}

        {/* Attribution */}
        {filtered.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-[1px] w-16 bg-emerald-500/[0.07]" />
            <p className="text-[#1e3028] text-[0.70rem] text-center">
              Konten di atas adalah milik penulis aslinya di dev.to. RecruitAI
              hanya menampilkan ringkasan & tautan ke artikel original.
            </p>
            <div className="h-[1px] w-16 bg-emerald-500/[0.07]" />
          </div>
        )}
      </div>
    </section>
  );
}
