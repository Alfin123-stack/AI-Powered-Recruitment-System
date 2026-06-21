import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Search, Brain } from "lucide-react";

import { EditorialArticle } from "@/types/main/blogs";
import { CATEGORIES } from "@/constants/main/blogs";
import { BlogFadeIn } from "./BlogFadeIn";

// ── Editorial card ─────────────────────────────────────────────────────────────
function EditorialCard({
  article,
  index,
}: {
  article: EditorialArticle;
  index: number;
}) {
  return (
    <BlogFadeIn delay={index * 0.07}>
      <Link
        href={`/blog/${article.slug}`}
        className="no-underline block h-full">
        <article className="h-full bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] group cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-[9px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:bg-emerald-500/15 transition-colors">
              {article.icon}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {article.featured && (
                <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 px-[9px] py-[3px] rounded-full text-[0.62rem] font-bold tracking-[0.08em] uppercase">
                  <Sparkles size={9} /> Editor&apos;s Pick
                </span>
              )}
              <span className="bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-[9px] py-[3px] rounded-full text-[0.62rem] font-semibold">
                {article.tag}
              </span>
            </div>
          </div>
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
    </BlogFadeIn>
  );
}

// ── CTA Strip ──────────────────────────────────────────────────────────────────
function EditorialCTAStrip() {
  return (
    <div className="max-w-[1180px] mx-auto px-6 pb-[80px]">
      <div className="bg-[#0f1612] border border-emerald-500/20 rounded-[18px] px-8 py-7 flex items-center justify-between gap-6 flex-wrap relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[300px] h-full pointer-events-none bg-[radial-gradient(ellipse_at_right,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
        <div className="relative">
          <p className="font-syne font-extrabold text-[1.2rem] text-[#e8f0ec] mb-2">
            Already know how to optimize your CV the right way?
          </p>
          <p className="text-[#7a9585] text-[0.875rem] max-w-[440px] leading-[1.65]">
            Try analyzing your CV now — see your Resume Score, ATS Score, and
            specific recommendations you can apply right away.
          </p>
        </div>
        <Link
          href="/analyze"
          className="relative inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.9rem] px-7 py-[12px] rounded-[10px] no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_28px_rgba(16,185,129,0.3)] flex-shrink-0">
          <Brain size={15} /> Analyze My CV
        </Link>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
interface EditorialSectionProps {
  articles: EditorialArticle[];
  search: string;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function EditorialSection({
  articles,
  search,
  activeCategory,
  onCategoryChange,
}: EditorialSectionProps) {
  const featured = articles.filter((a) => a.featured);
  const regular = articles.filter((a) => !a.featured);
  // NOTE: "Semua" is the sentinel value used by the CATEGORIES constant
  // (@/constants/main/blogs) for the "All" filter option. Left untranslated
  // here so filtering still matches — rename it in both places together
  // if you want the value itself in English (e.g. "All").
  const isFiltered = search !== "" || activeCategory !== "Semua";

  return (
    <>
      <section className="pb-[80px]">
        <div className="max-w-[1180px] mx-auto px-6">
          {/* Category filter */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
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
              {articles.length} editorial articles
            </span>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="font-syne font-bold text-[0.85rem] text-[#e8f0ec]">
                RecruitAI Editor&apos;s Picks
              </span>
            </div>
            <div className="flex-1 h-[1px] bg-emerald-500/10" />
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-[#4a6b58]">
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-[0.9rem]">
                No articles match your search.
              </p>
            </div>
          ) : (
            <>
              {!isFiltered && featured.length > 0 && (
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] mb-5">
                  {featured.map((a, i) => (
                    <EditorialCard key={a.slug} article={a} index={i} />
                  ))}
                </div>
              )}
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                {(isFiltered ? articles : regular).map((a, i) => (
                  <EditorialCard key={a.slug} article={a} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {search === "" && <EditorialCTAStrip />}
    </>
  );
}
