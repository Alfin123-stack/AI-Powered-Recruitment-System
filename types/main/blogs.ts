export type EditorialArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  tag: string;
  icon: React.ReactNode;
};

export type DevToRaw = {
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
