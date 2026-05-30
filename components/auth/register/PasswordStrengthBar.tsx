// components/auth/register/PasswordStrengthBar.tsx
"use client";

import { getPasswordStrength, PASSWORD_STRENGTH_META } from "@/lib/auth/validation";

interface PasswordStrengthBarProps {
  password: string;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const strength = getPasswordStrength(password);
  const meta = PASSWORD_STRENGTH_META[strength];

  return (
    <div className="mt-[6px]">
      <div className="flex gap-[4px] mb-[6px]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
              i < strength ? meta.color : "bg-white/[0.06]"
            }`}
          />
        ))}
      </div>
      <span
        className={`text-[0.69rem] font-medium ${
          password ? meta.text : "text-[#3a5444]"
        }`}
      >
        {password
          ? meta.label
          : "Gunakan kombinasi huruf kapital, angka & simbol"}
      </span>
    </div>
  );
}
