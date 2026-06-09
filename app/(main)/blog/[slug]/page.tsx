import { Suspense } from "react";
import { notFound } from "next/navigation";

import BlogDetailSkeleton from "@/components/blog-detail/BlogDetailSkeleton";
import { ARTICLE_MAP } from "@/lib/articles";
import BlogDetailHeader from "@/components/blog-detail/BlogDetailHeader";
import BlogDetailBody from "@/components/blog-detail/BlogDetailBody";
import BlogDetailCTA from "@/components/blog-detail/BlogDetailCTA";
import BlogDetailRelated from "@/components/blog-detail/BlogDetailRelated";

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
          <BlogDetailHeader article={article} />
          <BlogDetailBody article={article} />
          <BlogDetailCTA />
          <BlogDetailRelated articles={related} />
        </Suspense>
      </main>
    </div>
  );
}
