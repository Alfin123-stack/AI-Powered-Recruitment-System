"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Users } from "lucide-react";
import { JobMeta } from "@/types/candidates";

export function CandidatesJobFilterDropdown({
  jobMetas,
  activeJob,
  totalCount,
  onSelect,
}: {
  jobMetas: JobMeta[];
  activeJob: string;
  totalCount: number;
  onSelect: (job: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = jobMetas.filter((j) =>
    j.label.toLowerCase().includes(search.toLowerCase()),
  );
  const activeJobMeta = jobMetas.find((j) => j.key === activeJob);
  const activeColor = activeJobMeta?.color ?? "#10b981";
  const activeLabel =
    activeJob === "all"
      ? "All Positions"
      : (activeJobMeta?.label ?? "All Positions");
  const activeCount =
    activeJob === "all" ? totalCount : (activeJobMeta?.count ?? 0);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        title={`Filter position: ${activeLabel}`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-[5px] rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer"
        style={
          open
            ? {
                background:
                  activeJob === "all"
                    ? "rgba(16,185,129,0.15)"
                    : `${activeColor}18`,
                color: activeJob === "all" ? "#10b981" : activeColor,
                border: `1px solid ${activeJob === "all" ? "rgba(16,185,129,0.4)" : `${activeColor}50`}`,
              }
            : activeJob === "all"
              ? {
                  background: "#10b981",
                  color: "#0a100d",
                  border: "1px solid #10b981",
                }
              : {
                  background: `${activeColor}15`,
                  color: activeColor,
                  border: `1px solid ${activeColor}40`,
                }
        }>
        {activeJob !== "all" && (
          <span
            className="w-[5px] h-[5px] rounded-full flex-shrink-0"
            style={{ background: activeColor }}
          />
        )}
        {activeJob === "all" && <Users size={10} />}
        {activeLabel}
        <span className="text-[10px] opacity-70">{activeCount}</span>
        <ChevronDown
          size={10}
          className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full mt-2 z-[500] w-[260px] rounded-xl overflow-hidden"
            style={{
              background: "#0d1510",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            }}>
            <div
              className="p-2"
              style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-[9px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
                />
                <input
                  ref={inputRef}
                  type="search"
                  title="Search job position"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search position..."
                  className="w-full pl-7 pr-3 py-[6px] rounded-[8px] text-[12px] outline-none text-[#e8f0ec]"
                  style={{
                    background: "#141f19",
                    border: "1px solid rgba(16,185,129,0.15)",
                  }}
                />
              </div>
            </div>

            <div className="overflow-y-auto py-1 max-h-60">
              {search === "" && (
                <button
                  type="button"
                  title="Show all positions"
                  onClick={() => {
                    onSelect("all");
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-left transition-colors cursor-pointer hover:bg-[rgba(16,185,129,0.04)]"
                  style={{
                    background:
                      activeJob === "all"
                        ? "rgba(16,185,129,0.08)"
                        : "transparent",
                    color: activeJob === "all" ? "#10b981" : "#7a9585",
                  }}>
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-[#10b981]" />
                    All Positions
                  </div>
                  <span
                    className="text-[10px] font-bold px-[6px] py-[2px] rounded-[4px]"
                    style={{
                      background:
                        activeJob === "all"
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(16,185,129,0.06)",
                      color: activeJob === "all" ? "#10b981" : "#7a9585",
                    }}>
                    {totalCount}
                  </span>
                </button>
              )}
              {search === "" && jobMetas.length > 0 && (
                <div
                  className="mx-3 my-1 h-px"
                  style={{ background: "rgba(16,185,129,0.08)" }}
                />
              )}
              {filtered.length === 0 ? (
                <div className="px-3 py-5 text-center text-[12px] text-[#7a9585]">
                  Position not found
                </div>
              ) : (
                filtered.map((job) => (
                  <button
                    key={job.key}
                    type="button"
                    title={`Filter position: ${job.label}`}
                    onClick={() => {
                      onSelect(job.key);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-left transition-colors cursor-pointer"
                    style={{
                      background:
                        activeJob === job.key ? `${job.color}10` : "transparent",
                      color: activeJob === job.key ? job.color : "#7a9585",
                    }}
                    onMouseEnter={(e) => {
                      if (activeJob !== job.key)
                        e.currentTarget.style.background = `${job.color}08`;
                    }}
                    onMouseLeave={(e) => {
                      if (activeJob !== job.key)
                        e.currentTarget.style.background = "transparent";
                    }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                        style={{ background: job.color }}
                      />
                      <span className="truncate">{job.label}</span>
                    </div>
                    <span
                      className="text-[10px] font-bold px-[6px] py-[2px] rounded-[4px] flex-shrink-0 ml-2"
                      style={{
                        background:
                          activeJob === job.key
                            ? `${job.color}20`
                            : "rgba(16,185,129,0.06)",
                        color: activeJob === job.key ? job.color : "#7a9585",
                      }}>
                      {job.count}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
