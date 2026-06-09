// @/components/hr/analytics/shared.ts
// Shared theme tokens, color palette, types — dipakai oleh semua komponen analytics

export const T = {
  bg: "#07100a",
  card: "#0b1410",
  cardBorder: "rgba(16,185,129,0.13)",
  cardBorderHover: "rgba(16,185,129,0.32)",
  emerald: "#10b981",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  orange: "#f97316",
  textPrimary: "#e8f5ee",
  textSecondary: "#7a9585",
  textMuted: "rgba(122,149,133,0.55)",
  gridLine: "rgba(16,185,129,0.07)",
  tick: { fill: "#7a9585", fontSize: 10.5, fontWeight: 600 } as const,
} as const;

export const PALETTE = [
  T.emerald,
  T.cyan,
  T.violet,
  T.amber,
  T.rose,
  T.orange,
  "#34d399",
  "#a78bfa",
] as const;
