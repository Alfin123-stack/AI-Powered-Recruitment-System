import { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Step = {
  num: string;
  title: string;
  desc: string;
  icon: ReactNode;
};

export type Feature = {
  icon: ReactNode;
  title: string;
  badge: string;
  desc: string;
  bullets: string[];
  color: string;
  href: string;
};

export type Problem = {
  icon: ReactNode;
  title: string;
  stat: string;
  statLabel: string;
  desc: string;
};

export type Faq = { q: string; a: string };

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  color: string;
  rating: number;
  tag: string;
};

export type TabCard = {
  icon: ReactNode;
  title: string;
  desc: string;
  href: string;
};

// ── Static data ───────────────────────────────────────────────────────────────
// Imported in components to keep JSX files free of long arrays.

import {
  Upload,
  Brain,
  BarChart3,
  Target,
  Briefcase,
  Users,
  Building2,
  Clock,
  Scale,
  XCircle,
} from "lucide-react";
import { createElement } from "react";

export const STEPS: Step[] = [
  {
    num: "01",
    icon: createElement(Upload, { size: 20 }),
    title: "Upload CV Anda",
    desc: "Upload file PDF CV kamu. Sistem membaca dan memproses isi dokumen secara otomatis — tidak perlu isi form manual.",
  },
  {
    num: "02",
    icon: createElement(Brain, { size: 20 }),
    title: "AI Menganalisis CV",
    desc: "Model AI kami mengekstraksi skill, pengalaman, pendidikan, dan menilai kesesuaian dengan standar seleksi otomatis dalam hitungan detik.",
  },
  {
    num: "03",
    icon: createElement(BarChart3, { size: 20 }),
    title: "Dapatkan Skor & Analisis",
    desc: "Sistem memberikan Resume Score, ATS Score, dan Overall Rating dengan penjelasan per kategori yang mudah ditindaklanjuti.",
  },
  {
    num: "04",
    icon: createElement(Target, { size: 20 }),
    title: "Temukan Job yang Cocok",
    desc: "Skill yang terdeteksi dari CV kamu otomatis dipakai untuk menyarankan lowongan paling relevan — langsung dari halaman Job Matches.",
  },
];

export const FEATURES: Feature[] = [
  {
    icon: createElement(Brain, { size: 24 }),
    title: "Analisis CV dengan AI",
    badge: "Analisis Cerdas",
    color: "#10b981",
    href: "/analyze",
    desc: "Upload PDF CV dan dapatkan analisis mendalam — ekstraksi skill, penilaian skor, dan rekomendasi perbaikan konkret per bagian.",
    bullets: [
      "Resume Score + ATS Score + Overall Rating",
      "Breakdown skor per kategori (Pengalaman, Pendidikan, dll.)",
      "Rekomendasi perbaikan spesifik per bagian CV",
    ],
  },
  {
    icon: createElement(Briefcase, { size: 24 }),
    title: "Pencocokan Lowongan Otomatis",
    badge: "Smart Matching",
    color: "#06b6d4",
    href: "/jobs",
    desc: "Skill yang terdeteksi dari CV kamu langsung dipakai untuk mencocokkan lowongan paling relevan — tanpa perlu input ulang.",
    bullets: [
      "Skill terdeteksi otomatis dari CV",
      "Saran lowongan berdasarkan profil terkini",
      "Lihat semua lowongan aktif di direktori Jobs",
    ],
  },
  {
    icon: createElement(Users, { size: 24 }),
    title: "Dashboard Rekruter",
    badge: "Untuk HR",
    color: "#f59e0b",
    href: "/dashboard/hr",
    desc: "Dashboard komprehensif untuk tim HR — lihat semua pelamar, bandingkan skor kandidat, dan update status secara real-time.",
    bullets: [
      "Ranking kandidat otomatis berdasarkan skor AI",
      "Shortlist, review, atau tolak kandidat dengan mudah",
      "Lihat CV asli & detail skill setiap kandidat",
    ],
  },
  {
    icon: createElement(Building2, { size: 24 }),
    title: "Direktori Perusahaan",
    badge: "Company Directory",
    color: "#8b5cf6",
    href: "/company",
    desc: "Kandidat dapat menjelajahi perusahaan yang sedang merekrut, melihat lowongan aktif, dan langsung melamar ke posisi yang tersedia.",
    bullets: [
      "Filter perusahaan per kota & industri",
      "Lihat lowongan aktif per perusahaan",
      "Ikuti perusahaan yang diminati",
    ],
  },
];

export const PROBLEMS: Problem[] = [
  {
    icon: createElement(Clock, { size: 28 }),
    title: "Screening Manual Memakan Waktu",
    stat: "73%",
    statLabel: "HR menghabiskan lebih dari 6 jam per hari hanya untuk membaca CV",
    desc: "Rata-rata rekruter hanya menghabiskan 7 detik per CV. AI kami memproses dan memberikan skor CV dalam hitungan detik dengan konsistensi yang tidak bisa dilakukan secara manual.",
  },
  {
    icon: createElement(Scale, { size: 28 }),
    title: "Penilaian yang Tidak Objektif",
    stat: "62%",
    statLabel: "Keputusan hiring dipengaruhi penilaian subjektif tak disadari",
    desc: "Penilaian manusia rentan bias. Sistem kami memberikan skor yang objektif dan konsisten, berbasis konten CV yang sebenarnya — bukan kesan pertama.",
  },
  {
    icon: createElement(XCircle, { size: 28 }),
    title: "CV Tidak Lolos Seleksi Awal",
    stat: "75%",
    statLabel: "CV berkualitas gagal di seleksi otomatis sebelum dibaca HR",
    desc: "Banyak kandidat kompeten gugur di tahap pertama. Fitur ATS Score kami mendeteksi masalah sebelum CV dikirim, sehingga kamu punya waktu memperbaikinya.",
  },
];

