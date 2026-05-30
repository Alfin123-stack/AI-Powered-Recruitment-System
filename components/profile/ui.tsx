"use client";

// components/profile/ui.tsx
// ─────────────────────────────────────────────
// Shared UI primitives — semua CSR karena ada interaksi
// (PasswordInput punya show/hide state)
//
// Dipakai oleh semua Tab components.
// Pisah ke file ini agar tidak duplikasi kode.
// ─────────────────────────────────────────────

import { useState } from "react";
import { Check, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── CSS class constants ───────────────────────────────────────────────────────

export const inputCls =
  "w-full bg-[#141f19] border border-emerald-500/15 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-emerald-500/40 transition-colors";

export const inputErrCls =
  "w-full bg-[#141f19] border border-red-500/40 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-red-500/60 transition-colors";

// ── Field wrapper ─────────────────────────────────────────────────────────────

export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-[0.72rem] font-semibold text-[#7a9585] mb-[6px] block tracking-[0.06em] uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[0.7rem] text-red-400 mt-[5px]">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-[0.7rem] text-[#7a9585] mt-[5px]">{hint}</p>
      )}
    </div>
  );
}

// ── Save button ───────────────────────────────────────────────────────────────

export function SaveBtn({
  loading,
  saved,
  onClick,
  label = "Simpan Perubahan",
}: {
  loading: boolean;
  saved: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={`px-6 py-[10px] rounded-[10px] font-bold text-[0.88rem] transition-all
        ${
          saved
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default"
            : "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
        }`}>
      {loading ? (
        <Loader2 size={15} className="animate-spin mr-2" />
      ) : saved ? (
        <Check size={15} className="mr-2" />
      ) : null}
      {loading ? "Menyimpan..." : saved ? "Tersimpan!" : label}
    </Button>
  );
}

// ── Error banner ──────────────────────────────────────────────────────────────

export function ErrorBanner({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2 mb-4">
      <AlertCircle size={13} /> {msg}
    </div>
  );
}

// ── Password input dengan show/hide ──────────────────────────────────────────

export function PasswordInput({
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
    <Field label={label} error={error}>
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
    </Field>
  );
}
