import { ReactNode } from "react";

interface AuthRightPanelProps {
  children: ReactNode;
}

export default function AuthRightPanel({ children }: AuthRightPanelProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_20%,rgba(16,185,129,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_80%,rgba(6,182,212,0.04)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Left separator line (visible only on lg+) */}
      <div
        className="hidden lg:block absolute left-0 top-[8%] bottom-[8%] w-px
        bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent pointer-events-none"
      />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-[440px] px-6 sm:px-8 py-10">
        {children}
      </div>
    </div>
  );
}
