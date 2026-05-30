// app/(main)/blog/page.tsx
// Server Component — SSG (statically generated at build time)

import { Suspense } from "react";
import BlogHero from "@/components/blog/BlogHero";
import BlogSearchClient from "@/components/blog/BlogSearchClient";
import DevToSection from "@/components/blog/DevToSection";
import DevToSkeleton from "@/components/blog/DevToSkeleton";
import { EDITORIAL_ARTICLES } from "@/components/blog/blog-types";

export const revalidate = false;

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        {/* Server Component — pure markup, no JS */}
        <BlogHero />

        {/*
          BlogSearchClient (Client Component) owns:
            - search state
            - activeCategory state
          It internally renders EditorialSection with filtered articles.
          JANGAN render <EditorialSection> di sini — cukup pass articles ke BlogSearchClient.
        */}
        <BlogSearchClient articles={EDITORIAL_ARTICLES} />

        {/* DevToSection = async Server Component (ISR 1 jam) */}
        <Suspense fallback={<DevToSkeleton />}>
          <DevToSection />
        </Suspense>
      </main>
    </div>
  );
}
