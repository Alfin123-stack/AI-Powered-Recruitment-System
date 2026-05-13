// app/(auth)/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
      />
    </svg>
  );
}

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  suffix,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-[6px]">
      <label
        htmlFor={id}
        className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none">
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-[11px] border transition-all duration-200
        ${
          focused
            ? "border-emerald-500 bg-emerald-500/[0.05] shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
            : "border-emerald-500/15 bg-[#0f1a14] hover:border-emerald-500/35 hover:bg-[#111d16]"
        }`}>
        <span
          className={`absolute left-[13px] pointer-events-none transition-colors duration-200 ${focused ? "text-emerald-400" : "text-[#4a6b58]"}`}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          className="w-full h-[46px] pl-[42px] pr-[42px] bg-transparent text-[0.88rem] text-[#e8f0ec]
            placeholder:text-[#2e4a3a] outline-none rounded-[11px]"
        />
        {suffix && <span className="absolute right-[13px]">{suffix}</span>}
      </div>
      {hint && <p className="text-[0.7rem] text-[#4a6b58]">{hint}</p>}
    </div>
  );
}

function GoogleButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-[10px] h-[46px] rounded-[11px]
        bg-[#0f1a14] border border-emerald-500/15 text-[#c5d8cc] text-[0.86rem] font-medium
        hover:bg-[#111d16] hover:border-emerald-500/30 hover:text-[#e8f0ec]
        active:scale-[0.98] transition-all duration-200 cursor-pointer">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Lanjutkan dengan Google
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-emerald-500/10" />
      <span className="text-[#3a5444] text-[0.72rem] whitespace-nowrap font-medium">
        {label}
      </span>
      <div className="flex-1 h-px bg-emerald-500/10" />
    </div>
  );
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Redirect ke dashboard sesuai role jika sudah login
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const role = data.session.user.user_metadata?.role;
        router.replace(
          role === "hr" ? "/dashboard/hr/overview" : "/dashboard/candidate",
        );
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ✅ Hapus localStorage — session sudah disimpan ke cookie oleh createBrowserClient
    // ✅ Redirect berdasarkan role
    const role = data.session?.user?.user_metadata?.role;
    router.push(
      role === "hr" ? "/dashboard/hr/overview" : "/dashboard/candidate",
    );
  };

  return (
    <div className="w-full">
      {/* Mobile logo */}
      <div className="flex lg:hidden items-center justify-center gap-[9px] mb-8">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center font-black text-black text-[1rem]
          bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
          ✦
        </div>
        <span className="font-syne text-[1.25rem] font-extrabold tracking-[-0.02em] text-[#e8f0ec]">
          Recruit
          <em className="not-italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            AI
          </em>
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/20
            text-emerald-400 px-[11px] py-[4px] rounded-full text-[0.66rem] font-semibold tracking-[0.1em] uppercase">
            <Sparkles size={8} className="animate-pulse" /> Masuk ke akun
          </span>
        </div>
        <h2 className="font-syne text-[1.9rem] font-extrabold text-[#e8f0ec] tracking-tight leading-[1.15] mb-2">
          Selamat datang kembali
        </h2>
        <p className="text-[#5a7a6a] text-[0.86rem] leading-relaxed">
          Masuk ke dashboard rekrutmen dan mulai analisis CV Anda
        </p>
      </div>

      {/* Google */}
      <GoogleButton />

      <div className="my-5">
        <Divider label="atau masuk dengan email" />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 flex items-start gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-[10px] px-4 py-3">
          <span className="text-red-400 text-[0.85rem] mt-[1px] flex-shrink-0">
            ⚠
          </span>
          <p className="text-red-400 text-[0.82rem] leading-[1.5]">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <InputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="email@company.com"
          required
          icon={<Mail size={15} />}
        />

        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[0.75rem] text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
              Lupa password?
            </Link>
          </div>
          <InputField
            id="password"
            label=""
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
                aria-label="Toggle password">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="relative w-full h-[46px] rounded-[11px] overflow-hidden
            bg-gradient-to-r from-emerald-500 to-emerald-400
            text-black font-bold text-[0.9rem]
            flex items-center justify-center gap-2
            hover:from-emerald-400 hover:to-cyan-400
            hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)]
            hover:-translate-y-[1px]
            active:translate-y-0 active:shadow-none
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
            transition-all duration-200 cursor-pointer mt-1">
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

      {/* Footer links */}
      <p className="text-center mt-6 text-[0.83rem] text-[#5a7a6a]">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
          Daftar gratis →
        </Link>
      </p>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-[10px] mt-6 flex-wrap">
        {[
          { icon: "🔒", label: "SSL Encrypted" },
          { icon: "🛡️", label: "PDPA Compliant" },
          { icon: <Shield size={10} />, label: "Data Aman" },
        ].map((b, i) => (
          <span
            key={i}
            className="flex items-center gap-[5px] text-[#2e4a3a] text-[0.68rem] font-medium">
            <span className="opacity-60">{b.icon}</span>
            {b.label}
            {i < 2 && (
              <span className="ml-[10px] w-[3px] h-[3px] rounded-full bg-[#2e4a3a]" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
