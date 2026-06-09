// @/components/blog/BlogSearchClient.tsx
// CSR orchestrator — wiring hook ke komponen, tidak ada logika filtering di sini

"use client";

import { EditorialArticle } from "@/types/blogs";
import { useBlogFilter } from "@/hooks/main/useBlogFilter";
import { BlogSearchBar } from "./BlogSearchBar";
import EditorialSection from "./EditorialSection";

interface BlogSearchClientProps {
  articles: EditorialArticle[];
}

export default function BlogSearchClient({ articles }: BlogSearchClientProps) {
  const {
    search,
    setSearch,
    clearSearch,
    activeCategory,
    setActiveCategory,
    filtered,
  } = useBlogFilter(articles);

  return (
    <>
      <BlogSearchBar
        value={search}
        onChange={setSearch}
        onClear={clearSearch}
      />
      <EditorialSection
        articles={filtered}
        search={search}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </>
  );
}
