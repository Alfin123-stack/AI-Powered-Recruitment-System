"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { LineFeedback } from "./analyze";

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyTabState({ message }: { message: string }) {
  return (
    <div
      className="rounded-[12px] p-8 text-center"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
      <p className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>
        {message}
      </p>
    </div>
  );
}

// ─── FEEDBACK TAB ─────────────────────────────────────────────────────────────
type Props = { feedback: LineFeedback[] | undefined };

type ItemStyle = {
  border: string;
  bg: string;
  icon: React.ReactNode;
  badge: { bg: string; color: string; label: string };
};

function itemStyle(type: LineFeedback["type"]): ItemStyle {
  return {
    good: {
      border: "rgba(74,222,128,0.1)",
      bg: "rgba(74,222,128,0.03)",
      icon: (
        <CheckCircle2
          size={13}
          className="flex-shrink-0 mt-[2px]"
          style={{ color: "rgba(74,222,128,0.65)" }}
        />
      ),
      badge: {
        bg: "rgba(74,222,128,0.08)",
        color: "rgba(74,222,128,0.75)",
        label: "Sudah bagus",
      },
    },
    warn: {
      border: "rgba(245,158,11,0.1)",
      bg: "rgba(245,158,11,0.03)",
      icon: (
        <AlertTriangle
          size={13}
          className="flex-shrink-0 mt-[2px]"
          style={{ color: "rgba(245,158,11,0.65)" }}
        />
      ),
      badge: {
        bg: "rgba(245,158,11,0.08)",
        color: "rgba(245,158,11,0.75)",
        label: "Bisa diperkuat",
      },
    },
    bad: {
      border: "rgba(248,113,113,0.1)",
      bg: "rgba(248,113,113,0.03)",
      icon: (
        <XCircle
          size={13}
          className="flex-shrink-0 mt-[2px]"
          style={{ color: "rgba(248,113,113,0.65)" }}
        />
      ),
      badge: {
        bg: "rgba(248,113,113,0.08)",
        color: "rgba(248,113,113,0.75)",
        label: "Kritis",
      },
    },
  }[type];
}

export default function FeedbackTab({ feedback }: Props) {
  const [active, setActive] = useState("All");

  if (!feedback || feedback.length === 0) {
    return (
      <EmptyTabState message="Data feedback tidak tersedia untuk analisis ini." />
    );
  }

  const sections = [
    "All",
    ...Array.from(new Set(feedback.map((f) => f.section))),
  ];
  const visible =
    active === "All" ? feedback : feedback.filter((f) => f.section === active);

  return (
    <div>
      <div className="flex gap-[5px] mb-5 flex-wrap">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className="text-[11.5px] px-[12px] py-[5px] rounded-full transition-all"
            style={
              active === s
                ? {
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }
                : {
                    background: "transparent",
                    color: "rgba(255,255,255,0.28)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }
            }>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-[7px]">
        {visible.map((f, i) => {
          const st = itemStyle(f.type);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.045 }}
              className="rounded-[10px] p-4"
              style={{ background: st.bg, border: `1px solid ${st.border}` }}>
              <div className="flex items-start gap-3">
                {st.icon}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-[6px] flex-wrap">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-[6px] py-[2px] rounded-[4px]"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.3)",
                      }}>
                      {f.section}
                    </span>
                    <span
                      className="text-[10px] font-bold px-[7px] py-[2px] rounded-full"
                      style={{
                        background: st.badge.bg,
                        color: st.badge.color,
                      }}>
                      {st.badge.label}
                    </span>
                  </div>
                  <div
                    className="text-[12.5px] font-medium mb-[5px] truncate"
                    style={{ color: "rgba(255,255,255,0.55)" }}>
                    "{f.line}"
                  </div>
                  <p
                    className="text-[12px] leading-[1.6]"
                    style={{ color: "rgba(255,255,255,0.32)" }}>
                    → {f.tip}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
