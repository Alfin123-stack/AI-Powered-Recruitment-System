// components/auth/register/RegisterForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { Spinner } from "@/components/auth/Spinner";
import { FieldError } from "@/components/auth/FieldError";
import { InputField } from "@/components/auth/InputField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";
import { ErrorBanner } from "@/components/auth/ErrorBanner";
import { SecurityBadges } from "@/components/auth/SecurityBadges";
import { MobileLogo } from "@/components/auth/MobileLogo";
import {
  type AuthFieldErrors,
  validateEmail,
  validateFullName,
  validateRole,
  validateStrongPassword,
  PASSWORD_RULES,
} from "@/lib/auth/validation";

import { StepProgress } from "@/components/auth/register/StepProgress";
import { PasswordStrengthBar } from "@/components/auth/register/PasswordStrengthBar";
import { RoleSelect } from "@/components/auth/register/RoleSelect";
import { SummaryCard } from "@/components/auth/register/SummaryCard";

// ── Step metadata ──────────────────────────────────────────────────────────────
const STEP_META = [
  { title: "Informasi Dasar", sub: "Nama lengkap & alamat email" },
  { title: "Keamanan Akun", sub: "Buat password yang kuat" },
  { title: "Pilih Peran", sub: "Sebagai kandidat atau HR?" },
] as const;

const TOTAL_STEPS = 3;

