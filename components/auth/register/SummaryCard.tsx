// components/auth/register/SummaryCard.tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import { ROLES } from "@/components/auth/register/RoleSelect";

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between py-[9px] border-b border-emerald-500/[0.08] last:border-0">
      <span className="text-[0.75rem] text-[#4a6b58]">{label}</span>
      <span className="text-[0.8rem] text-[#c5d8cc] font-medium truncate max-w-[200px] text-right">
        {value}
      </span>
    </div>
  );
}

interface SummaryCardProps {
  fullName: string;
  email: string;
  role: string;
}

export function SummaryCard({ fullName, email, role }: SummaryCardProps) {
  const selectedRole = ROLES.find((r) => r.value === role);

  return (
    <div className="flex flex-col gap-4">
      {/* Role benefit card */}
      {selectedRole && (
        <div
          className="rounded-[11px] px-4 py-3 border transition-all duration-300"
          style={{
            background: `${selectedRole.color}08`,
            borderColor: `${selectedRole.color}20`,
          }}
        >
          <p
            className="text-[0.72rem] font-semibold tracking-[0.07em] uppercase mb-[6px]"
            style={{ color: selectedRole.color }}
          >
            Yang akan kamu dapatkan
          </p>
          {selectedRole.features.map((f) => (
            <div key={f} className="flex items-center gap-[8px] py-[3px]">
              <CheckCircle2
                size={11}
                style={{ color: selectedRole.color }}
                className="flex-shrink-0"
              />
              <span className="text-[0.76rem] text-[#7a9585]">{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* Account summary */}
      <div className="rounded-[11px] bg-[#0c1510] border border-emerald-500/12 px-4 py-1">
        <p className="text-[0.68rem] font-semibold text-[#3a5444] tracking-[0.08em] uppercase pt-3 pb-2">
          Ringkasan Akun
        </p>
        <SummaryRow label="Nama" value={fullName} />
        <SummaryRow label="Email" value={email} />
        <SummaryRow label="Password" value="••••••••" />
        {role && selectedRole && (
          <SummaryRow label="Peran" value={selectedRole.label} />
        )}
      </div>
    </div>
  );
}
