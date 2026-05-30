// Skeleton UI for the notifications list.
// Used by Suspense fallback — pure server-renderable, no "use client" needed.

export default function NotificationsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/[0.05] animate-pulse"
            style={{ background: "rgba(13,19,16,0.9)" }}
          >
            <div className="w-9 h-9 rounded-xl flex-shrink-0 bg-white/5" />
            <div className="space-y-2">
              <div className="h-4 w-8 rounded bg-white/5" />
              <div className="h-2 w-14 rounded bg-white/[0.03]" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div
        className="flex gap-[2px] p-[3px] rounded-xl border border-white/[0.05] animate-pulse"
        style={{ background: "rgba(13,19,16,0.95)" }}
      >
        {[80, 110, 70, 90, 70].map((w, i) => (
          <div
            key={i}
            className="h-7 rounded-[9px] bg-white/[0.04]"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Notif cards skeleton */}
      <div className="space-y-2">
        {/* Group label */}
        <div className="flex items-center gap-2 mb-2 px-1 animate-pulse">
          <div className="h-2 w-16 rounded bg-white/[0.04]" />
          <div className="flex-1 h-px bg-white/[0.03]" />
          <div className="h-2 w-4 rounded bg-white/[0.04]" />
        </div>

        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-4 flex gap-3 animate-pulse border border-white/[0.05]"
            style={{ background: "rgba(13,19,16,0.85)" }}
          >
            <div className="w-9 h-9 rounded-xl flex-shrink-0 bg-white/5" />
            <div className="flex-1 space-y-2 py-1">
              <div
                className="h-3 rounded-md bg-white/5"
                style={{ width: `${55 + (i % 3) * 15}%` }}
              />
              <div className="h-2 rounded-md w-full bg-white/[0.04]" />
              <div
                className="h-2 rounded-md bg-white/[0.03]"
                style={{ width: `${60 + (i % 2) * 20}%` }}
              />
              <div className="flex gap-2 pt-1">
                <div className="h-4 w-12 rounded-md bg-white/[0.04]" />
                <div className="h-4 w-16 rounded-md bg-white/[0.03]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
