// components/auth/register/RegisterSkeleton.tsx
// Semua skeleton UI untuk halaman register dalam SATU FILE

"use client";

// ── Primitive pulse ────────────────────────────────────────────────────────────
function Pulse({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-emerald-500/[0.07] ${className}`}
      style={style}
    />
  );
}

// ── Step dots skeleton ─────────────────────────────────────────────────────────
function StepProgressSkeleton() {
  return (
    <div className="flex items-center gap-[6px]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-[6px]">
          <Pulse className="w-7 h-7 rounded-full" />
          {i < 2 && <Pulse className="w-8 h-[2px] rounded-full" />}
        </div>
      ))}
    </div>
  );
}

// ── Input field skeleton ───────────────────────────────────────────────────────
function InputFieldSkeleton() {
  return (
    <div className="flex flex-col gap-[6px]">
      <Pulse className="w-24 h-[10px]" />
      <Pulse className="w-full h-[46px] rounded-[11px]" />
    </div>
  );
}

// ── Button skeleton ────────────────────────────────────────────────────────────
function ButtonSkeleton({ full = false }: { full?: boolean }) {
  return (
    <Pulse
      className={`h-[46px] rounded-[11px] ${full ? "flex-1" : "w-[100px]"}`}
    />
  );
}

// ── Badge skeleton ─────────────────────────────────────────────────────────────
function BadgeSkeleton() {
  return <Pulse className="w-32 h-5 rounded-full" />;
}

// ── Heading skeleton ───────────────────────────────────────────────────────────
function HeadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <BadgeSkeleton />
      <Pulse className="w-3/4 h-8 rounded-lg mt-1" />
      <Pulse className="w-1/2 h-4 rounded-md" />
    </div>
  );
}

// ── Progress bar skeleton ──────────────────────────────────────────────────────
function ProgressBarSkeleton() {
  return <Pulse className="w-full h-[2px] rounded-full" />;
}

// ── Google button skeleton ─────────────────────────────────────────────────────
function GoogleButtonSkeleton() {
  return <Pulse className="w-full h-[46px] rounded-[11px]" />;
}

// ── Divider skeleton ───────────────────────────────────────────────────────────
function DividerSkeleton() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-emerald-500/10" />
      <Pulse className="w-28 h-[10px] rounded-full" />
      <div className="flex-1 h-px bg-emerald-500/10" />
    </div>
  );
}

// ── Step meta skeleton ─────────────────────────────────────────────────────────
function StepMetaSkeleton() {
  return (
    <div className="flex flex-col gap-[4px]">
      <Pulse className="w-32 h-[12px] rounded" />
      <Pulse className="w-48 h-[10px] rounded" />
    </div>
  );
}

// ── Footer skeleton ────────────────────────────────────────────────────────────
function FooterSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <Pulse className="w-48 h-[12px] rounded" />
      <Pulse className="w-64 h-[10px] rounded" />
      {/* Security badges */}
      <div className="flex gap-3 mt-2">
        {[0, 1, 2].map((i) => (
          <Pulse key={i} className="w-16 h-5 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// ── MAIN EXPORTED SKELETON ─────────────────────────────────────────────────────
export function RegisterSkeleton() {
  return (
    <div className="w-full">
      {/* Heading */}
      <HeadingSkeleton />

      {/* Step progress */}
      <div className="mt-6 mb-5">
        <div className="flex items-center justify-between mb-3">
          <StepProgressSkeleton />
          <Pulse className="w-8 h-[10px] rounded" />
        </div>
        <StepMetaSkeleton />
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <ProgressBarSkeleton />
      </div>

      {/* Step 1 fields (default shown) */}
      <div className="flex flex-col gap-4">
        <InputFieldSkeleton />
        <InputFieldSkeleton />
        <DividerSkeleton />
        <GoogleButtonSkeleton />
      </div>

      {/* Action button */}
      <div className="flex gap-3 mt-5">
        <ButtonSkeleton full />
      </div>

      {/* Footer */}
      <FooterSkeleton />
    </div>
  );
}
