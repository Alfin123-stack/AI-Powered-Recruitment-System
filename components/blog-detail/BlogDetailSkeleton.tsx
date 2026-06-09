export default function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      {/* ── Breadcrumb skeleton ── */}
      <div className="max-w-[760px] mx-auto px-6 pt-10 pb-0">
        <div className="flex items-center gap-2">
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 52 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 10 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 30 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 10 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 80 }}
          />
        </div>
      </div>

      {/* ── Article header skeleton ── */}
      <header className="max-w-[760px] mx-auto px-6 pt-8 pb-10">
        {/* Badges */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 22, width: 100 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 22, width: 72 }}
          />
        </div>
        {/* Title */}
        <div
          className="sk-shimmer rounded-lg"
          style={{ height: 40, width: "92%", marginBottom: 10 }}
        />
        <div
          className="sk-shimmer rounded-lg"
          style={{ height: 40, width: "74%", marginBottom: 20 }}
        />
        {/* Excerpt */}
        <div
          style={{
            borderLeft: "2px solid rgba(16,185,129,0.15)",
            paddingLeft: 16,
            marginBottom: 24,
          }}>
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 13, width: "100%", marginBottom: 7 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 13, width: "88%", marginBottom: 7 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 13, width: "70%" }}
          />
        </div>
        {/* Meta row */}
        <div
          className="flex items-center gap-4"
          style={{
            paddingBottom: 24,
            borderBottom: "1px solid rgba(16,185,129,0.1)",
          }}>
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 80 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 6 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 60 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 6 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 10, width: 110 }}
          />
        </div>
      </header>

      {/* ── Article body skeleton ── */}
      <div className="max-w-[760px] mx-auto px-6 pb-12 flex flex-col gap-4">
        {/* Paragraph blocks */}
        {[100, 92, 85, 96, 78, 88].map((w, i) => (
          <div
            key={i}
            className="sk-shimmer rounded-full"
            style={{ height: 13, width: `${w}%` }}
          />
        ))}

        {/* h2 block */}
        <div
          style={{
            marginTop: 16,
            paddingBottom: 8,
            borderBottom: "1px solid rgba(16,185,129,0.1)",
          }}>
          <div
            className="sk-shimmer rounded-md"
            style={{ height: 22, width: "55%" }}
          />
        </div>

        {/* More paragraphs */}
        {[94, 87, 100, 76, 91, 82].map((w, i) => (
          <div
            key={`b${i}`}
            className="sk-shimmer rounded-full"
            style={{ height: 13, width: `${w}%` }}
          />
        ))}

        {/* ul list */}
        <div className="flex flex-col gap-3 mt-2">
          {[72, 65, 80, 58].map((w, i) => (
            <div key={`li${i}`} className="flex items-center gap-3">
              <div
                className="sk-shimmer rounded-full flex-shrink-0"
                style={{ height: 6, width: 6 }}
              />
              <div
                className="sk-shimmer rounded-full"
                style={{ height: 12, width: `${w}%` }}
              />
            </div>
          ))}
        </div>

        {/* h2 block */}
        <div
          style={{
            marginTop: 16,
            paddingBottom: 8,
            borderBottom: "1px solid rgba(16,185,129,0.1)",
          }}>
          <div
            className="sk-shimmer rounded-md"
            style={{ height: 22, width: "48%" }}
          />
        </div>

        {/* Final paragraphs */}
        {[98, 84, 90, 68].map((w, i) => (
          <div
            key={`c${i}`}
            className="sk-shimmer rounded-full"
            style={{ height: 13, width: `${w}%` }}
          />
        ))}
      </div>

      {/* ── CTA skeleton ── */}
      <section className="max-w-[760px] mx-auto px-6 pb-16">
        <div
          className="rounded-[18px] p-8 flex flex-col gap-4"
          style={{
            background: "#0f1612",
            border: "1px solid rgba(16,185,129,0.12)",
          }}>
          <div className="flex items-center gap-2">
            <div
              className="sk-shimmer rounded-full"
              style={{ height: 14, width: 14 }}
            />
            <div
              className="sk-shimmer rounded-full"
              style={{ height: 11, width: 90 }}
            />
          </div>
          <div
            className="sk-shimmer rounded-md"
            style={{ height: 22, width: "80%" }}
          />
          <div
            className="sk-shimmer rounded-md"
            style={{ height: 22, width: "60%" }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 12, width: "90%", marginTop: 4 }}
          />
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 12, width: "75%" }}
          />
          <div className="flex items-center gap-3 mt-2">
            <div
              className="sk-shimmer rounded-[10px]"
              style={{ height: 44, width: 180 }}
            />
            <div
              className="sk-shimmer rounded-[10px]"
              style={{ height: 44, width: 130 }}
            />
          </div>
        </div>
      </section>

      {/* ── Related articles skeleton ── */}
      <section style={{ background: "#0f1612", padding: "60px 0" }}>
        <div className="max-w-[1180px] mx-auto px-6">
          {/* Heading */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="sk-shimmer rounded-full"
              style={{ height: 13, width: 100 }}
            />
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(16,185,129,0.08)",
              }}
            />
          </div>
          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-5 rounded-[14px]"
                style={{
                  background: "#0a0f0d",
                  border: "1px solid rgba(16,185,129,0.07)",
                }}>
                <div
                  className="sk-shimmer rounded-full"
                  style={{ height: 10, width: 70 }}
                />
                <div
                  className="sk-shimmer rounded-md"
                  style={{ height: 15, width: "90%" }}
                />
                <div
                  className="sk-shimmer rounded-md"
                  style={{ height: 15, width: "70%" }}
                />
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div
                    className="sk-shimmer rounded-full"
                    style={{ height: 10, width: 55 }}
                  />
                  <div
                    className="sk-shimmer rounded-full"
                    style={{ height: 10, width: 14 }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Back button */}
          <div className="mt-8 flex justify-center">
            <div
              className="sk-shimmer rounded-[9px]"
              style={{ height: 38, width: 200 }}
            />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes sk-sweep {
          0%   { background-position: -700px 0; }
          100% { background-position:  700px 0; }
        }
        .sk-shimmer {
          background: linear-gradient(90deg, #0f1612 25%, #172119 50%, #0f1612 75%);
          background-size: 700px 100%;
          animation: sk-sweep 1.7s infinite linear;
        }
      `}</style>
    </div>
  );
}
