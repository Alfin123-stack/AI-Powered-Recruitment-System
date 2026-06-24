// @/components/auth/login/LoginHeader.tsx
// Rendering Strategy: Server Component (static)
// Reason: No interactivity, no user-specific data.
// Content is fully static → renders on the server, zero JS to the client.

import { Sparkles } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="mb-8">


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
