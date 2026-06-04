import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { FieldError } from "@/components/auth/FieldError";
import { PasswordStrengthBar } from "@/components/auth/register/PasswordStrengthBar";
import { PASSWORD_RULES } from "@/lib/auth/validation";
import type { AuthFieldErrors } from "@/lib/auth/validation";

interface RegisterStep2Props {
  password: string;
  setPassword: (v: string) => void;
  showPass: boolean;
  togglePass: () => void;
  inputType: string;
  fieldErrors: Partial<AuthFieldErrors>;
  clearError: (field: keyof AuthFieldErrors) => void;
}

export function RegisterStep2({
  password,
  setPassword,
  showPass,
  togglePass,
  inputType,
  fieldErrors,
  clearError,
}: RegisterStep2Props) {
  const passwordRules = PASSWORD_RULES(password);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
      {/* ── Password input ── */}
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor="password"
          className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none">
          Password
        </label>
        <div
          className={`relative flex items-center rounded-[11px] border transition-all duration-200
          ${
            fieldErrors.password
              ? "border-red-500/50 bg-red-500/[0.04] shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
              : "border-emerald-500/15 bg-[#0f1a14] focus-within:border-emerald-500 focus-within:bg-emerald-500/[0.05] focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.10)] hover:border-emerald-500/35 hover:bg-[#111d16]"
          }`}>
          <span
            className={`absolute left-[13px] pointer-events-none ${
              fieldErrors.password ? "text-red-400" : "text-[#4a6b58]"
            }`}>
            <Lock size={15} />
          </span>
          <input
            id="password"
            type={inputType}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            placeholder="Min. 8 karakter"
            autoFocus
            className="w-full h-[46px] pl-[42px] pr-[44px] bg-transparent text-[0.88rem] text-[#e8f0ec]
              placeholder:text-[#2e4a3a] outline-none rounded-[11px]"
          />
          <button
            type="button"
            onClick={togglePass}
            className="absolute right-[13px] text-[#4a6b58] hover:text-emerald-400 transition-colors cursor-pointer flex items-center"
            aria-label="Toggle password">
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <PasswordStrengthBar password={password} />
        <FieldError message={fieldErrors.password} />
      </div>

      {/* ── Password rules checklist ── */}
      <div className="rounded-[11px] bg-[#0c1510] border border-emerald-500/12 px-4 py-4">
        <p className="text-[0.68rem] font-semibold text-[#3a5444] tracking-[0.08em] uppercase mb-3">
          Persyaratan Password
        </p>
        <div className="grid grid-cols-2 gap-[8px]">
          {passwordRules.map((r) => (
            <div key={r.label} className="flex items-center gap-[8px]">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                ${
                  r.ok
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/[0.04] text-[#3a5444]"
                }`}>
                {r.ok ? (
                  <CheckCircle2 size={10} />
                ) : (
                  <span className="w-[4px] h-[4px] rounded-full bg-current" />
                )}
              </div>
              <span
                className={`text-[0.73rem] transition-colors duration-200 ${
                  r.ok ? "text-emerald-400" : "text-[#3a5444]"
                }`}>
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
