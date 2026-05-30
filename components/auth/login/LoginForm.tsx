// @/components/auth/login/LoginForm.tsx
// Rendering Strategy: Client Component (CSR)
// Alasan: Butuh useState (email, password, loading, errors), event handler form,
// router.push setelah login, dan toggle show/hide password.
// Tidak mungkin dijalankan di server — harus "use client".

"use client";

import { useState }        from "react";
import Link                from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter }       from "next/navigation";
import { supabase }        from "@/lib/supabase";

import { Spinner }         from "@/components/auth/Spinner";
import { InputField }      from "@/components/auth/InputField";
import { GoogleButton }    from "@/components/auth/GoogleButton";
import { Divider }         from "@/components/auth/Divider";
import { ErrorBanner }     from "@/components/auth/ErrorBanner";
import {
  type AuthFieldErrors,
  validateEmail,
  validatePassword,
} from "@/lib/auth/validation";

export function LoginForm() {
  const [showPass, setShowPass]     = useState(false);
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const router = useRouter();

  // ─── Handlers ────────────────────────────────────────────────────────────

  const clearError = (field: keyof AuthFieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi client-side sebelum hit API
    const errors: AuthFieldErrors = {};
    const emailErr = validateEmail(email);
    const passErr  = validatePassword(password);
    if (emailErr) errors.email    = emailErr;
    if (passErr)  errors.password = passErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    const role = data.session?.user?.user_metadata?.role;
    router.push(role === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Google OAuth — CSR karena memicu redirect OAuth */}
      <GoogleButton label="Lanjutkan dengan Google" />

      <div className="my-5">
        <Divider label="atau masuk dengan email" />
      </div>

      {/* Banner error dari Supabase */}
      <ErrorBanner message={error} />

      <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
        {/* Email */}
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

        {/* Password + Lupa Password */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[0.75rem] text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              Lupa password?
            </Link>
          </div>

          <InputField
            id="password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Masukkan password"
            required
            icon={<Lock size={15} />}
            suffix={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-[#4a6b58] hover:text-emerald-400 transition-colors cursor-pointer flex items-center"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            errorMessage={fieldErrors.password}
            onClearError={() => clearError("password")}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full h-[46px] rounded-[11px] overflow-hidden
            bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-[0.9rem]
            flex items-center justify-center gap-2
            hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)]
            hover:-translate-y-[1px] active:translate-y-0 active:shadow-none
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
            transition-all duration-200 cursor-pointer mt-1"
        >
          {loading ? (
            <>
              <Spinner />
              <span>Sedang masuk...</span>
            </>
          ) : (
            <>
              Masuk ke Dashboard
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>
    </>
  );
}
