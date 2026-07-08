"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ListFilter, Check } from "lucide-react";
import type { StatusFilter } from "@/types/candidates";
import type { JobMeta } from "@/types/candidates";
import { CandidatesJobFilterDropdown } from "./CandidatesJobFilterDropdown";
import { STATUS_TABS } from "@/constants/candidates";

interface CandidatesFilterBarProps {
  jobMetas: JobMeta[];
  activeJob: string;
  totalCount: number;
  onSelectJob: (job: string) => void;
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  candidates: { job: string; status: string }[];
}

export function CandidatesFilterBar({
  jobMetas,
  activeJob,
  totalCount,
  onSelectJob,
  activeStatus,
  onStatusChange,
  candidates,
}: CandidatesFilterBarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const scope =
    activeJob === "all"
      ? candidates
      : candidates.filter((c) => c.job === activeJob);

  // FIX: sebelumnya `key === "all" ? scope.length : scope.filter(c =>
  // c.status === key)` — strict equality ke 1 key. Sekarang tiap tab bisa
  // mewakili lebih dari 1 status (mis. "In Review" = review + shortlisted),
  // jadi hitungnya lewat membership check ke `statuses[]`.
  const countFor = (statuses: string[]) =>
    statuses.length === 0
      ? scope.length
      : scope.filter((c) => statuses.includes(c.status)).length;

  const activeTab = STATUS_TABS.find((t) => t.key === activeStatus);
  const activeLabel = activeTab?.label ?? "Semua";
  const activeCount = countFor(activeTab?.statuses ?? []);

  return (
    <div
      className="flex items-center gap-3 px-6 py-[10px] bg-[#0d1510]"
      style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
      <CandidatesJobFilterDropdown
        jobMetas={jobMetas}
        activeJob={activeJob}
        totalCount={totalCount}
        onSelect={onSelectJob}
      />
      <div
        className="w-px self-stretch"
        style={{ background: "rgba(16,185,129,0.1)" }}
      />

      {/* Status filter — dropdown, bukan lagi row pill horizontal */}
      <div ref={ref} className="relative flex-shrink-0">
        <button
          type="button"
          title={`Filter status: ${activeLabel}`}
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-[5px] rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer"
          style={{
            background: "rgba(16,185,129,0.12)",
            color: "#10b981",
            border: "1px solid rgba(16,185,129,0.3)",
          }}>
          <ListFilter size={11} />
          {activeLabel}
          <span className="text-[10px] opacity-80">{activeCount}</span>
          <ChevronDown
            size={10}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.14 }}
              className="absolute left-0 top-full mt-2 z-[500] w-[220px] rounded-xl overflow-hidden py-1"
              style={{
                background: "#0d1510",
                border: "1px solid rgba(16,185,129,0.2)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}>
              {STATUS_TABS.map(({ key, label, statuses }) => {
                const isActive = activeStatus === key;
                const count = countFor(statuses);
                return (
                  <button
                    key={key}
                    type="button"
                    title={`Filter candidates by status: ${label}`}
                    onClick={() => {
                      onStatusChange(key);
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-[8px] text-[12px] font-semibold text-left transition-colors cursor-pointer hover:bg-[rgba(16,185,129,0.06)]"
                    style={{
                      background: isActive
                        ? "rgba(16,185,129,0.08)"
                        : "transparent",
                      color: isActive ? "#10b981" : "#7a9585",
                    }}>
                    <span className="flex items-center gap-2">
                      {label}
                      {isActive && <Check size={11} />}
                    </span>
                    <span
                      className="text-[10px] font-bold px-[6px] py-[2px] rounded-[4px]"
                      style={{
                        background: isActive
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(16,185,129,0.06)",
                        color: isActive ? "#10b981" : "#7a9585",
                      }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}