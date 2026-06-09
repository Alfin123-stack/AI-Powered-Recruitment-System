import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { ArticleContent } from "@/types/blogs";

interface BlogDetailRelatedProps {
  articles: ArticleContent[];
}

export default function BlogDetailRelated({ articles }: BlogDetailRelatedProps) {
  if (articles.length === 0) return null;

  return (
    <section className="bg-[#0f1612] py-[60px]">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-7">
          <span className="font-syne font-bold text-[0.85rem] text-[#e8f0ec]">
            Artikel Terkait
          </span>
          <div className="flex-1 h-[1px] bg-emerald-500/10" />
        </div>

        {/* Grid */}
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="no-underline block h-full">
              <article className="h-full bg-[#0a0f0d] border border-emerald-500/10 rounded-[14px] p-5 flex flex-col gap-3 transition-all duration-300 hover:border-emerald-500/25 hover:-translate-y-[2px] group cursor-pointer">
                <span className="text-[0.63rem] text-emerald-500/70 font-semibold uppercase tracking-[0.08em]">
                  {article.category}
                </span>
                <h4 className="font-syne font-bold text-[0.9rem] leading-[1.45] text-[#c8d9d0] group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-[#4a6b58] text-[0.72rem] mt-auto">
                  <Clock size={10} /> {article.readTime}
                  <span className="ml-auto text-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                    <ArrowRight size={13} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[9px] rounded-[9px] no-underline text-[0.84rem] transition-all">
            <ArrowLeft size={13} /> Kembali ke Semua Artikel
          </Link>
        </div>
      </div>
    </section>
  );
}
