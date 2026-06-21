import { Suspense } from "react";
import BlogHero from "@/components/blog/BlogHero";
import BlogSearchClient from "@/components/blog/BlogSearchClient";
import DevToSection from "@/components/blog/DevToSection";
import BlogSkeleton from "@/components/blog/BlogSkeleton";
import { EDITORIAL_ARTICLES } from "@/constants/main/blogs";

export const revalidate = 3600;

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">

        <Suspense fallback={<BlogSkeleton />}>
          <BlogHero />
          <BlogSearchClient articles={EDITORIAL_ARTICLES} />
          <DevToSection />
        </Suspense>
      </main>
    </div>
  );
}