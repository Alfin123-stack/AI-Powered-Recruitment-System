import { DevToArticle, DevToRaw } from "@/types/blogs";

const PER_TAG = 6;

export async function fetchDevToArticles(
  tags: string[],
): Promise<DevToArticle[]> {
  const results: DevToArticle[] = [];

  await Promise.allSettled(
    tags.map(async (tag) => {
      try {
        const res = await fetch(
          `https://dev.to/api/articles?tag=${tag}&per_page=${PER_TAG}`,
          {
            headers: { Accept: "application/json" },
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
        // silent per tag — partial results tetap ditampilkan
      }
    }),
  );

  const seen = new Set<string>();
  const deduped = results.filter((a) => {
    if (seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  return deduped.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });
}
