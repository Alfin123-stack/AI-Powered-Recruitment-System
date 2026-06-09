// AnalyticsSkeletonBase.tsx
// Shared primitives for all skeleton components

const T = {
  card: "#0b1410",
  cardBorder: "rgba(16,185,129,0.13)",
  shimmerBase: "rgba(16,185,129,0.04)",
  shimmerHigh: "rgba(16,185,129,0.09)",
};

export const SHIMMER_STYLE = `
@keyframes skeletonShimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.sk-pulse {
  background: linear-gradient(
    90deg,
    ${T.shimmerBase} 25%,
    ${T.shimmerHigh} 50%,
    ${T.shimmerBase} 75%
  );
  background-size: 400px 100%;
  animation: skeletonShimmer 1.6s ease-in-out infinite;
  border-radius: 6px;
}
`;

export function SkeletonStyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: SHIMMER_STYLE }} />;
}

export function SkBox({
  w = "100%",
  h = 16,
  r = 6,
  className = "",
}: {
  w?: string | number;
  h?: string | number;
  r?: number;
  className?: string;
}) {
  return (
    <div
      className={`sk-pulse ${className}`}
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }}
    />
  );
}

export function SkCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[18px] p-5 ${className}`}
      style={{ background: T.card, border: `1px solid ${T.cardBorder}`, ...style }}>
      {children}
    </div>
  );
}
