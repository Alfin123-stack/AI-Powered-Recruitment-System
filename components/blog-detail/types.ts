// ── Types ─────────────────────────────────────────────────────────────────────

export type ArticleContent = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  tag: string;
  icon?: React.ReactNode; // make optional
  iconName: string; // add this
  content: React.ReactNode;
  relatedSlugs: string[];
};
