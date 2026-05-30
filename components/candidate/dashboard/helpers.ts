// app/dashboard/candidate/_components/helpers.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared pure helpers — tidak ada React, bisa di-import di server & client.
// ─────────────────────────────────────────────────────────────────────────────

// ── Match Score Calculator ────────────────────────────────────────────────────
export function calcMatchScore(
  candidateSkills: string[],
  jobSkills: string[],
): { score: number; matched: string[]; missing: string[] } {
  if (!jobSkills.length)
    return { score: 0, matched: [], missing: [] };

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const candidateNorm = candidateSkills.map(normalize);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of jobSkills) {
    const norm = normalize(skill);
    if (candidateNorm.some((c) => c.includes(norm) || norm.includes(c))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const score = Math.round((matched.length / jobSkills.length) * 100);
  return { score, matched, missing };
}

// ── Time Utilities ────────────────────────────────────────────────────────────
export function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Status Map ────────────────────────────────────────────────────────────────
export const statusMap: Record<string, { label: string; color: string }> = {
  applied: { label: "Dikirim", color: "#06b6d4" },
  review: { label: "In Review", color: "#f59e0b" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

// ── Color Palette ─────────────────────────────────────────────────────────────
export const CARD_COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export function getCardColor(index: number): string {
  return CARD_COLORS[index % CARD_COLORS.length];
}

// ── Locale Constants ──────────────────────────────────────────────────────────
export const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
export const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