export const FAQS: Faq[] = [
  {
    q: "Apa itu fitur Analisis CV dan bagaimana cara kerjanya?",
    a: "Fitur Analisis CV memproses file PDF menggunakan model kecerdasan buatan. Sistem membaca isi dokumen, mengidentifikasi skill, pengalaman, dan pendidikan, lalu menghasilkan Resume Score (kualitas konten), ATS Score (kesesuaian dengan sistem seleksi otomatis), dan Overall Rating beserta rekomendasi perbaikan yang spesifik.",
  },
  {
    q: "Apakah hasil analisis CV saya tersimpan?",
    a: "Ya, jika kamu sudah login. Hasil analisis termasuk skor, skill yang terdeteksi, dan rekomendasi tersimpan ke akunmu dan bisa dibuka kembali kapan saja. Jika belum login, analisis tetap berjalan tapi tidak tersimpan untuk sesi berikutnya.",
  },
  {
    q: "Bagaimana cara Job Matching bekerja setelah analisis CV?",
    a: "Setelah analisis selesai, skill yang terdeteksi dari CV kamu ditampilkan sebagai label di halaman hasil. Kamu bisa langsung klik 'Lihat Job Matches' untuk melihat lowongan yang paling relevan berdasarkan skill tersebut, atau jelajahi semua lowongan yang tersedia.",
  },
  {
    q: "Apakah data CV saya aman dan terlindungi?",
    a: "CV diproses langsung di perangkat kamu sebelum dikirim untuk dianalisis. File asli disimpan dengan sistem keamanan berlapis sehingga data kamu hanya bisa diakses oleh akunmu sendiri.",
  },
  {
    q: "Apa perbedaan akun Kandidat dan HR?",
    a: "Akun Kandidat dapat menganalisis CV, melihat job matches, menyimpan lowongan, dan memantau status lamaran. Akun HR mendapat akses ke dashboard rekrutmen: melihat semua pelamar, membandingkan skor kandidat, serta mengubah status kandidat.",
  },
  {
    q: "Apakah platform ini gratis digunakan?",
    a: "Fitur analisis CV tersedia gratis untuk kandidat. Cukup buat akun dan langsung upload CV untuk mendapatkan skor dan rekomendasi. Untuk fitur rekrutmen tim HR, tersedia paket yang bisa disesuaikan dengan kebutuhan perusahaan.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Sebelumnya saya sudah lamar ke 20+ perusahaan tapi tidak lolos seleksi awal sama sekali. Setelah pakai RecruitAI, ATS Score saya naik signifikan — dan akhirnya dapat interview pertama dalam 2 minggu.",
    name: "Rizky Aditya",
    role: "Fresh Graduate",
    company: "Teknik Informatika, Universitas Brawijaya",
    avatar: "RA",
    color: "#10b981",
    rating: 5,
    tag: "Kandidat",
  },
  {
    quote:
      "Sebagai HR di startup dengan tim kecil, kami tidak punya waktu untuk baca 200+ CV satu per satu. Dashboard RecruitAI langsung mengurutkan kandidat berdasarkan skor — proses shortlist yang biasanya 3 hari jadi 2 jam.",
    name: "Dinda Maharani",
    role: "HR Manager",
    company: "Inovasi Digital Nusantara",
    avatar: "DM",
    color: "#06b6d4",
    rating: 5,
    tag: "Rekruter",
  },
  {
    quote:
      "Rekomendasinya sangat spesifik — bukan cuma 'perbaiki summary' tapi langsung memberi contoh kalimat yang bisa dipakai. Dalam 3 hari revisi CV, skor match saya ke posisi Frontend Engineer naik signifikan.",
    name: "Fajar Nugroho",
    role: "Frontend Developer",
    company: "2 tahun pengalaman, aktif mencari kerja",
    avatar: "FN",
    color: "#8b5cf6",
    rating: 5,
    tag: "Kandidat",
  },
  {
    quote:
      "Fitur melihat CV asli kandidat langsung dari dashboard sangat membantu — tidak perlu buka tab baru atau download satu per satu. Kombinasi skor AI dan akses CV asli membuat keputusan shortlist jauh lebih percaya diri.",
    name: "Budi Santoso",
    role: "Talent Acquisition Lead",
    company: "GoTech Indonesia",
    avatar: "BS",
    color: "#f59e0b",
    rating: 5,
    tag: "Rekruter",
  },
  {
    quote:
      "Yang paling berguna adalah pencocokan lowongan otomatis setelah upload CV — skill saya langsung dicocokkan dan lowongan yang muncul benar-benar relevan. Tidak perlu filter manual lagi.",
    name: "Sari Wulandari",
    role: "UI/UX Designer",
    company: "Portfolio freelance, 3 tahun pengalaman",
    avatar: "SW",
    color: "#ec4899",
    rating: 5,
    tag: "Kandidat",
  },
  {
    quote:
      "Ranking kandidat berdasarkan skor langsung terurut otomatis. Tim kami bisa fokus ke kandidat terbaik saja dan tidak buang waktu untuk yang jelas tidak sesuai kualifikasi.",
    name: "Andika Pratama",
    role: "Head of People",
    company: "Fintek Maju",
    avatar: "AP",
    color: "#ef4444",
    rating: 5,
    tag: "Rekruter",
  },
];
