import { NextResponse } from "next/server";

type DevToArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  published_timestamp: string;
  tag_list: string[];
  user: {
    name: string;
    username: string;
    profile_image_90: string;
  };
  cover_image: string | null;
  reading_time_minutes: number;
  public_reactions_count: number;
};

type ArticleItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  thumbnail?: string;
  author?: string;
  authorImage?: string;
  readTime?: number;
  reactions?: number;
  tags?: string[];
};

const DEV_TO_TAGS = ["career", "productivity", "ai", "programming"];

export async function GET() {
  const liveArticles: ArticleItem[] = [];

  await Promise.allSettled(
    DEV_TO_TAGS.map(async (tag) => {
      try {
        // PENTING: hapus top=1 — itu penyebab 0 hasil. state=rising = artikel trending minggu ini
        const res = await fetch(
          `https://dev.to/api/articles?tag=${tag}&per_page=6&top=1`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; RecruitAI/1.0)",
              Accept: "application/json",
            },
            next: { revalidate: 3600 },
          },
        );

        if (!res.ok) {
          console.error(`dev.to fetch failed for tag=${tag}: ${res.status}`);
          return;
        }

        const data: DevToArticle[] = await res.json();

        for (const article of data) {
          liveArticles.push({
            title: article.title,
            link: article.url,
            pubDate: article.published_timestamp,
            description: article.description || "",
            source: `dev.to — ${article.user.name}`,
            thumbnail: article.cover_image || undefined,
            author: article.user.name,
            authorImage: article.user.profile_image_90,
            readTime: article.reading_time_minutes,
            reactions: article.public_reactions_count,
            tags: article.tag_list,
          });
        }
      } catch (err) {
        console.error(`dev.to fetch error for tag=${tag}:`, err);
      }
    }),
  );

  // Deduplicate by URL
  const seen = new Set<string>();
  const deduplicated = liveArticles.filter((a) => {
    if (seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  // Sort by newest
  deduplicated.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  // Tidak ada fallback — return array kosong bila semua fetch gagal,
  // UI akan tampilkan error state yang jelas
  return NextResponse.json(deduplicated, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=600" },
  });
}
