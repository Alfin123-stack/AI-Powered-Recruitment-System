"use client";

// @/components/hr/analytics/ChartCard.tsx
// Wrapper card untuk semua chart + custom recharts tooltip

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { T } from "./shared";

// ─── Custom Recharts Tooltip ─────────────────────────────────────────────────
export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0b1812",
        border: "1px solid rgba(16,185,129,0.3)",
        borderRadius: 12,
        padding: "10px 14px",
        fontSize: "0.78rem",
        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
      }}>
      {label && (
        <div
          style={{
            color: T.textSecondary,
            marginBottom: 6,
            fontWeight: 700,
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
          {label}
        </div>
      )}
      {payload.map((p: any, i: number) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: i < payload.length - 1 ? 4 : 0,
          }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color || p.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ color: T.textPrimary }}>
            {p.name}:{" "}
            <b style={{ color: p.color || p.fill }}>{p.value}</b>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ h = 200 }: { h?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2"
      style={{ height: h }}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "rgba(16,185,129,0.08)" }}>
        <Inbox size={16} style={{ color: T.textSecondary }} />
      </div>
      <div className="text-[0.78rem]" style={{ color: T.textSecondary }}>
        Belum ada data
      </div>
    </div>
  );
}

// ─── Chart Card Wrapper ──────────────────────────────────────────────────────
export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  children,
  delay = 0,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[18px] p-5 ${className}`}
      style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{ background: iconBg, color: iconColor }}>
            <Icon size={13} />
          </div>
          <div>
            <div
              className="font-bold text-[0.88rem]"
              style={{ color: T.textPrimary }}>
              {title}
            </div>
            {subtitle && (
              <div
                className="text-[0.65rem]"
                style={{ color: T.textSecondary }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}
