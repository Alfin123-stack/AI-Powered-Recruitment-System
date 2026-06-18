"use client";

import { motion } from "framer-motion";
import { BarChart3, ShieldCheck, Layers, Pencil } from "lucide-react";
import type { Tab } from "@/types/main/analyze";

// ─── TAB BAR ─────────────────────────────────────────────────────────────────
type Props = {
  active: Tab;
  onChange: (t: Tab) => void;
};

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart3 size={12} /> },
  { id: "ats", label: "ATS Check", icon: <ShieldCheck size={12} /> },
  { id: "feedback", label: "Feedback", icon: <Layers size={12} /> },
  { id: "writing", label: "Saran Penulisan", icon: <Pencil size={12} /> },
];

export default function TabBar({ active, onChange }: Props) {
  return (
    <div
      className="flex gap-[3px] mb-5 border-b"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex items-center gap-[6px] px-[14px] py-[9px] text-[12px] font-medium transition-all relative"
          style={{
            color:
              active === t.id
                ? "rgba(255,255,255,0.85)"
                : "rgba(255,255,255,0.28)",
          }}>
          {t.icon}
          {t.label}
          {active === t.id && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] rounded-full"
              style={{ background: "rgba(255,255,255,0.5)" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
