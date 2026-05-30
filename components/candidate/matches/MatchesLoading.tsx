// Skeleton UI untuk halaman Job Matches.
//
// ⚠️  loading.tsx Next.js hanya bekerja untuk Server Component + Suspense.
// Karena MatchesPage adalah client component (useEffect), loading.tsx
// tidak pernah auto-trigger. Solusi: import MatchesLoading langsung
// ke page.tsx dan render saat loading === true:
//   if (loading) return <MatchesLoading />

export default function MatchesLoading() {
  return (
    <div className="animate-pulse">
      {/* ── JobMatchHeader skeleton ─────────────────────────────────── */}
      <div className="mb-5">
        {/* Title + subtitle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-[6px]">
            <div className="h-[16px] w-[110px] rounded-[5px] bg-white/[0.06]" />
            <div className="h-[11px] w-[220px] rounded-[4px] bg-white/[0.04]" />
          </div>
        </div>

        {/* Stats cards — 4 kotak */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { w: "w-[80px]", lw: "w-[100px]" },
            { w: "w-[28px]", lw: "w-[90px]" },
            { w: "w-[28px]", lw: "w-[120px]" },
            { w: "w-[28px]", lw: "w-[95px]" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#0f1612] border border-white/[0.05] rounded-[12px] px-4 py-[14px] flex items-center gap-3">
              {/* Icon placeholder */}
              <div className="w-8 h-8 rounded-[8px] bg-white/[0.05] flex-shrink-0" />
              <div className="flex flex-col gap-[6px]">
                <div
                  className={`h-[18px] ${s.w} rounded-[4px] bg-white/[0.06]`}
                />
                <div
                  className={`h-[10px] ${s.lw} rounded-[3px] bg-white/[0.04]`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CVAnalysisBar skeleton ──────────────────────────────────── */}
      <div className="bg-[#0d1a14] border border-emerald-500/10 rounded-[12px] px-4 py-3 mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Score badge */}
            <div className="h-[26px] w-[72px] rounded-[7px] bg-white/[0.05]" />
            {/* Filename */}
            <div className="h-[11px] w-[130px] rounded-[4px] bg-white/[0.04]" />
            {/* Skill chips */}
            <div className="flex gap-[5px]">
              {[52, 64, 44, 56, 48].map((w, i) => (
                <div
                  key={i}
                  className="h-[20px] rounded-[4px] bg-white/[0.04]"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>
          {/* Update link */}
          <div className="h-[11px] w-[64px] rounded-[4px] bg-white/[0.04]" />
        </div>
      </div>

      {/* ── JobMatchToolbar skeleton ────────────────────────────────── */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        {/* Search input */}
        <div className="flex-1 min-w-[200px] h-[38px] rounded-[9px] bg-white/[0.04] border border-white/[0.05]" />
        {/* Filter pills */}
        <div className="flex gap-2">
          {[88, 72, 52].map((w, i) => (
            <div
              key={i}
              className="h-[36px] rounded-[8px] bg-white/[0.04] border border-white/[0.05]"
              style={{ width: w }}
            />
          ))}
        </div>
        {/* Count */}
        <div className="h-[10px] w-[64px] rounded-[3px] bg-white/[0.03] ml-auto" />
      </div>

      {/* ── JobMatchCard skeletons ──────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {[
          {
            matchW: "w-[52px]",
            titleW: "w-[180px]",
            companyW: "w-[110px]",
            skill1: [56, 64, 48],
            skill2: [52, 44],
          },
          {
            matchW: "w-[44px]",
            titleW: "w-[220px]",
            companyW: "w-[130px]",
            skill1: [48, 72, 60],
            skill2: [44, 56],
          },
          {
            matchW: "w-[48px]",
            titleW: "w-[160px]",
            companyW: "w-[100px]",
            skill1: [60, 52],
            skill2: [64, 40, 56],
          },
          {
            matchW: "w-[56px]",
            titleW: "w-[200px]",
            companyW: "w-[120px]",
            skill1: [44, 68, 52],
            skill2: [48],
          },
          {
            matchW: "w-[40px]",
            titleW: "w-[170px]",
            companyW: "w-[90px]",
            skill1: [56, 44],
            skill2: [60, 52, 44],
          },
        ].map((card, i) => (
          <div
            key={i}
            className="relative bg-[#0f1612] border border-white/[0.05] rounded-[14px] p-5 overflow-hidden">
            {/* Accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/[0.04]" />

            <div className="flex items-start gap-4">
              {/* Logo placeholder */}
              <div className="w-11 h-11 rounded-[10px] bg-white/[0.05] border border-white/[0.05] flex-shrink-0" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Row 1: title + match score */}
                <div className="flex items-start justify-between gap-3 mb-[8px]">
                  <div className="flex flex-col gap-[6px]">
                    <div
                      className={`h-[15px] ${card.titleW} rounded-[4px] bg-white/[0.06]`}
                    />
                    <div
                      className={`h-[11px] ${card.companyW} rounded-[3px] bg-white/[0.04]`}
                    />
                  </div>
                  {/* Score block */}
                  <div className="flex flex-col items-end gap-[6px]">
                    <div
                      className={`h-[22px] ${card.matchW} rounded-[4px] bg-white/[0.06]`}
                    />
                    <div className="h-[18px] w-[72px] rounded-full bg-white/[0.04]" />
                  </div>
                </div>

                {/* Match progress bar */}
                <div className="h-[3px] rounded-full bg-white/[0.04] mb-4" />

                {/* Skills row */}
                <div className="flex gap-4 flex-wrap mb-4">
                  {/* Matched */}
                  <div className="flex items-center gap-[6px]">
                    <div className="h-[10px] w-[36px] rounded-[3px] bg-white/[0.04]" />
                    {card.skill1.map((w, j) => (
                      <div
                        key={j}
                        className="h-[20px] rounded-[4px] bg-white/[0.04]"
                        style={{ width: w }}
                      />
                    ))}
                  </div>
                  {/* Missing */}
                  <div className="flex items-center gap-[6px]">
                    <div className="h-[10px] w-[40px] rounded-[3px] bg-white/[0.04]" />
                    {card.skill2.map((w, j) => (
                      <div
                        key={j}
                        className="h-[20px] rounded-[4px] bg-white/[0.03]"
                        style={{ width: w }}
                      />
                    ))}
                  </div>
                </div>

                {/* Meta + actions */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {/* Meta */}
                  <div className="flex items-center gap-3">
                    <div className="h-[10px] w-[72px] rounded-[3px] bg-white/[0.04]" />
                    <div className="h-[10px] w-[56px] rounded-[3px] bg-white/[0.04]" />
                    <div className="h-[18px] w-[52px] rounded-[4px] bg-white/[0.04]" />
                    <div className="h-[10px] w-[44px] rounded-[3px] bg-white/[0.04]" />
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-2">
                    <div className="h-[32px] w-[110px] rounded-[8px] bg-white/[0.05]" />
                    <div className="h-[32px] w-[64px] rounded-[8px] bg-white/[0.04]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer CTA skeleton ─────────────────────────────────────── */}
      <div className="mt-6 flex justify-center">
        <div className="h-[38px] w-[160px] rounded-[9px] bg-white/[0.04] border border-white/[0.05]" />
      </div>
    </div>
  );
}
