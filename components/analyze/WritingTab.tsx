"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import type { WritingSuggestion } from "./analyze";

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

// ─── WRITING TAB ─────────────────────────────────────────────────────────────
type Props = { suggestions: WritingSuggestion[] | undefined };

export default function WritingTab({ suggestions }: Props) {
  const [active, setActive] = useState("All");

  if (!suggestions || suggestions.length === 0) {
    return <EmptyTabState message="Data saran penulisan tidak tersedia untuk analisis ini." />;
  }

  const sections = ["All", ...Array.from(new Set(suggestions.map((s) => s.section)))];
  const visible = active === "All" ? suggestions : suggestions.filter((s) => s.section === active);

  return (
    <div>
      <div
        className="flex items-start gap-3 p-4 rounded-[12px] mb-5"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <Sparkles size={14} className="flex-shrink-0 mt-[1px]" style={{ color: "rgba(255,255,255,0.35)" }} />
        <p className="text-[12px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.38)" }}>
          AI menulis ulang kalimat-kalimat lemah di CV kamu menjadi versi yang lebih kuat,
          spesifik, dan berorientasi hasil. Salin dan sesuaikan dengan konteks kamu.
        </p>
      </div>

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

      <div className="space-y-[10px]">
        {visible.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-[12px] overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div
              className="px-4 py-[8px] flex items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
              <span
                className="text-[10px] font-bold uppercase tracking-wide px-[6px] py-[2px] rounded-[4px]"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                {s.section}
              </span>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <div
                  className="text-[9.5px] font-bold uppercase tracking-widest mb-[6px]"
                  style={{ color: "rgba(248,113,113,0.5)" }}>
                  Sebelum
                </div>
                <div
                  className="text-[12.5px] leading-[1.6] px-3 py-[8px] rounded-[7px]"
                  style={{
                    background: "rgba(248,113,113,0.04)",
                    border: "1px solid rgba(248,113,113,0.1)",
                    color: "rgba(255,255,255,0.45)",
                  }}>
                  {s.original}
                </div>
              </div>
              <div className="flex justify-center mb-3">
                <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.15)" }} />
              </div>
              <div className="mb-3">
                <div
                  className="text-[9.5px] font-bold uppercase tracking-widest mb-[6px]"
                  style={{ color: "rgba(74,222,128,0.5)" }}>
                  Versi diperkuat
                </div>
                <div
                  className="text-[12.5px] leading-[1.6] px-3 py-[8px] rounded-[7px]"
                  style={{
                    background: "rgba(74,222,128,0.04)",
                    border: "1px solid rgba(74,222,128,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}>
                  {s.improved}
                </div>
              </div>
              <div
                className="text-[11.5px] leading-[1.6] pt-[10px]"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.28)",
                }}>
                {s.reason}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
