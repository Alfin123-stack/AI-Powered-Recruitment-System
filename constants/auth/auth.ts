import { SecurityBadge } from "@/types/auth/auth";
import {
  Lock,
  ShieldCheck,
  DatabaseZap,
  BrainCircuit,
  Target,
  Zap,
} from "lucide-react";

export const DEFAULT_BADGES: SecurityBadge[] = [
  {
    icon: Lock,
    label: "SSL Encrypted",
    iconColor: "#0F6E56", // teal — enkripsi/keamanan koneksi
  },
  {
    icon: ShieldCheck,
    label: "PDPA Compliant",
    iconColor: "#185FA5", // biru — kepatuhan regulasi/legalitas
  },
  {
    icon: DatabaseZap,
    label: "Data Aman",
    iconColor: "#534AB7", // ungu — data/sistem
  },
];

export const FEATURES = [
  {
    icon: BrainCircuit,
    label: "Analisis CV berbasis AI dalam 30 detik",
    sub: "Ekstraksi skill, skor, dan rekomendasi otomatis",
  },
  {
    icon: Target,
    label: "Job matching otomatis sesuai profilmu",
    sub: "Cocokkan dengan ratusan lowongan relevan",
  },
  {
    icon: Zap,
    label: "Rekrutmen 10× lebih cepat untuk HR",
    sub: "Ranking kandidat, shortlist, dan update status",
  },
];

export const STATS = [
  { value: "5.000+", label: "CV Dianalisis" },
  { value: "200+", label: "Perusahaan" },
  { value: "98%", label: "Akurasi AI" },
];

export const STEP_META = [
  { title: "Informasi Dasar", sub: "Nama lengkap & alamat email" },
  { title: "Keamanan Akun", sub: "Buat password yang kuat" },
  { title: "Pilih Peran", sub: "Sebagai kandidat atau HR?" },
] as const;

export const TOTAL_STEPS = 3;
