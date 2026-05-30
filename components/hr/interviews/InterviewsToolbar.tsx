"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ChevronDown,
  SortAsc,
  SortDesc,
  Check,
  X,
} from "lucide-react";
import { FilterStatus, SortOption, AdvancedFilters, Interview } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SORT DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const options: { value: SortOption; label: string; icon: React.ReactNode }[] =
    [
      {
        value: "date_asc",
        label: "Tanggal Interview (lama → baru)",
        icon: <SortAsc size={11} />,
      },
      {
        value: "date_desc",
        label: "Tanggal Interview (baru → lama)",
        icon: <SortDesc size={11} />,
      },
      { value: "name_asc", label: "Nama (A → Z)", icon: <SortAsc size={11} /> },
      {
        value: "name_desc",
        label: "Nama (Z → A)",
        icon: <SortDesc size={11} />,
      },
      {
        value: "created_asc",
        label: "Dibuat (lama → baru)",
        icon: <SortAsc size={11} />,
      },
      {
        value: "created_desc",
        label: "Dibuat (baru → lama)",
        icon: <SortDesc size={11} />,
      },
    ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[6px] px-3 py-[7px] rounded-[9px] bg-[#0d1810] border border-emerald-500/12 text-[#5a8070] text-[0.78rem] hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
        <ArrowUpDown size={12} />
        Sort
        <ChevronDown
          size={11}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-[240px] bg-[#0d1810] border border-emerald-500/20 rounded-[10px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-[300] py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-[8px] text-[0.78rem] text-left cursor-pointer transition-colors ${
                  value === opt.value
                    ? "text-emerald-400 bg-emerald-500/[0.06]"
                    : "text-[#6a9080] hover:bg-emerald-500/[0.04] hover:text-[#c5d9cc]"
                }`}>
                <span className="opacity-60">{opt.icon}</span>
                {opt.label}
                {value === opt.value && <Check size={11} className="ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER PANEL
// ─────────────────────────────────────────────────────────────────────────────
function FilterPanel({
  interviews,
  filters,
  onChange,
  onClose,
}: {
  interviews: Interview[];
  filters: AdvancedFilters;
  onChange: (f: AdvancedFilters) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(filters);

  const rounds = Array.from(
    new Set(interviews.map((iv) => iv.round).filter(Boolean)),
  ) as string[];
  const interviewers = Array.from(
    new Set(interviews.map((iv) => iv.interviewer_name).filter(Boolean)),
  ) as string[];

  const apply = () => {
    onChange(local);
    onClose();
  };
  const reset = () => {
    const empty = { round: "", type: "", interviewer: "" };
    setLocal(empty);
    onChange(empty);
    onClose();
  };

  const activeCount = Object.values(local).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-end p-4 pt-16 bg-black/40 backdrop-blur-[2px]">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="relative bg-[#0a100c] border border-emerald-500/20 rounded-[16px] w-[280px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-500/10">
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-emerald-400" />
            <span className="text-[0.82rem] font-bold text-[#e8f0ec]">
              Filter
            </span>
            {activeCount > 0 && (
              <span className="px-[6px] py-[1px] rounded-[4px] bg-emerald-500/15 text-emerald-400 text-[0.65rem] font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <button
          title="close"
            onClick={onClose}
            className="w-6 h-6 rounded-[6px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] transition-all cursor-pointer">
            <X size={11} />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {/* Round */}
          <div>
            <label className="text-[0.67rem] font-bold text-[#5a8070] uppercase tracking-[0.08em] mb-2 block">
              Round
            </label>
            <div className="flex flex-col gap-1">
              {["", ...rounds].map((r) => (
                <button
                  key={r || "all"}
                  onClick={() => setLocal((p) => ({ ...p, round: r }))}
                  className={`flex items-center gap-2 px-3 py-[7px] rounded-[8px] text-[0.78rem] text-left cursor-pointer transition-all ${
                    local.round === r
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "text-[#6a9080] hover:text-[#c5d9cc] hover:bg-emerald-500/[0.04]"
                  }`}>
                  {r || "Semua Round"}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-[0.67rem] font-bold text-[#5a8070] uppercase tracking-[0.08em] mb-2 block">
              Tipe
            </label>
            <div className="flex gap-2">
              {[
                { val: "", label: "Semua" },
                { val: "online", label: "Online" },
                { val: "onsite", label: "Onsite" },
              ].map(({ val, label }) => (
                <button
                  key={val || "all"}
                  onClick={() => setLocal((p) => ({ ...p, type: val }))}
                  className={`flex-1 py-[7px] rounded-[8px] text-[0.75rem] font-medium cursor-pointer transition-all ${
                    local.type === val
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-[#080f0b] border border-emerald-500/10 text-[#5a8070] hover:text-[#c5d9cc]"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Interviewer */}
          {interviewers.length > 0 && (
            <div>
              <label className="text-[0.67rem] font-bold text-[#5a8070] uppercase tracking-[0.08em] mb-2 block">
                Interviewer
              </label>
              <div className="flex flex-col gap-1">
                {["", ...interviewers].map((iv) => (
                  <button
                    key={iv || "all"}
                    onClick={() => setLocal((p) => ({ ...p, interviewer: iv }))}
                    className={`flex items-center gap-2 px-3 py-[7px] rounded-[8px] text-[0.78rem] text-left cursor-pointer transition-all ${
                      local.interviewer === iv
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "text-[#6a9080] hover:text-[#c5d9cc] hover:bg-emerald-500/[0.04]"
                    }`}>
                    {iv || "Semua Interviewer"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={reset}
            className="flex-1 py-[8px] rounded-[9px] border border-emerald-500/15 text-[#5a8070] text-[0.78rem] font-medium hover:text-[#e8f0ec] hover:border-emerald-500/30 transition-all cursor-pointer">
            Reset
          </button>
          <button
            onClick={apply}
            className="flex-1 py-[8px] rounded-[9px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.78rem] font-bold transition-all cursor-pointer">
            Terapkan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEWS TOOLBAR — main export
// ─────────────────────────────────────────────────────────────────────────────
export type InterviewsToolbarProps = {
  interviews: Interview[];
  filter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
  search: string;
  onSearchChange: (s: string) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  advFilters: AdvancedFilters;
  onAdvFiltersChange: (f: AdvancedFilters) => void;
  scheduledCount: number;
  doneCount: number;
  overdueCount: number;
  totalCount: number;
  shortlistedCount: number;
  onCreateClick: () => void;
};

export default function InterviewsToolbar({
  interviews,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  advFilters,
  onAdvFiltersChange,
  scheduledCount,
  doneCount,
  overdueCount,
  totalCount,
  shortlistedCount,
  onCreateClick,
}: InterviewsToolbarProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const advFilterCount = Object.values(advFilters).filter(Boolean).length;

  const tabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: "scheduled", label: "Scheduled", count: scheduledCount },
    { key: "all", label: "All", count: totalCount },
    { key: "done", label: "Completed", count: doneCount },
    { key: "overdue", label: "Overdue", count: overdueCount },
  ];

  return (
    <>
      <AnimatePresence>
        {showFilterPanel && (
          <FilterPanel
            interviews={interviews}
            filters={advFilters}
            onChange={onAdvFiltersChange}
            onClose={() => setShowFilterPanel(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        {/* Tab pills */}
        <div className="flex items-center gap-1 bg-[#0d1810] border border-emerald-500/12 rounded-[11px] p-1">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`flex items-center gap-[6px] px-3 py-[6px] rounded-[8px] text-[0.77rem] font-medium cursor-pointer transition-all whitespace-nowrap ${
                filter === key
                  ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/25"
                  : "bg-transparent text-[#5a8070] hover:text-[#c5d9cc]"
              }`}>
              {label}
              <span
                className={`text-[0.65rem] font-bold px-[6px] py-[1px] rounded-[4px] ${
                  filter === key
                    ? "bg-emerald-500/20 text-emerald-400"
                    : key === "overdue" && count > 0
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-emerald-500/[0.06] text-[#4d7060]"
                }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d7060]"
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-[200px] bg-[#0d1810] border border-emerald-500/12 rounded-[9px] pl-8 pr-3 py-[7px] text-[0.8rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <SortDropdown value={sort} onChange={onSortChange} />

          <button
            onClick={() => setShowFilterPanel(true)}
            className={`flex items-center gap-[6px] px-3 py-[7px] rounded-[9px] border text-[0.78rem] cursor-pointer transition-all ${
              advFilterCount > 0
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-[#0d1810] border-emerald-500/12 text-[#5a8070] hover:text-[#e8f0ec] hover:border-emerald-500/25"
            }`}>
            <Filter size={12} />
            Filter
            {advFilterCount > 0 && (
              <span className="px-[5px] py-[1px] rounded-[4px] bg-emerald-500/20 text-emerald-400 text-[0.65rem] font-bold">
                {advFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={onCreateClick}
            disabled={shortlistedCount === 0}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.82rem] px-4 py-[8px] rounded-[9px] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer">
            <Plus size={14} /> Create Interview
          </button>
        </div>
      </div>
    </>
  );
}
