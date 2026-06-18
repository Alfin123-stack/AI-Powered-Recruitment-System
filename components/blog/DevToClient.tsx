"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, RefreshCw, AlertCircle } from "lucide-react";
import { DevToArticle } from "@/types/main/blogs";
import { DevToCard } from "./DevToCard";
import { useFilteredPagination } from "@/hooks/main/useFilteredPagination";
import Pagination from "@/components/Pagination";

interface DevToClientProps {
  articles: DevToArticle[];
  topicTags: string[];
  search?: string;
}

export default function DevToClient({
  articles,
  topicTags,
  search: externalSearch,
}: DevToClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localSearch] = useState("");
  const search = externalSearch ?? localSearch;

  const { filtered, paginated, currentPage, totalPages, setCurrentPage } =
    useFilteredPagination(articles, search);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
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
