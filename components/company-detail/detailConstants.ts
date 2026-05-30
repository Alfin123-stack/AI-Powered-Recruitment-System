// Constants khusus CompanyDetail — tidak ada directive "use client".
// Bisa diimport dari server maupun client component.

import type { Company, Job } from "./types";

export const TYPE_COLORS: Record<string, string> = {
  "Full-time": "#10b981",
  "Part-time": "#3b82f6",
  Contract: "#f59e0b",
  Freelance: "#8b5cf6",
  Internship: "#ec4899",
};

export const DEMO_COMPANY: Company = {
  id: "1",
  name: "AIRecruit",
  description:
    "Platform rekrutmen AI terdepan untuk perusahaan modern yang ingin hire lebih cepat dan akurat. Kami menggunakan machine learning untuk mencocokkan kandidat terbaik dengan posisi yang tersedia, memangkas waktu rekrutmen hingga 60% dibanding metode konvensional.",
  company_size: "51–200 karyawan",
  logo_url: null,
  location: "Jakarta",
  tags: ["AI", "SaaS", "B2B"],
  color: "#10b981",
  verified: true,
  website: "www.airecruit.id",
  openJobs: 3,
};

export const DEMO_JOBS: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Engineer",
    description: "Membangun antarmuka pengguna yang intuitif dan performa tinggi.",
    requirements: "5+ tahun pengalaman React, TypeScript, Next.js",
    salary: "Rp 15–25 jt/bln",
    location: "Jakarta / Remote",
    type: "Full-time",
    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
    benefits: ["Remote", "Laptop disediakan", "BPJS"],
    deadline: "2025-08-01",
    is_active: true,
    created_at: "2025-06-01T00:00:00",
    company_id: "1",
  },
  {
    id: "j2",
    title: "AI/ML Engineer",
    description: "Mengembangkan model scoring kandidat berbasis NLP dan CV parsing.",
    requirements: "Pengalaman PyTorch/TensorFlow, NLP, Python",
    salary: "Rp 20–35 jt/bln",
    location: "Jakarta",
    type: "Full-time",
    skills: ["Python", "PyTorch", "NLP", "FastAPI"],
    benefits: ["Bonus tahunan", "Asuransi kesehatan", "Saham"],
    deadline: "2025-07-15",
    is_active: true,
    created_at: "2025-05-28T00:00:00",
    company_id: "1",
  },
  {
    id: "j3",
    title: "Product Manager",
    description: "Memimpin roadmap produk rekrutmen AI untuk segmen enterprise.",
    requirements: "3+ tahun PM di B2B SaaS, pengalaman data-driven",
    salary: "Rp 18–28 jt/bln",
    location: "Jakarta",
    type: "Full-time",
    skills: ["Product Strategy", "Agile", "SQL", "Figma"],
    benefits: ["Equity", "Remote Jumat", "Makan siang"],
    deadline: null,
    is_active: true,
    created_at: "2025-05-20T00:00:00",
    company_id: "1",
  },
];
