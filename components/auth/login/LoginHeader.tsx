// @/components/auth/login/LoginHeader.tsx
// Rendering Strategy: Server Component (static)
// Reason: No interactivity, no user-specific data.
// Content is fully static → renders on the server, zero JS to the client.

import { Sparkles } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="mb-8">
      <div className="mb-3">
        <span
          className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/20
            text-emerald-400 px-[11px] py-[4px] rounded-full text-[0.66rem] font-semibold
            tracking-[0.1em] uppercase"
        >
          <Sparkles size={8} className="animate-pulse" />
          Sign in to your account
        </span>
      </div>

      <h2
        className="font-syne text-[1.9rem] font-extrabold text-[#e8f0ec] tracking-tight
          leading-[1.15] mb-2"
      >
        Welcome back
      </h2>

      <p className="text-[#5a7a6a] text-[0.86rem] leading-relaxed">
        Sign in to your recruitment dashboard and start analyzing your CV
      </p>
    </div>
  );
}
