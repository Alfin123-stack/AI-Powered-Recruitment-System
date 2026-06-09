import { useState, useMemo } from "react";
import { DevToArticle } from "@/types/blogs";
import { ARTICLES_PER_PAGE } from "@/constants/blogs";

interface UseFilteredPaginationResult {
  filtered: DevToArticle[];
  paginated: DevToArticle[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function useFilteredPagination(
  articles: DevToArticle[],
  search: string,
): UseFilteredPaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(search);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setCurrentPage(1);
  }

  const filtered = useMemo(() => {
    if (!search) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [search, articles]);

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE,
  );

  return { filtered, paginated, currentPage, totalPages, setCurrentPage };
}
