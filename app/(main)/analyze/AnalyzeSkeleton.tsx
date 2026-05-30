// components/cv-analysis/AnalyzeSkeleton.tsx

export default function AnalyzeSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* HERO skeleton */}
      <section className="pt-[100px] pb-12 text-center">
        <div className="max-w-[680px] mx-auto px-6 flex flex-col items-center gap-4">
          {/* Badge pill */}
          <div className="sk-shimmer rounded-full h-[22px] w-[160px]" />
          {/* Title line 1 */}
          <div className="sk-shimmer rounded-lg h-[36px] w-[72%]" />
          {/* Title line 2 */}
          <div className="sk-shimmer rounded-lg h-[36px] w-[55%]" />
          {/* Subtitle line 1 */}
          <div className="sk-shimmer rounded-full h-[13px] w-[80%]" />
          {/* Subtitle line 2 */}
          <div className="sk-shimmer rounded-full h-[13px] w-[60%]" />
          {/* Status pill */}
          <div className="sk-shimmer rounded-full h-[30px] w-[180px] mt-2" />
        </div>
      </section>

      {/* CONTENT skeleton */}
      <section className="pb-24">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Step cards row */}
          <div
            className="grid gap-4 mb-8"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-[#0f1612] border border-white/[0.07] rounded-[14px] p-5 flex flex-col gap-3">
                <div className="sk-shimmer rounded-full h-[32px] w-[48px]" />
                <div className="sk-shimmer rounded-md h-[14px] w-[70%]" />
                <div className="sk-shimmer rounded-md h-[11px] w-[90%]" />
                <div className="sk-shimmer rounded-md h-[11px] w-[65%]" />
              </div>
            ))}
          </div>

          {/* Upload zone skeleton */}
          <div className="border border-white/[0.08] rounded-[16px] p-12 flex flex-col items-center gap-4">
            <div className="sk-shimmer rounded-[14px] h-[56px] w-[56px]" />
            <div className="sk-shimmer rounded-full h-[18px] w-[200px]" />
            <div className="sk-shimmer rounded-full h-[13px] w-[280px]" />
            <div className="sk-shimmer rounded-full h-[13px] w-[120px]" />
            <div className="sk-shimmer rounded-[10px] h-[40px] w-[140px] mt-2" />
          </div>
        </div>
      </section>

      {/* Shimmer keyframe — inject once via a style tag */}
      <style>{`
        @keyframes sk-sweep {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .sk-shimmer {
          background: linear-gradient(
            90deg,
            #0f1612 25%,
            #162219 50%,
            #0f1612 75%
          );
          background-size: 600px 100%;
          animation: sk-sweep 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}