// ── Component ──────────────────────────────────────────────────────────────────
export function RegisterForm() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState(1);

  // Field state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  // ── Validation per step ──────────────────────────────────────────────────────
  const validateStep = (): AuthFieldErrors => {
    const errors: AuthFieldErrors = {};
    if (step === 1) {
      const nameErr = validateFullName(fullName);
      const emailErr = validateEmail(email);
      if (nameErr) errors.fullName = nameErr;
      if (emailErr) errors.email = emailErr;
    }
    if (step === 2) {
      const passErr = validateStrongPassword(password);
      if (passErr) errors.password = passErr;
    }
    if (step === 3) {
      const roleErr = validateRole(role);
      if (roleErr) errors.role = roleErr;
    }
    return errors;
  };

  const clearError = (field: keyof AuthFieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  // ── Navigation ───────────────────────────────────────────────────────────────
  const handleNext = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setFieldErrors({});
    setStep((s) => s - 1);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setError("");
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    router.push("/login?registered=1");
  };

  const passwordRules = PASSWORD_RULES(password);
  const currentMeta = STEP_META[step - 1];

  return (
    <div className="w-full">
      <MobileLogo />

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/20
            text-emerald-400 px-[11px] py-[4px] rounded-full text-[0.66rem] font-semibold tracking-[0.1em] uppercase"
          >
            <Sparkles size={8} className="animate-pulse" /> Gratis untuk kandidat
          </span>
        </div>
        <h2 className="font-syne text-[1.9rem] font-extrabold text-[#e8f0ec] tracking-tight leading-[1.15] mb-2">
          Buat akun baru
        </h2>
        <p className="text-[#5a7a6a] text-[0.86rem]">
          Mulai analisis CV dengan AI — tidak perlu kartu kredit
        </p>
      </div>

      {/* ── Step meta & progress ── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <StepProgress current={step} total={TOTAL_STEPS} />
          <span className="text-[0.7rem] text-[#3a5444] font-medium">
            {step} / {TOTAL_STEPS}
          </span>
        </div>
        <p className="text-[0.78rem] font-semibold text-emerald-400 leading-none mb-[3px]">
          {currentMeta.title}
        </p>
        <p className="text-[0.7rem] text-[#3a5444]">{currentMeta.sub}</p>
      </div>

      {/* ── Progress bar ── */}
      <div className="w-full h-[2px] rounded-full bg-emerald-500/10 mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <ErrorBanner message={error} />

      {/* ── Form ── */}
      <form onSubmit={handleRegister} noValidate>
        {/* STEP 1 — Informasi Dasar */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
            <InputField
              id="name"
              label="Nama Lengkap"
              value={fullName}
              onChange={setFullName}
              placeholder="John Doe"
              required
              autoFocus
              icon={<User size={15} />}
              errorMessage={fieldErrors.fullName}
              onClearError={() => clearError("fullName")}
            />
            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="email@company.com"
              required
              icon={<Mail size={15} />}
              errorMessage={fieldErrors.email}
              onClearError={() => clearError("email")}
            />
            <div className="flex items-center gap-3 my-1">
              <Divider label="atau daftar cepat" />
            </div>
            <GoogleButton />
          </div>
        )}

        {/* STEP 2 — Keamanan Akun */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="password"
                className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none"
              >
                Password
              </label>
              <div
                className={`relative flex items-center rounded-[11px] border transition-all duration-200
                ${
                  fieldErrors.password
                    ? "border-red-500/50 bg-red-500/[0.04] shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
                    : "border-emerald-500/15 bg-[#0f1a14] focus-within:border-emerald-500 focus-within:bg-emerald-500/[0.05] focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.10)] hover:border-emerald-500/35 hover:bg-[#111d16]"
                }`}
              >
                <span
                  className={`absolute left-[13px] pointer-events-none ${
                    fieldErrors.password ? "text-red-400" : "text-[#4a6b58]"
                  }`}
                >
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
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
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-[13px] text-[#4a6b58] hover:text-emerald-400 transition-colors cursor-pointer flex items-center"
                  aria-label="Toggle password"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrengthBar password={password} />
              <FieldError message={fieldErrors.password} />
            </div>

            {/* Password rules checklist */}
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
                      }`}
                    >
                      {r.ok ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <span className="w-[4px] h-[4px] rounded-full bg-current" />
                      )}
                    </div>
                    <span
                      className={`text-[0.73rem] transition-colors duration-200 ${
                        r.ok ? "text-emerald-400" : "text-[#3a5444]"
                      }`}
                    >
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Pilih Peran */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none">
                Daftar Sebagai
              </label>
              <RoleSelect
                value={role}
                onChange={setRole}
                errorMessage={fieldErrors.role}
                onClearError={() => clearError("role")}
              />
            </div>
            <SummaryCard fullName={fullName} email={email} role={role} />
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div className={`flex gap-3 mt-5 ${step > 1 ? "justify-between" : ""}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-[7px] h-[46px] px-5 rounded-[11px]
                bg-transparent border border-emerald-500/15 text-[#7a9585]
                hover:border-emerald-500/35 hover:text-emerald-400 hover:bg-emerald-500/[0.05]
                text-[0.86rem] font-medium transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft size={14} /> Kembali
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 h-[46px] rounded-[11px]
                bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-[0.9rem]
                hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)]
                hover:-translate-y-[1px] active:translate-y-0 active:shadow-none
                transition-all duration-200 cursor-pointer"
            >
              Lanjut <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 h-[46px] rounded-[11px]
                bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-[0.9rem]
                hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)]
                hover:-translate-y-[1px] active:translate-y-0 active:shadow-none
                disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0
                transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Membuat akun...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Buat Akun Sekarang</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* ── Footer links ── */}
      <p className="text-center mt-6 text-[0.83rem] text-[#5a7a6a]">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
        >
          Masuk di sini →
        </Link>
      </p>

      <p className="text-center text-[0.7rem] text-[#2e4a3a] leading-relaxed mt-3">
        Dengan mendaftar, Anda menyetujui{" "}
        <Link
          href="/terms"
          className="text-[#4a6b58] hover:text-emerald-400 transition-colors underline underline-offset-2"
        >
          Syarat & Ketentuan
        </Link>{" "}
        serta{" "}
        <Link
          href="/privacy"
          className="text-[#4a6b58] hover:text-emerald-400 transition-colors underline underline-offset-2"
        >
          Kebijakan Privasi
        </Link>{" "}
        kami.
      </p>

      <div className="mt-5">
        <SecurityBadges />
      </div>
    </div>
  );
}
