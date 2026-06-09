import Link from "next/link";
import { Calendar, Clock, ChevronRight, Sparkles } from "lucide-react";
import type { ArticleContent } from "@/types/blogs";

interface BlogDetailHeaderProps {
  article: ArticleContent;
}

export default function BlogDetailHeader({ article }: BlogDetailHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-[760px] mx-auto px-6 pt-10 pb-0">
        <nav
          className="flex items-center gap-2 text-[0.75rem] text-[#4a6b58]"
          aria-label="Breadcrumb">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors no-underline">
            Beranda
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/blog"
            className="hover:text-emerald-400 transition-colors no-underline">
            Blog
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#7a9585]">{article.category}</span>
        </nav>
      </div>

      {/* Article header — CSS fade-in, no JS */}
      <header
        className="max-w-[760px] mx-auto px-6 pt-8 pb-10"
        style={{ animation: "fadeInUp 0.6s ease-out both" }}>
        {/* Badges */}
        <div className="flex items-center gap-3 flex-wrap mb-5">
          {article.featured && (
            <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 px-[10px] py-[4px] rounded-full text-[0.65rem] font-bold tracking-[0.08em] uppercase">
              <Sparkles size={9} /> Pilihan Editor
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-[10px] py-[4px] rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.07em]">
            {article.category}
          </span>
          <span className="bg-emerald-500/[0.07] border border-emerald-500/15 text-emerald-300/70 px-[9px] py-[3px] rounded-full text-[0.63rem] font-medium">
            {article.tag}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-syne font-extrabold text-[clamp(1.7rem,4vw,2.4rem)] leading-[1.2] tracking-tight text-[#e8f0ec] mb-5">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-[#7a9585] text-[1rem] leading-[1.7] mb-6 border-l-2 border-emerald-500/30 pl-4">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[#4a6b58] text-[0.78rem] pb-6 border-b border-emerald-500/10">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {article.date}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime} baca
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-600">
            <Sparkles size={11} /> RecruitAI Editorial
          </span>
        </div>
      </header>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
