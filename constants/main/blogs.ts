import { createElement } from "react";
import { EditorialArticle } from "@/types/main/blogs";
import {
  Bot,
  Laptop,
  Cpu,
  ShoppingCart,
  CreditCard,
  Palette,
  Building2,
  Target,
  TrendingUp,
  FileText,
  Brain,
  BookOpen,
  Zap,
  type LucideIcon,
} from "lucide-react";

export { getPaletteColor } from "../shared";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "1": Bot,
  "2": Laptop,
  "3": Cpu,
  "4": ShoppingCart,
  "5": CreditCard,
  "6": Palette,
};

export const DEFAULT_ICON: LucideIcon = Building2;

export function getCategoryIcon(id: string): LucideIcon {
  return CATEGORY_ICONS[id] ?? DEFAULT_ICON;
}

export const ARTICLES_PER_PAGE = 6;

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    slug: "cara-optimasi-cv-lolos-ats",
    title: "How to Optimize Your CV to Pass Company ATS Systems",
    excerpt:
      "Most large companies now use Applicant Tracking Systems (ATS) to automatically filter CVs. Learn how to format and structure your CV so it doesn't get eliminated in the first stage.",
    category: "CV Tips",
    readTime: "7 min",
    date: "May 10, 2025",
    featured: true,
    tag: "ATS",
    icon: createElement(Target, { size: 20 }),
  },
  {
    slug: "skill-yang-paling-dicari-2025",
    title: "10 Most In-Demand Skills at Tech Companies in 2025",
    excerpt:
      "The tech landscape is changing fast. From AI/ML to cloud computing — here's the list of skills you need to compete in this year's tech job market.",
    category: "Industry Trends",
    readTime: "6 min",
    date: "May 8, 2025",
    featured: true,
    tag: "Career",
    icon: createElement(TrendingUp, { size: 20 }),
  },
  {
    slug: "tips-cv-fresh-graduate",
    title: "The Complete CV Guide for Fresh Graduates",
    excerpt:
      "No work experience but want a strong CV? Here are the strategies fresh graduates use to catch recruiters' attention and pass the initial screening.",
    category: "CV Tips",
    readTime: "8 min",
    date: "May 5, 2025",
    tag: "Fresh Graduate",
    icon: createElement(FileText, { size: 20 }),
  },
  {
    slug: "kesalahan-umum-cv-kandidat",
    title: "7 Fatal CV Mistakes Candidates Often Make",
    excerpt:
      "Recruiters spend only 7 seconds reading a single CV. Make sure yours doesn't make these mistakes that will send you straight to the rejection pile.",
    category: "CV Tips",
    readTime: "5 min",
    date: "May 2, 2025",
    tag: "CV",
    icon: createElement(Brain, { size: 20 }),
  },
  {
    slug: "cara-menulis-ringkasan-profesional",
    title: "How to Write a Professional Summary That Grabs Recruiters' Attention",
    excerpt:
      "The professional summary is the first impression on your CV — 3–5 sentences that determine whether a recruiter keeps reading or skips past it. Learn the formula here.",
    category: "CV Tips",
    readTime: "6 min",
    date: "Apr 28, 2025",
    tag: "CV",
    icon: createElement(FileText, { size: 20 }),
  },
  {
    slug: "persiapan-interview-kerja",
    title: "Proven Job Interview Preparation Strategies That Work",
    excerpt:
      "Passing the CV screening is only half the journey. Learn how to prepare for interviews, from researching the company to confidently answering trick questions.",
    category: "Career",
    readTime: "9 min",
    date: "Apr 25, 2025",
    tag: "Interview",
    icon: createElement(Zap, { size: 20 }),
  },
  {
    slug: "memahami-job-description",
    title: "How to Read a Job Description and Tailor Your CV",
    excerpt:
      "Sending the same CV to every job is a big mistake. Learn how to carefully read job descriptions and customize your CV for each position you apply to.",
    category: "CV Tips",
    readTime: "7 min",
    date: "Apr 20, 2025",
    tag: "CV",
    icon: createElement(BookOpen, { size: 20 }),
  },
  {
    slug: "bangun-personal-branding-linkedin",
    title: "Building Your Personal Brand on LinkedIn for a Better Career",
    excerpt:
      "LinkedIn is more than an online CV — it's a platform where recruiters actively search for candidates. Learn how to optimize your profile and build a meaningful network.",
    category: "Career",
    readTime: "8 min",
    date: "Apr 15, 2025",
    tag: "LinkedIn",
    icon: createElement(TrendingUp, { size: 20 }),
  },
];

export const CATEGORIES = ["All", "CV Tips", "Industry Trends", "Career"];

export const DEVTO_TOPIC_TAGS = ["career", "productivity", "ai", "programming"];

export { LOCATION_FILTERS } from "../shared";