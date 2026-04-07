import { Job } from "@/app/jobs/page";

export const DEMO_JOBS: Job[] = [
  {
    id: "0",
    title: "Frontend Developer",
    description:
      "Bergabunglah dengan tim engineering kami untuk membangun produk digital yang digunakan jutaan pengguna Indonesia.",
    salary: "Rp 8–15 jt/bln",
    location: "Jakarta / Remote",
    type: "Full-time",
    skills: ["React", "Next.js", "Tailwind"],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    companies: {
      name: "PT Teknologi Indonesia",
      logo_url: null,
      company_size: "200–500 karyawan",
    },
    color: "#10b981",
  },
  {
    id: "1",
    title: "Fullstack Developer",
    description:
      "Kami mencari engineer berpengalaman untuk membangun fitur-fitur baru pada platform SaaS B2B kami.",
    salary: "Rp 12–20 jt/bln",
    location: "Remote",
    type: "Full-time",
    skills: ["Node.js", "React", "PostgreSQL"],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    companies: {
      name: "Startup Digital Nusantara",
      logo_url: null,
      company_size: "50–100 karyawan",
    },
    color: "#06b6d4",
  },
  {
    id: "2",
    title: "Backend Engineer",
    description:
      "Kembangkan infrastruktur backend untuk platform pembayaran yang memproses jutaan transaksi per hari.",
    salary: "Rp 10–18 jt/bln",
    location: "Bandung / Hybrid",
    type: "Full-time",
    skills: ["Go", "PostgreSQL", "Docker"],
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    companies: {
      name: "Fintech Maju Bersama",
      logo_url: null,
      company_size: "200–500 karyawan",
    },
    color: "#8b5cf6",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    description:
      "Rancang pengalaman pengguna yang indah dan intuitif untuk klien-klien enterprise kami.",
    salary: "Rp 6–10 jt/bln",
    location: "Jakarta",
    type: "Contract",
    skills: ["Figma", "Prototyping", "Research"],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    companies: {
      name: "Creative Agency Jakarta",
      logo_url: null,
      company_size: "11–50 karyawan",
    },
    color: "#f59e0b",
  },
];

export const FILTERS = [
  "Semua",
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const statusConfig: Record<
  string,
  { text: string; color: string; bg: string; border: string }
> = {
  applied: {
    text: "Lamaran Terkirim",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
  review: {
    text: "Sedang Direview",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
  },
  shortlisted: {
    text: "Kamu Shortlisted!",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  rejected: {
    text: "Tidak Lolos",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
  },
};
