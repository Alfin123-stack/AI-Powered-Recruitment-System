"use client";

import { T } from "@/constants/hr/analytics";

interface TooltipPayloadEntry {
  name: string;
  value: number | string;
  color?: string;
  fill?: string;
}

interface AnalyticsCustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

export function AnalyticsCustomTooltip({
  active,
  payload,
  label,
}: AnalyticsCustomTooltipProps) {
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
      {payload.map((p, i) => (
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
              background: p.color ?? p.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ color: T.textPrimary }}>
            {p.name}: <b style={{ color: p.color ?? p.fill }}>{p.value}</b>
          </span>
        </div>
      ))}
    </div>
  );
}
