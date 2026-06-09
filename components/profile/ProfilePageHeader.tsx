// @/components/profile/shell/ProfilePageHeader.tsx
// Settings page header: role subtitle + "Settings" title.
// Pure presentational — no state or side-effects.

import { UserRole } from "@/types/profile";

interface ProfilePageHeaderProps {
  role: UserRole;
}

export function ProfilePageHeader({ role }: ProfilePageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-[#4d6b5a] text-[0.78rem] font-semibold uppercase tracking-[0.14em] mb-1">
        {role === "hr" ? "HR · Settings" : "Candidate · Account"}
      </p>
      <h1 className="text-[1.8rem] font-extrabold text-[#e8f0ec] tracking-[-0.02em]">
        Settings
      </h1>
    </div>
  );
}
