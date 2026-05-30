"use client";

// components/blog/BlogSearchClient.tsx
// Client Component — holds ONLY the interactive state:
//   • search string
//   • active category
// Everything else (card rendering) stays in Server Components passed as children.

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { EditorialArticle } from "./blog-types";
import EditorialSection from "./EditorialSection";

interface BlogSearchClientProps {
  articles: EditorialArticle[];
}

export default function BlogSearchClient({ articles }: BlogSearchClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat =
        activeCategory === "Semua" || a.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        q === "" ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, articles]);

  return (
    <>
      {/* Search bar — needs client state, so lives here */}
      <div className="max-w-[1180px] mx-auto px-6 pt-2 pb-6">
        <div
          className="relative max-w-[520px] animate-[fadeInUp_0.65s_0.15s_ease-out_both]"
          style={{ animationFillMode: "both" }}>
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b58] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari artikel, tips, atau topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f1612] border border-emerald-500/20 rounded-[10px] pl-10 pr-10 py-[11px] text-[0.9rem] text-[#e8f0ec] placeholder-[#4a6b58] focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6b58] hover:text-emerald-400 transition-colors text-[0.75rem] cursor-pointer">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Editorial section receives filtered data */}
      <EditorialSection
        articles={filtered}
        search={search}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </>
  );
}
