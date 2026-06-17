// constants/blogs.ts

import { createElement } from "react";
import { EditorialArticle } from "@/types/blogs";
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

// getPaletteColor dikonsolidasi ke shared.ts — import dari sana
export { getPaletteColor } from "./shared";

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

// ── Static data ───────────────────────────────────────────────────────────────

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    slug: "cara-optimasi-cv-lolos-ats",
    title: "Cara Optimasi CV agar Lolos Sistem ATS Perusahaan",
    excerpt:
      "Sebagian besar perusahaan besar kini menggunakan Applicant Tracking System (ATS) untuk menyaring CV secara otomatis. Pelajari cara memformat dan menyusun CV agar tidak gugur di tahap pertama.",
    category: "Tips CV",
    readTime: "7 menit",
    date: "10 Mei 2025",
    featured: true,
    tag: "ATS",
    icon: createElement(Target, { size: 20 }),
  },
  {
    slug: "skill-yang-paling-dicari-2025",
    title: "10 Skill yang Paling Dicari Perusahaan Teknologi di 2025",
    excerpt:
      "Lanskap teknologi berubah cepat. Dari AI/ML hingga cloud computing — ini daftar skill yang wajib kamu miliki jika ingin bersaing di pasar kerja tech tahun ini.",
    category: "Tren Industri",
    readTime: "6 menit",
    date: "8 Mei 2025",
    featured: true,
    tag: "Karier",
    icon: createElement(TrendingUp, { size: 20 }),
  },
  {
    slug: "tips-cv-fresh-graduate",
    title: "Panduan Lengkap Membuat CV untuk Fresh Graduate",
    excerpt:
      "Belum punya pengalaman kerja tapi ingin CV kamu tetap kuat? Ini strategi yang dipakai fresh graduate untuk menarik perhatian rekruter dan lolos seleksi awal.",
    category: "Tips CV",
    readTime: "8 menit",
    date: "5 Mei 2025",
    tag: "Fresh Graduate",
    icon: createElement(FileText, { size: 20 }),
  },
  {
    slug: "kesalahan-umum-cv-kandidat",
    title: "7 Kesalahan Fatal CV yang Sering Dilakukan Kandidat",
    excerpt:
      "Rekruter hanya menghabiskan 7 detik untuk membaca satu CV. Pastikan CV kamu tidak melakukan kesalahan-kesalahan ini yang langsung mengirimmu ke tumpukan reject.",
    category: "Tips CV",
    readTime: "5 menit",
    date: "2 Mei 2025",
    tag: "CV",
    icon: createElement(Brain, { size: 20 }),
  },
  {
    slug: "cara-menulis-ringkasan-profesional",
    title: "Cara Menulis Professional Summary yang Bikin Rekruter Tertarik",
    excerpt:
      "Professional summary adalah kesan pertama di CV kamu — 3–5 kalimat yang menentukan apakah rekruter akan terus membaca atau melewatinya. Pelajari formulanya di sini.",
    category: "Tips CV",
    readTime: "6 menit",
    date: "28 Apr 2025",
    tag: "CV",
    icon: createElement(FileText, { size: 20 }),
  },
  {
    slug: "persiapan-interview-kerja",
    title: "Strategi Persiapan Interview Kerja yang Terbukti Efektif",
    excerpt:
      "Lolos seleksi CV adalah setengah perjalanan. Pelajari cara mempersiapkan diri untuk interview, mulai dari riset perusahaan hingga menjawab pertanyaan jebakan dengan percaya diri.",
    category: "Karier",
    readTime: "9 menit",
    date: "25 Apr 2025",
    tag: "Interview",
    icon: createElement(Zap, { size: 20 }),
  },
  {
    slug: "memahami-job-description",
    title: "Cara Membaca Job Description dan Menyesuaikan CV",
    excerpt:
      "Mengirim CV yang sama ke semua lowongan adalah kesalahan besar. Pelajari cara membaca job description dengan cermat dan menyesuaikan CV untuk setiap posisi yang kamu lamar.",
    category: "Tips CV",
    readTime: "7 menit",
    date: "20 Apr 2025",
    tag: "CV",
    icon: createElement(BookOpen, { size: 20 }),
  },
  {
    slug: "bangun-personal-branding-linkedin",
    title: "Membangun Personal Branding di LinkedIn untuk Karier yang Lebih Baik",
    excerpt:
      "LinkedIn bukan sekadar CV online — ini platform di mana rekruter aktif mencari kandidat. Pelajari cara mengoptimalkan profil dan membangun jaringan yang bermakna.",
    category: "Karier",
    readTime: "8 menit",
    date: "15 Apr 2025",
    tag: "LinkedIn",
    icon: createElement(TrendingUp, { size: 20 }),
  },
];

export const CATEGORIES = ["Semua", "Tips CV", "Tren Industri", "Karier"];

export const DEVTO_TOPIC_TAGS = ["career", "productivity", "ai", "programming"];

// Filter lokasi — canonical di constants/shared.ts
export { LOCATION_FILTERS } from "./shared";
