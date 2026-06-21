import { Globe, Clock, Heart, ExternalLink, User, Tag } from "lucide-react";
import { DevToArticle } from "@/types/main/blogs";
import { BlogFadeIn } from "./BlogFadeIn";

interface DevToCardProps {
  article: DevToArticle;
  index: number;
}

export function DevToCard({ article, index }: DevToCardProps) {
  const cleanDesc = article.description
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 130);

  const formattedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const authorName = article.author || article.source.replace("dev.to — ", "");
  const visibleTags = (article.tags || []).slice(0, 3);

  return (
    <BlogFadeIn delay={index * 0.05}>
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
                Read <ExternalLink size={10} />
              </span>
            </div>
          </div>
        </article>
      </a>
    </BlogFadeIn>
  );
}
