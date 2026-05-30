// @/components/hr/candidates/CandidatesSkeleton.tsx
// Semua skeleton UI dalam SATU file — dipakai di Suspense boundaries

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// BASE SHIMMER
// ─────────────────────────────────────────────────────────────────────────────
function Shimmer({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[6px] ${className ?? ""}`}
      style={{ background: "rgba(16,185,129,0.06)", ...style }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.08) 50%, transparent 100%)",
          animation: "shimmer 1.6s infinite",
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENING CARD SKELETON — dipakai di OpeningsSection
// ─────────────────────────────────────────────────────────────────────────────
export function OpeningCardSkeleton() {
  return (
    <div
      className="rounded-[14px] p-4 flex flex-col gap-3 flex-shrink-0 w-[200px]"
      style={{
        background: "#0f1612",
        border: "1px solid rgba(16,185,129,0.08)",
      }}>
      {/* Icon + days left */}
      <div className="flex items-center justify-between">
        <Shimmer className="w-9 h-9 rounded-[10px]" />
        <Shimmer className="w-14 h-[12px]" />
      </div>
      {/* Job title + location */}
      <div className="flex flex-col gap-[6px]">
        <Shimmer className="w-[130px] h-[14px]" />
        <Shimmer className="w-[80px] h-[12px]" />
      </div>
      {/* Count + badge */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-[4px]">
          <Shimmer className="w-10 h-[26px]" />
          <Shimmer className="w-16 h-[10px]" />
        </div>
        <Shimmer className="w-16 h-[22px] rounded-full" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENINGS SECTION SKELETON — untuk Suspense wrap OpeningsSection
// ─────────────────────────────────────────────────────────────────────────────
export function OpeningsSectionSkeleton() {
  return (
    <div
      className="flex-shrink-0 px-6 pt-5 pb-4"
      style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shimmer className="w-32 h-[18px]" />
          <Shimmer className="w-6 h-6 rounded-full" />
        </div>
        <Shimmer className="w-14 h-[14px]" />
      </div>
      {/* Cards */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <OpeningCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE ROW SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function TableRowSkeleton({ index }: { index: number }) {
  const opacity = 1 - index * 0.08;
  return (
    <tr
      style={{
        borderBottom: "1px solid rgba(16,185,129,0.06)",
        opacity,
      }}>
      {/* Checkbox */}
      <td className="px-4 py-[14px] w-10">
        <Shimmer className="w-4 h-4 rounded-[3px]" />
      </td>
      {/* Applied Role */}
      <td className="px-4 py-[14px]">
        <Shimmer className="w-28 h-[13px]" />
      </td>
      {/* Location */}
      <td className="px-4 py-[14px]">
        <Shimmer className="w-16 h-[12px]" />
      </td>
      {/* Candidate */}
      <td className="px-4 py-[14px]">
        <div className="flex items-center gap-3">
          <Shimmer className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-[5px]">
            <Shimmer className="w-28 h-[13px]" />
            <Shimmer className="w-36 h-[11px]" />
          </div>
        </div>
      </td>
      {/* Contact */}
      <td className="px-4 py-[14px]">
        <Shimmer className="w-28 h-[12px]" />
      </td>
      {/* Applied Date */}
      <td className="px-4 py-[14px]">
        <Shimmer className="w-20 h-[12px]" />
      </td>
      {/* Stage */}
      <td className="px-4 py-[14px]">
        <Shimmer className="w-16 h-[22px] rounded-[6px]" />
      </td>
      {/* AI Score */}
      <td className="px-4 py-[14px]">
        <div className="flex items-center gap-2">
          <Shimmer className="w-12 h-[4px] rounded-full" />
          <Shimmer className="w-6 h-[14px]" />
        </div>
      </td>
      {/* Actions */}
      <td className="px-4 py-[14px] w-10">
        <Shimmer className="w-7 h-7 rounded-[7px]" />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE FILTER BAR SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function TableFilterBarSkeleton() {
  return (
    <div
      className="flex items-center gap-3 px-6 py-[10px] flex-shrink-0"
      style={{
        background: "#0d1510",
        borderBottom: "1px solid rgba(16,185,129,0.08)",
      }}>
      {/* Job dropdown */}
      <Shimmer className="w-32 h-[28px] rounded-full" />
      {/* Divider */}
      <div
        className="w-px self-stretch"
        style={{ background: "rgba(16,185,129,0.1)" }}
      />
      {/* Status pills */}
      <div className="flex items-center gap-1">
        {[60, 52, 68, 56, 48].map((w, i) => (
          <Shimmer
            key={i}
            className="h-[26px] rounded-full"
            style={{ width: w }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE HEADER BAR SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function TableHeaderBarSkeleton() {
  return (
    <div
      className="flex items-center justify-between gap-3 px-6 py-3 flex-shrink-0"
      style={{
        background: "#0f1612",
        borderBottom: "1px solid rgba(16,185,129,0.1)",
      }}>
      <Shimmer className="w-24 h-[18px]" />
      <div className="flex items-center gap-2">
        <Shimmer className="w-[200px] h-[32px] rounded-[9px]" />
        <Shimmer className="w-[72px] h-[32px] rounded-[9px]" />
        <Shimmer className="w-[120px] h-[32px] rounded-[9px]" />
        <Shimmer className="w-[120px] h-[32px] rounded-[9px]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION FOOTER SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function PaginationSkeleton() {
  return (
    <div
      className="flex items-center justify-between px-6 py-3 flex-shrink-0"
      style={{
        background: "#0f1612",
        borderTop: "1px solid rgba(16,185,129,0.1)",
      }}>
      <Shimmer className="w-48 h-[14px]" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Shimmer key={i} className="w-7 h-7 rounded-[7px]" />
          ))}
        </div>
        <Shimmer className="w-24 h-[14px]" />
        <Shimmer className="w-12 h-[30px] rounded-[7px]" />
        <Shimmer className="w-14 h-[30px] rounded-[7px]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL TABLE SECTION SKELETON — untuk Suspense wrap CandidatesTable
// ─────────────────────────────────────────────────────────────────────────────
export function CandidatesTableSkeleton() {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <TableHeaderBarSkeleton />
      <TableFilterBarSkeleton />

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr
              style={{
                background: "#0d1510",
                borderBottom: "1px solid rgba(16,185,129,0.1)",
              }}>
              {[
                "w-10",
                "w-32",
                "w-24",
                "w-48",
                "w-36",
                "w-28",
                "w-24",
                "w-28",
                "w-10",
              ].map((w, i) => (
                <th key={i} className={`px-4 py-[11px] ${w}`}>
                  <Shimmer className="h-[10px] w-full max-w-[80px]" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRowSkeleton key={i} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationSkeleton />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL PAGE SKELETON — untuk initial page load (SSR shell)
// ─────────────────────────────────────────────────────────────────────────────
export function CandidatesPageSkeleton() {
  return (
    <div
      className="flex flex-col h-[calc(100vh-72px)] overflow-hidden"
      style={{ background: "#0a100d" }}>
      <OpeningsSectionSkeleton />
      <CandidatesTableSkeleton />
    </div>
  );
}
