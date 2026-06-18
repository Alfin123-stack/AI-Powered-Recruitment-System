// @/hooks/blog/useBlogFilter.ts
// Mengelola state search & category filter, serta logika filtering artikel

import { useState, useMemo } from "react";
import { EditorialArticle } from "@/types/main/blogs";

interface UseBlogFilterReturn {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filtered: EditorialArticle[];
}

export function useBlogFilter(articles: EditorialArticle[]): UseBlogFilterReturn {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter((a) => {
      const matchCat =
        activeCategory === "Semua" || a.category === activeCategory;
      const matchSearch =
        q === "" ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, articles]);

  return {
    search,
    setSearch,
    clearSearch: () => setSearch(""),
    activeCategory,
    setActiveCategory,
    filtered,
  };
}
