import type { ArticleContent } from "@/types/blogs";
interface ArticleBodyProps {
  article: ArticleContent;
}

export default function ArticleBody({ article }: ArticleBodyProps) {
  return (
    <article
      className="
        max-w-[760px] mx-auto px-6 pb-12
        [&_p]:text-[#b8cfc0] [&_p]:text-[0.95rem] [&_p]:leading-[1.82] [&_p]:mb-[1.2rem]
        [&_h2]:font-syne [&_h2]:font-extrabold [&_h2]:text-[1.3rem] [&_h2]:text-[#e8f0ec]
        [&_h2]:mt-[2.2rem] [&_h2]:mb-[0.9rem] [&_h2]:pb-[0.5rem]
        [&_h2]:border-b [&_h2]:border-emerald-500/[0.12]
        [&_h3]:font-syne [&_h3]:font-bold [&_h3]:text-[1.05rem] [&_h3]:text-[#d4e8d8]
        [&_h3]:mt-[1.6rem] [&_h3]:mb-[0.6rem]
        [&_ul]:list-none [&_ul]:p-0 [&_ul]:mb-[1.2rem]
        [&_ul_li]:relative [&_ul_li]:pl-[1.4rem] [&_ul_li]:mb-[0.5rem] [&_ul_li]:text-[#b8cfc0] [&_ul_li]:text-[0.95rem] [&_ul_li]:leading-[1.82]
        [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-[0.6rem]
        [&_ul_li]:before:w-[5px] [&_ul_li]:before:h-[5px] [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-emerald-500
        [&_strong]:text-[#e8f0ec] [&_strong]:font-bold
        [&_em]:text-[#9ab5a5] [&_em]:italic
        [&_a]:text-[#34d399] [&_a]:underline
      "
      style={{ animation: "fadeInUp 0.6s 0.1s ease-out both" }}>
      {article.content}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
}
