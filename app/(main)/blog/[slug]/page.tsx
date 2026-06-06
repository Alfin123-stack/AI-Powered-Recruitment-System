import { Suspense } from "react";
import { notFound } from "next/navigation";

import ArticleHeader from "@/components/blog-detail/ArticleHeader";
import ArticleBody from "@/components/blog-detail/ArticleBody";
import ArticleCTA from "@/components/blog-detail/ArticleCTA";
import RelatedArticles from "@/components/blog-detail/RelatedArticles";
import BlogDetailSkeleton from "@/components/blog-detail/BlogDetailSkeleton";
import { ARTICLE_MAP } from "@/lib/articles";

export function generateStaticParams() {
  return Object.keys(ARTICLE_MAP).map((slug) => ({ slug }));
}

export const revalidate = 3600;

// Metadata per artikel (SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLE_MAP[slug];
  if (!article) return {};
  return {
    title: `${article.title} — RecruitAI Blog`,
    description: article.excerpt,
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  // async/await langsung — tidak perlu use() karena ini Server Component
  const { slug } = await params;
  const article = ARTICLE_MAP[slug];

  if (!article) notFound();

  const related = article.relatedSlugs
    .map((s: string) => ARTICLE_MAP[s])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        <Suspense fallback={<BlogDetailSkeleton />}>
          <ArticleHeader article={article} />
          <ArticleBody article={article} />
          <ArticleCTA />
          <RelatedArticles articles={related} />
        </Suspense>
      </main>
    </div>
  );
}
