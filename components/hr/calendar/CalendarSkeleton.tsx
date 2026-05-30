// @/components/hr/calendar/CalendarSkeleton.tsx
// Semua skeleton UI untuk Calendar Page dalam satu file

function Pulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ background: "rgba(16,185,129,0.08)", ...style }}
    />
  );
}

// ─── Skeleton: Mini Calendar (sidebar) ───────────────────────────────────────
function MiniCalendarSkeleton() {
  return (
    <div
      className="rounded-[16px] p-4"
      style={{ background: "#0f1612", border: "1px solid rgba(16,185,129,0.1)" }}
    >
      {/* Header month nav */}
      <div className="flex items-center justify-between mb-3">
        <Pulse style={{ width: 16, height: 16, borderRadius: 8 }} />
        <Pulse style={{ width: 100, height: 14, borderRadius: 6 }} />
        <Pulse style={{ width: 16, height: 16, borderRadius: 8 }} />
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Pulse key={i} style={{ height: 10, borderRadius: 4 }} />
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-[2px]">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center h-[26px]">
            <Pulse style={{ width: 20, height: 20, borderRadius: 10 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton: Sidebar ────────────────────────────────────────────────────────
function SidebarSkeleton() {
  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{ width: 240, borderRight: "1px solid rgba(16,185,129,0.1)" }}
    >
      {/* Add Schedule btn */}
      <div className="px-4 pt-5 pb-4">
        <Pulse style={{ height: 36, borderRadius: 99 }} />
      </div>

      {/* Mini calendar */}
      <div className="px-4 pb-4">
        <MiniCalendarSkeleton />
      </div>

      {/* Bottom avatars */}
      <div className="mt-auto px-4 pb-5 flex items-center justify-between">
        <div className="flex">
          {Array.from({ length: 3 }).map((_, i) => (
            <Pulse
              key={i}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginLeft: i === 0 ? 0 : -8,
              }}
            />
          ))}
        </div>
        <Pulse style={{ width: 28, height: 28, borderRadius: 14 }} />
      </div>
    </div>
  );
}

// ─── Skeleton: Toolbar ────────────────────────────────────────────────────────
function ToolbarSkeleton() {
  return (
    <div
      className="flex items-center gap-3 px-5 py-[14px] flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}
    >
      <Pulse style={{ width: 160, height: 22, borderRadius: 8 }} />
      <Pulse style={{ width: 28, height: 28, borderRadius: 7 }} />
      <div className="flex items-center gap-1">
        <Pulse style={{ width: 28, height: 28, borderRadius: 14 }} />
        <Pulse style={{ width: 60, height: 26, borderRadius: 13 }} />
        <Pulse style={{ width: 28, height: 28, borderRadius: 14 }} />
      </div>
      <div className="flex-1" />
      <Pulse style={{ width: 160, height: 32, borderRadius: 99 }} />
      <Pulse style={{ width: 170, height: 32, borderRadius: 99 }} />
      <Pulse style={{ width: 32, height: 32, borderRadius: 16 }} />
    </div>
  );
}

// ─── Skeleton: Week View ──────────────────────────────────────────────────────
function WeekViewSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day headers */}
      <div
        className="flex flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}
      >
        <div style={{ width: 72, borderRight: "1px solid rgba(16,185,129,0.08)" }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center py-[10px] gap-[6px]"
            style={{ borderRight: "1px solid rgba(16,185,129,0.06)" }}
          >
            <Pulse style={{ width: 24, height: 10, borderRadius: 4 }} />
            <Pulse style={{ width: 40, height: 40, borderRadius: 10 }} />
          </div>
        ))}
      </div>

      {/* Grid rows */}
      <div className="flex flex-1 overflow-hidden">
        {/* Hour labels */}
        <div
          className="flex-shrink-0 pt-2 flex flex-col gap-[12px]"
          style={{ width: 72, borderRight: "1px solid rgba(16,185,129,0.08)" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-end pr-3">
              <Pulse style={{ width: 44, height: 10, borderRadius: 4 }} />
            </div>
          ))}
        </div>

        {/* Column cells with fake events */}
        {Array.from({ length: 6 }).map((_, col) => (
          <div
            key={col}
            className="flex-1 relative"
            style={{ borderRight: "1px solid rgba(16,185,129,0.06)" }}
          >
            {/* Fake event cards */}
            {col % 2 === 0 && (
              <Pulse
                style={{
                  position: "absolute",
                  top: 60 + col * 20,
                  left: 4,
                  right: 4,
                  height: 72,
                  borderRadius: 12,
                }}
              />
            )}
            {col % 3 === 0 && (
              <Pulse
                style={{
                  position: "absolute",
                  top: 200,
                  left: 4,
                  right: 4,
                  height: 56,
                  borderRadius: 12,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton: Month View ─────────────────────────────────────────────────────
function MonthViewSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day header */}
      <div
        className="grid grid-cols-7"
        style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="py-2 flex justify-center">
            <Pulse style={{ width: 24, height: 10, borderRadius: 4 }} />
          </div>
        ))}
      </div>
      {/* Grid cells */}
      <div className="flex-1 grid grid-cols-7" style={{ gridAutoRows: "1fr" }}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="p-2 flex flex-col gap-1"
            style={{
              borderRight: "1px solid rgba(16,185,129,0.06)",
              borderBottom: "1px solid rgba(16,185,129,0.06)",
            }}
          >
            <Pulse style={{ width: 22, height: 22, borderRadius: 11 }} />
            {i % 4 === 0 && (
              <Pulse style={{ height: 18, borderRadius: 5 }} />
            )}
            {i % 7 === 0 && (
              <Pulse style={{ height: 18, borderRadius: 5, opacity: 0.6 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton: Day View ───────────────────────────────────────────────────────
function DayViewSkeleton() {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-1">
        <div
          className="flex-shrink-0 pt-2 flex flex-col gap-[20px]"
          style={{ width: 72, borderRight: "1px solid rgba(16,185,129,0.08)" }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex justify-end pr-3">
              <Pulse style={{ width: 44, height: 10, borderRadius: 4 }} />
            </div>
          ))}
        </div>
        <div className="flex-1 relative p-2 flex flex-col gap-4">
          <Pulse style={{ height: 80, borderRadius: 12, marginTop: 40 }} />
          <Pulse style={{ height: 56, borderRadius: 12 }} />
          <Pulse style={{ height: 96, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT: Full Calendar Page Skeleton ─────────────────────────────────
export function CalendarPageSkeleton() {
  return (
    <div
      className="flex h-[calc(100vh-80px)] rounded-[18px] overflow-hidden"
      style={{
        background: "#0d1810",
        border: "1px solid rgba(16,185,129,0.12)",
      }}
    >
      <SidebarSkeleton />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ToolbarSkeleton />
        <div className="flex-1 min-h-0 overflow-hidden">
          <WeekViewSkeleton />
        </div>
      </div>
    </div>
  );
}

// Named exports untuk reuse skeleton per view jika dibutuhkan
export { MiniCalendarSkeleton, WeekViewSkeleton, MonthViewSkeleton, DayViewSkeleton };
