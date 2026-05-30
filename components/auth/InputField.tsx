// components/auth/InputField.tsx
"use client";

import { useState } from "react";
import { FieldError } from "./FieldError";

export function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  suffix,
  autoFocus = false,
  hint,
  errorMessage,
  onClearError,
}: {
  id: string;
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
  autoFocus?: boolean;
  hint?: string;
  errorMessage?: string;
  onClearError?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!errorMessage;

  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label
          htmlFor={id}
          className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-[11px] border transition-all duration-200
        ${
          hasError
            ? "border-red-500/50 bg-red-500/[0.04] shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
            : focused
              ? "border-emerald-500 bg-emerald-500/[0.05] shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
              : "border-emerald-500/15 bg-[#0f1a14] hover:border-emerald-500/35 hover:bg-[#111d16]"
        }`}>
        <span
          className={`absolute left-[13px] pointer-events-none transition-colors duration-200 ${
            hasError
              ? "text-red-400"
              : focused
                ? "text-emerald-400"
                : "text-[#4a6b58]"
          }`}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onClearError?.();
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          className="w-full h-[46px] pl-[42px] pr-[42px] bg-transparent text-[0.88rem] text-[#e8f0ec]
            placeholder:text-[#2e4a3a] outline-none rounded-[11px]"
        />
        {suffix && (
          <span className="absolute right-[13px] flex items-center">
            {suffix}
          </span>
        )}
      </div>
      <FieldError message={errorMessage} />
      {hint && !hasError && (
        <p className="text-[0.7rem] text-[#4a6b58]">{hint}</p>
      )}
    </div>
  );
}
