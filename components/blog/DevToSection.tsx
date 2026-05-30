// components/blog/DevToSection.tsx
// async Server Component — fetch terjadi di SERVER, bukan browser.
// ISR: revalidate setiap 1 jam (3600 detik).
// Halaman tidak perlu loading spinner untuk dev.to — Suspense di page.tsx
// menangani state loading dengan DevToSkeleton.

import DevToClient from "./DevToClient";

type DevToRaw = {
  id: number;
  title: string;
  description: string;
  url: string;
  published_timestamp: string;
  tag_list: string[];
  user: { name: string; username: string; profile_image_90: string };
  cover_image: string | null;
  reading_time_minutes: number;
  public_reactions_count: number;
};

export type DevToArticle = {
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

const DEVTO_TOPIC_TAGS = ["career", "productivity", "ai", "programming"];
const PER_TAG = 6;

// Fetch on server — runs at build time + revalidated every hour
async function fetchDevToArticles(): Promise<DevToArticle[]> {
  const results: DevToArticle[] = [];

  await Promise.allSettled(
    DEVTO_TOPIC_TAGS.map(async (tag) => {
      try {
        const res = await fetch(
          `https://dev.to/api/articles?tag=${tag}&per_page=${PER_TAG}`,
          {
            headers: { Accept: "application/json" },
            // ISR: Next.js caches this fetch and revalidates every hour
            next: { revalidate: 3600 },
          },
        );
        if (!res.ok) return;
        const data: DevToRaw[] = await res.json();
        for (const a of data) {
          results.push({
            title: a.title,
            link: a.url,
            pubDate: a.published_timestamp,
            description: a.description || "",
            source: `dev.to — ${a.user.name}`,
            thumbnail: a.cover_image ?? undefined,
            author: a.user.name,
            authorImage: a.user.profile_image_90,
            readTime: a.reading_time_minutes,
            reactions: a.public_reactions_count,
            tags: a.tag_list,
          });
        }
      } catch {
        // silent per tag — partial results still shown
      }
    }),
  );

  const seen = new Set<string>();
  const deduped = results.filter((a) => {
    if (seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  deduped.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  return deduped;
}

// Server Component: fetch, then hand off to Client for search/pagination
export default async function DevToSection() {
  // This runs on the server — no client bundle cost for fetch logic
  const articles = await fetchDevToArticles();

  // Pass pre-fetched articles to a thin Client Component
  // that handles search filtering + pagination UI
  return <DevToClient articles={articles} topicTags={DEVTO_TOPIC_TAGS} />;
}
