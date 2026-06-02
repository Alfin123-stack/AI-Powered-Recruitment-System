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
// TOKENS — selaras JobCard
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  card: "#0f1612",
  cardBorder: "rgba(16,185,129,0.15)",
  cardBorderHover: "rgba(16,185,129,0.30)",
  inputBg: "#0b1210",
  dropdownBg: "#0f1612",
  dropdownBorder: "rgba(255,255,255,0.08)",
  filterPanelBg: "#0d1410",
  divider: "rgba(255,255,255,0.06)",
  btnBg: "rgba(255,255,255,0.03)",
  btnBorder: "rgba(16,185,129,0.12)",

  emerald: "#10b981",
  amber: "#f59e0b",
  cyan: "#06b6d4",

  textPrimary: "#e8f0ec",
  textSecondary: "#7a9585",
  textLabel: "#5a8070",
  textDim: "#3d5a45",
  textMuted: "rgba(122,149,133,0.55)",
};

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
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = T.textPrimary;
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            T.cardBorderHover;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = T.textSecondary;
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            T.btnBorder;
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 8,
          background: T.btnBg,
          border: `1px solid ${T.btnBorder}`,
          color: T.textSecondary,
          fontSize: "0.77rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}>
        <ArrowUpDown size={12} />
        Sort
        <ChevronDown
          size={11}
          style={{
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 4px)",
              width: 250,
              background: T.dropdownBg,
              border: `1px solid ${T.dropdownBorder}`,
              borderRadius: 11,
              boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              zIndex: 300,
              padding: 4,
            }}>
            {options.map((opt, i) => {
              const isDivider = i === 2 || i === 4;
              const isSelected = value === opt.value;
              return (
                <div key={opt.value}>
                  {isDivider && (
                    <div
                      style={{
                        height: 1,
                        background: T.divider,
                        margin: "2px 0",
                      }}
                    />
                  )}
                  <button
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = isSelected
                          ? "rgba(16,185,129,0.07)"
                          : "transparent";
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 7,
                      fontSize: "0.77rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.12s",
                      background: isSelected
                        ? "rgba(16,185,129,0.07)"
                        : "transparent",
                      border: "none",
                      color: isSelected ? T.emerald : T.textSecondary,
                    }}>
                    <span style={{ opacity: 0.6 }}>{opt.icon}</span>
                    {opt.label}
                    {isSelected && (
                      <Check size={11} style={{ marginLeft: "auto" }} />
                    )}
                  </button>
                </div>
              );
            })}
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

  const optionStyle = (selected: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    borderRadius: 7,
    fontSize: "0.77rem",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.12s",
    width: "100%",
    background: selected ? "rgba(16,185,129,0.08)" : "transparent",
    border: selected
      ? "1px solid rgba(16,185,129,0.22)"
      : "1px solid transparent",
    color: selected ? T.emerald : T.textSecondary,
  });

  const typeStyle = (selected: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "7px 6px",
    borderRadius: 7,
    fontSize: "0.74rem",
    fontWeight: 600,
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.12s",
    background: selected ? "rgba(16,185,129,0.08)" : T.btnBg,
    border: selected
      ? "1px solid rgba(16,185,129,0.22)"
      : `1px solid rgba(255,255,255,0.06)`,
    color: selected ? T.emerald : T.textSecondary,
  });

  const sectionLabel: React.CSSProperties = {
    display: "block",
    fontSize: "0.63rem",
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: T.textLabel,
    marginBottom: 8,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "64px 16px 16px",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
      }}>
      <div style={{ position: "absolute", inset: 0 }} onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        style={{
          position: "relative",
          background: T.filterPanelBg,
          border: `1px solid ${T.cardBorder}`,
          borderRadius: 14,
          width: 276,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}>
        {/* top accent line */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${T.emerald}40, transparent)`,
          }}
        />

        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: `1px solid ${T.divider}`,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={13} color={T.emerald} />
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: T.textPrimary,
              }}>
              Filter
            </span>
            {activeCount > 0 && (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: "rgba(16,185,129,0.12)",
                  color: T.emerald,
                  fontSize: "0.63rem",
                  fontWeight: 700,
                }}>
                {activeCount}
              </span>
            )}
          </div>
          <button
            title="Tutup"
            onClick={onClose}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                T.textPrimary)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = T.textLabel)
            }
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: T.btnBg,
              border: `1px solid rgba(255,255,255,0.07)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.textLabel,
              cursor: "pointer",
              transition: "all 0.12s",
            }}>
            <X size={11} />
          </button>
        </div>

        {/* body */}
        <div
          style={{
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
          {/* Round */}
          <div>
            <label style={sectionLabel}>Round</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {["", ...rounds].map((r) => (
                <button
                  key={r || "all"}
                  onClick={() => setLocal((p) => ({ ...p, round: r }))}
                  style={optionStyle(local.round === r)}>
                  {r || "Semua Round"}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: T.divider }} />

          {/* Type */}
          <div>
            <label style={sectionLabel}>Tipe</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { val: "", label: "Semua" },
                { val: "online", label: "Online" },
                { val: "onsite", label: "Onsite" },
              ].map(({ val, label }) => (
                <button
                  key={val || "all"}
                  onClick={() => setLocal((p) => ({ ...p, type: val }))}
                  style={typeStyle(local.type === val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Interviewer */}
          {interviewers.length > 0 && (
            <>
              <div style={{ height: 1, background: T.divider }} />
              <div>
                <label style={sectionLabel}>Interviewer</label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {["", ...interviewers].map((iv) => (
                    <button
                      key={iv || "all"}
                      onClick={() =>
                        setLocal((p) => ({ ...p, interviewer: iv }))
                      }
                      style={optionStyle(local.interviewer === iv)}>
                      {iv || "Semua Interviewer"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* footer */}
        <div style={{ display: "flex", gap: 8, padding: "0 14px 14px" }}>
          <button
            onClick={reset}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                T.textPrimary;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                T.textSecondary;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.08)";
            }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              background: T.btnBg,
              color: T.textSecondary,
              fontSize: "0.77rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.12s",
            }}>
            Reset
          </button>
          <button
            onClick={apply}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#34d399")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                T.emerald)
            }
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 8,
              background: T.emerald,
              border: "none",
              color: "#07100a",
              fontSize: "0.77rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.12s",
            }}>
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}>
        {/* ── Tab pills — gaya JobCard border ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: 11,
            padding: 4,
          }}>
          {tabs.map(({ key, label, count }) => {
            const isActive = filter === key;
            const isOverdue = key === "overdue" && count > 0 && !isActive;
            return (
              <button
                key={key}
                onClick={() => onFilterChange(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 11px",
                  borderRadius: 8,
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  background: isActive
                    ? "rgba(16,185,129,0.10)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(16,185,129,0.25)"
                    : "1px solid transparent",
                  color: isActive ? T.emerald : T.textSecondary,
                }}>
                {label}
                <span
                  style={{
                    fontSize: "0.63rem",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 4,
                    background: isActive
                      ? "rgba(16,185,129,0.18)"
                      : isOverdue
                        ? "rgba(245,158,11,0.12)"
                        : "rgba(255,255,255,0.05)",
                    color: isActive
                      ? T.emerald
                      : isOverdue
                        ? T.amber
                        : T.textLabel,
                  }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Right controls ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* Search — gaya JobCard input */}
          <div style={{ position: "relative" }}>
            <Search
              size={12}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: T.textLabel,
                pointerEvents: "none",
              }}
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor =
                  "rgba(16,185,129,0.28)";
                (e.target as HTMLInputElement).style.boxShadow =
                  "0 0 0 3px rgba(16,185,129,0.06)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = T.btnBorder;
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }}
              style={{
                width: 196,
                background: T.btnBg,
                border: `1px solid ${T.btnBorder}`,
                borderRadius: 8,
                padding: "7px 12px 7px 30px",
                fontSize: "0.78rem",
                color: T.textPrimary,
                outline: "none",
                transition: "all 0.15s",
              }}
            />
          </div>

          {/* Sort */}
          <SortDropdown value={sort} onChange={onSortChange} />

          {/* Filter button — gaya JobCard icon buttons */}
          <button
            onClick={() => setShowFilterPanel(true)}
            onMouseEnter={(e) => {
              if (!advFilterCount) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  T.textPrimary;
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  T.cardBorderHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!advFilterCount) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  T.textSecondary;
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  T.btnBorder;
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              borderRadius: 8,
              fontSize: "0.77rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              background:
                advFilterCount > 0 ? "rgba(16,185,129,0.08)" : T.btnBg,
              border:
                advFilterCount > 0
                  ? "1px solid rgba(16,185,129,0.22)"
                  : `1px solid ${T.btnBorder}`,
              color: advFilterCount > 0 ? T.emerald : T.textSecondary,
            }}>
            <Filter size={12} />
            Filter
            {advFilterCount > 0 && (
              <span
                style={{
                  padding: "1px 5px",
                  borderRadius: 4,
                  background: "rgba(16,185,129,0.18)",
                  color: T.emerald,
                  fontSize: "0.63rem",
                  fontWeight: 700,
                }}>
                {advFilterCount}
              </span>
            )}
          </button>

          {/* Create — JobCard style CTA */}
          <button
            onClick={onCreateClick}
            disabled={shortlistedCount === 0}
            onMouseEnter={(e) => {
              if (shortlistedCount > 0)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#34d399";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                T.emerald;
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 15px",
              borderRadius: 8,
              background: T.emerald,
              border: "none",
              color: "#07100a",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: shortlistedCount === 0 ? "not-allowed" : "pointer",
              opacity: shortlistedCount === 0 ? 0.4 : 1,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}>
            <Plus size={13} />
            Create Interview
          </button>
        </div>
      </div>
    </>
  );
}
