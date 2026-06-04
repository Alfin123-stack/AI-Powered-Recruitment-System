"use client";

// ─── ALL SKELETON UIs IN ONE FILE ────────────────────────────────────────────
// Exports: AnalyzeSkeleton (full page), ScoreBlockSkeleton, OverviewTabSkeleton,
//          ATSTabSkeleton, FeedbackTabSkeleton, WritingTabSkeleton

function Shimmer({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background:
          "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
        borderRadius: 8,
        ...style,
      }}
    />
  );
}

// ─── Score block skeleton ─────────────────────────────────────────────────────
export function ScoreBlockSkeleton({ primary = false }: { primary?: boolean }) {
  return (
    <div
      className="rounded-[12px] p-4"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}>
      <Shimmer style={{ height: 10, width: 60, marginBottom: 12 }} />
      <div className="flex items-end gap-2 mb-3">
        <Shimmer
          style={{ height: primary ? 40 : 28, width: primary ? 80 : 56 }}
        />
        <Shimmer style={{ height: 12, width: 30, marginBottom: 4 }} />
      </div>
      <Shimmer style={{ height: primary ? 5 : 3, width: "100%" }} />
      <Shimmer style={{ height: 10, width: 100, marginTop: 6 }} />
    </div>
  );
}

// ─── Overview tab skeleton ────────────────────────────────────────────────────
export function OverviewTabSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-[12px] p-5"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
          <Shimmer style={{ height: 10, width: 80, marginBottom: 16 }} />
          <div className="space-y-[10px]">
            {[0, 1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <Shimmer style={{ height: 12, width: 80 }} />
                <Shimmer style={{ height: 5, flex: 1 }} />
                <Shimmer style={{ height: 12, width: 24 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ATS tab skeleton ─────────────────────────────────────────────────────────
export function ATSTabSkeleton() {
  return (
    <div>
      <div
        className="flex items-center gap-5 mb-5 p-4 rounded-[12px]"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <div>
          <Shimmer style={{ height: 10, width: 80, marginBottom: 8 }} />
          <Shimmer style={{ height: 36, width: 72, marginBottom: 4 }} />
          <Shimmer style={{ height: 11, width: 120 }} />
        </div>
        <div style={{ flex: 1 }}>
          <Shimmer style={{ height: 5, width: "100%", marginBottom: 8 }} />
          <Shimmer style={{ height: 12, width: "80%" }} />
        </div>
      </div>
      <div className="space-y-[5px]">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="rounded-[10px] px-4 py-[10px] flex items-center gap-3"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
            }}>
            <Shimmer
              style={{
                height: 13,
                width: 13,
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <Shimmer style={{ height: 12, flex: 1 }} />
            <Shimmer style={{ height: 20, width: 40, borderRadius: 999 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feedback tab skeleton ────────────────────────────────────────────────────
export function FeedbackTabSkeleton() {
  return (
    <div>
      <div className="flex gap-[5px] mb-5">
        {[0, 1, 2, 3].map((i) => (
          <Shimmer
            key={i}
            style={{ height: 28, width: 72, borderRadius: 999 }}
          />
        ))}
      </div>
      <div className="space-y-[7px]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[10px] p-4"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
            <div className="flex items-start gap-3">
              <Shimmer
                style={{
                  height: 13,
                  width: 13,
                  borderRadius: "50%",
                  marginTop: 2,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div className="flex gap-2 mb-[6px]">
                  <Shimmer style={{ height: 20, width: 60, borderRadius: 4 }} />
                  <Shimmer
                    style={{ height: 20, width: 80, borderRadius: 999 }}
                  />
                </div>
                <Shimmer
                  style={{ height: 13, width: "70%", marginBottom: 5 }}
                />
                <Shimmer style={{ height: 12, width: "90%" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Writing tab skeleton ─────────────────────────────────────────────────────
export function WritingTabSkeleton() {
  return (
    <div>
      <div
        className="flex items-start gap-3 p-4 rounded-[12px] mb-5"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <Shimmer
          style={{ height: 14, width: 14, flexShrink: 0, marginTop: 1 }}
        />
        <div style={{ flex: 1 }}>
          <Shimmer style={{ height: 12, width: "90%", marginBottom: 6 }} />
          <Shimmer style={{ height: 12, width: "70%" }} />
        </div>
      </div>
      <div className="flex gap-[5px] mb-5">
        {[0, 1, 2].map((i) => (
          <Shimmer
            key={i}
            style={{ height: 28, width: 72, borderRadius: 999 }}
          />
        ))}
      </div>
      <div className="space-y-[10px]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-[12px] overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div
              className="px-4 py-[8px]"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
              <Shimmer style={{ height: 20, width: 60, borderRadius: 4 }} />
            </div>
            <div className="p-4">
              <Shimmer style={{ height: 10, width: 50, marginBottom: 6 }} />
              <Shimmer
                style={{ height: 52, width: "100%", marginBottom: 10 }}
              />
              <div className="flex justify-center mb-3">
                <Shimmer style={{ height: 14, width: 14 }} />
              </div>
              <Shimmer style={{ height: 10, width: 80, marginBottom: 6 }} />
              <Shimmer
                style={{ height: 52, width: "100%", marginBottom: 10 }}
              />
              <Shimmer style={{ height: 12, width: "80%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FULL PAGE SKELETON (default export) ─────────────────────────────────────
export default function AnalyzeSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="min-h-screen bg-[#090d0b] text-[#e8f0ec]">
        {/* Hero skeleton */}
        <section
          className="pt-[90px] pb-10 text-center"
          style={{ background: "#090d0b" }}>
          <div className="max-w-[600px] mx-auto px-6">
            <Shimmer
              style={{
                height: 26,
                width: 160,
                borderRadius: 999,
                margin: "0 auto 16px",
              }}
            />
            <Shimmer
              style={{ height: 44, width: "70%", margin: "0 auto 12px" }}
            />
            <Shimmer
              style={{ height: 44, width: "50%", margin: "0 auto 20px" }}
            />
            <Shimmer
              style={{ height: 14, width: "60%", margin: "0 auto 6px" }}
            />
            <Shimmer
              style={{ height: 14, width: "45%", margin: "0 auto 20px" }}
            />
            <Shimmer
              style={{
                height: 30,
                width: 180,
                borderRadius: 999,
                margin: "0 auto",
              }}
            />
          </div>
        </section>

        {/* Content skeleton */}
        <section className="py-8 pb-20">
          <div className="max-w-[960px] mx-auto px-6">
            {/* Score row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Shimmer style={{ height: 14, width: 140, marginBottom: 6 }} />
                <Shimmer style={{ height: 11, width: 100 }} />
              </div>
              <div className="flex gap-2">
                <Shimmer style={{ height: 34, width: 110, borderRadius: 8 }} />
                <Shimmer style={{ height: 34, width: 130, borderRadius: 8 }} />
              </div>
            </div>

            {/* Score blocks */}
            <div className="grid grid-cols-4 gap-[10px] mb-4">
              <ScoreBlockSkeleton primary />
              <ScoreBlockSkeleton />
              <ScoreBlockSkeleton />
              <ScoreBlockSkeleton />
            </div>

            {/* Readability bar */}
            <div
              className="flex items-center gap-4 mb-5 px-4 py-3 rounded-[10px]"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              <Shimmer style={{ height: 11, width: 90 }} />
              <Shimmer style={{ height: 4, flex: 1 }} />
              <Shimmer style={{ height: 12, width: 50 }} />
            </div>

            {/* Summary banner */}
            <div
              className="rounded-[12px] p-4 mb-5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "2px solid rgba(74,222,128,0.2)",
                borderRadius: "0 12px 12px 0",
              }}>
              <div className="flex items-center gap-2 mb-[7px]">
                <Shimmer style={{ height: 12, width: 12 }} />
                <Shimmer style={{ height: 10, width: 70 }} />
              </div>
              <Shimmer style={{ height: 13, width: "95%", marginBottom: 6 }} />
              <Shimmer style={{ height: 13, width: "80%" }} />
            </div>

            {/* Divider */}
            <div
              className="mb-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            />

            {/* Tab bar */}
            <div
              className="flex gap-[3px] mb-5 border-b"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              {[0, 1, 2, 3].map((i) => (
                <Shimmer
                  key={i}
                  style={{
                    height: 34,
                    width: i === 0 ? 80 : i === 3 ? 130 : 90,
                    borderRadius: 6,
                    margin: "0 2px",
                  }}
                />
              ))}
            </div>

            {/* Overview tab content */}
            <OverviewTabSkeleton />
          </div>
        </section>
      </div>
    </>
  );
}
