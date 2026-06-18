// constants/profileShell.constants.ts
// ─────────────────────────────────────────────
// Semua konstanta untuk ProfileShell
// ─────────────────────────────────────────────

import { User, Shield, Building2 } from "lucide-react";
import { Tab, TabDefinition } from "@/types/main/profile";

// ── Tab Definitions ────────────────────────────────────────────────────────
export const CANDIDATE_TABS: TabDefinition[] = [
  { id: "profile" as Tab, label: "Profil", icon: User },
  { id: "security" as Tab, label: "Keamanan", icon: Shield },
];

export const HR_TABS: TabDefinition[] = [
  { id: "profile" as Tab, label: "Profil Akun", icon: User },
  { id: "company" as Tab, label: "Profil Perusahaan", icon: Building2 },
  { id: "security" as Tab, label: "Keamanan", icon: Shield },
];

// ── Animation Variants ─────────────────────────────────────────────────────
export const FADE_IN_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const TAB_TRANSITION = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ── Layout Constants ───────────────────────────────────────────────────────
export const MAX_WIDTH = "max-w-[920px]";
export const SIDEBAR_WIDTH = "280px";

// ── Color Tokens (CSS class references) ───────────────────────────────────
export const COLORS = {
  bg: "#0a0f0d",
  card: "#0f1612",
  border: "emerald-500/15",
  textMuted: "#7a9585",
  textPrimary: "#e8f0ec",
  textLabel: "#4d6b5a",
  accent: "emerald-400",
} as const;
