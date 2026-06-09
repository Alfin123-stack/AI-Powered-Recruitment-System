function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[8px] bg-emerald-500/[0.06] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-emerald-500/[0.08] before:to-transparent ${className}`}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] pt-24 pb-16 px-4">
      {/* Ambient background — sama dengan page asli */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04] bg-[radial-gradient(circle,#10b981_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[radial-gradient(circle,#06b6d4_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-[920px] mx-auto">
        {/* Page header skeleton */}
        <div className="mb-8">
          <Shimmer className="h-3 w-28 mb-2" />
          <Shimmer className="h-8 w-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* LEFT SIDEBAR skeleton */}
          <div className="flex flex-col gap-4">
            {/* Avatar card */}
            <div className="rounded-[16px] border border-emerald-500/10 p-6 flex flex-col items-center gap-4 bg-[#0f1612]">
              {/* Avatar */}
              <Shimmer className="w-24 h-24 rounded-[16px]" />

              {/* Name & email */}
              <div className="flex flex-col items-center gap-2 w-full">
                <Shimmer className="h-4 w-32" />
                <Shimmer className="h-3 w-40" />
                <Shimmer className="h-5 w-24 rounded-full mt-1" />
              </div>

              {/* Mini stats grid */}
              <div className="w-full grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[10px] p-2.5 border border-emerald-500/8 bg-emerald-500/3 flex flex-col gap-2">
                    <Shimmer className="h-3 w-14" />
                    <Shimmer className="h-4 w-10" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tab nav */}
            <div className="rounded-[16px] border border-emerald-500/10 p-2 flex flex-col gap-1 bg-[#0f1612]">
              {Array.from({ length: 2 }).map((_, i) => (
                <Shimmer key={i} className="h-10 w-full rounded-[10px]" />
              ))}
              <div className="h-px bg-emerald-500/8 my-1" />
              <Shimmer className="h-10 w-full rounded-[10px]" />
            </div>
          </div>

          {/* RIGHT CONTENT skeleton */}
          <div className="rounded-[16px] border border-emerald-500/10 p-6 lg:p-8 bg-[#0f1612] min-h-[500px]">
            {/* Section header */}
            <div className="mb-6">
              <Shimmer className="h-5 w-40 mb-2" />
              <Shimmer className="h-3 w-64" />
            </div>

            {/* Form fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Shimmer className="h-3 w-20" />
                  <Shimmer className="h-[42px] w-full" />
                </div>
              ))}
              {/* Full-width fields */}
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Shimmer className="h-3 w-24" />
                <Shimmer className="h-[42px] w-full" />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Shimmer className="h-3 w-8" />
                <Shimmer className="h-[100px] w-full" />
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <Shimmer className="h-[42px] w-36 rounded-[10px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer keyframe — inject via style tag */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
