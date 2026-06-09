"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ProfileFormField } from "./ProfileFormField";
import { inputCls, inputErrCls } from "./profileInputStyles";

export function ProfilePasswordInput({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <ProfileFormField label={label} error={error}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${error ? inputErrCls : inputCls} pr-11`}
        />
        <button
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </ProfileFormField>
  );
}
