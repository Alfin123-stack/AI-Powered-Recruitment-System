// app/register/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

// ── Password strength helper ──────────────────────────────────────────────────
function getStrength(pw: string) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthMeta = [
  { label: "Terlalu pendek", color: "bg-red-500" },
  { label: "Lemah", color: "bg-orange-400" },
  { label: "Sedang", color: "bg-yellow-400" },
  { label: "Kuat", color: "bg-emerald-400" },
  { label: "Sangat kuat", color: "bg-emerald-500" },
];

function PasswordStrength({ password }: { password: string }) {
  const strength = getStrength(password);
  const meta = strengthMeta[strength];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
              i < strength ? meta.color : "bg-white/[0.07]"
            }`}
          />
        ))}
      </div>
      <span className="text-[0.7rem] text-[#7a9585]">
        {password ? meta.label : "Gunakan kombinasi huruf, angka & simbol"}
      </span>
    </div>
  );
}

// ── Step dot ──────────────────────────────────────────────────────────────────
function StepDot({
  n,
  state,
}: {
  n: number;
  state: "active" | "done" | "idle";
}) {
  const styles = {
    active:
      "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    done: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    idle: "bg-[#141f19] text-[#7a9585] border-[rgba(16,185,129,0.15)]",
  };
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-bold border transition-all duration-300 ${styles[state]}`}>
      {state === "done" ? "✓" : n}
    </div>
  );
}

// ── Custom Role Select ────────────────────────────────────────────────────────
const roles = [
  {
    value: "candidate",
    label: "Candidate",
    sub: "Pencari kerja / job seeker",
    icon: <User size={16} />,
  },
  {
    value: "hr",
    label: "HR / Company",
    sub: "Rekruter atau tim HR perusahaan",
    icon: <Building2 size={16} />,
  },
];

function RoleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = roles.find((r) => r.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full bg-[#141f19] border rounded-[10px] px-[14px] py-3 text-[0.88rem] cursor-pointer flex items-center justify-between transition-all duration-200 outline-none
          ${
            open
              ? "border-emerald-500 bg-emerald-500/[0.04] shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
              : "border-emerald-500/15 hover:border-emerald-500 hover:bg-emerald-500/[0.04]"
          }`}>
        {selected ? (
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">{selected.icon}</span>
            <span className="font-medium text-[#e8f0ec]">{selected.label}</span>
            <span className="text-[#7a9585] text-[0.75rem]">
              — {selected.sub}
            </span>
          </div>
        ) : (
          <span className="text-[rgba(122,149,133,0.45)]">
            Pilih peran Anda
          </span>
        )}
        <ChevronDown
          size={16}
          className={`text-[#7a9585] flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 !text-emerald-400" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#0f1612] border border-emerald-500/35 rounded-[12px] overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-1 duration-200">
          {roles.map((r, idx) => (
            <div
              key={r.value}
              onClick={() => {
                onChange(r.value);
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-[13px] cursor-pointer transition-colors
                ${idx < roles.length - 1 ? "border-b border-emerald-500/15" : ""}
                ${value === r.value ? "bg-emerald-500/10" : "hover:bg-emerald-500/[0.07]"}`}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                {r.icon}
              </div>
              <div>
                <div className="font-semibold text-[0.88rem] text-[#e8f0ec]">
                  {r.label}
                </div>
                <div className="text-[0.75rem] text-[#7a9585] mt-[1px]">
                  {r.sub}
                </div>
              </div>
              {value === r.value && (
                <span className="ml-auto text-emerald-400 text-[0.8rem]">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // REGISTER
  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (!role) {
      alert("Pilih role dulu");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Cek email untuk verifikasi!");
    router.push("/login");
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 60% 50% at 20% 20%, rgba(16,185,129,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 80% 80%, rgba(6,182,212,0.05) 0%, transparent 60%),
          #0a0f0d
        `,
      }}>
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Rings — keep in global CSS or tailwind.config animate */}
      {[
        { size: 500, cls: "animate-[spin_30s_linear_infinite]" },
        { size: 720, cls: "animate-[spin_48s_linear_infinite_reverse]" },
      ].map(({ size, cls }) => (
        <div
          key={size}
          className={`absolute rounded-full pointer-events-none border border-emerald-500/[0.07] ${cls}`}
          style={{
            width: size,
            height: size,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-[#0f1612] border border-emerald-500/15 rounded-[20px] px-9 pt-9 pb-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-6 duration-500">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-[6px]">
          <div
            className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[0.95rem] font-extrabold text-black"
            style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>
            ✦
          </div>
          <span className="font-syne text-[1.35rem] font-extrabold tracking-tight text-[#e8f0ec]">
            Recruit<em className="not-italic text-emerald-400">AI</em>
          </span>
        </div>
        <p className="text-center text-[#7a9585] text-[0.83rem] leading-relaxed mb-7">
          Buat akun baru dan mulai analisis CV dengan AI
        </p>

        {/* Steps */}
        <div className="flex items-center justify-center mb-7">
          <StepDot n={1} state="active" />
          <div className="w-10 h-px bg-emerald-500/15" />
          <StepDot n={2} state="idle" />
          <div className="w-10 h-px bg-emerald-500/15" />
          <StepDot n={3} state="idle" />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <Label
              htmlFor="name"
              className="text-[0.75rem] font-semibold text-[#7a9585] tracking-[0.07em] uppercase">
              Full Name
            </Label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="pl-[42px] bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-[0.75rem] font-semibold text-[#7a9585] tracking-[0.07em] uppercase">
              Email
            </Label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="pl-[42px] bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="text-[0.75rem] font-semibold text-[#7a9585] tracking-[0.07em] uppercase">
              Password
            </Label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-[42px] pr-[42px] bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-emerald-400 transition-colors bg-transparent border-0 p-0 cursor-pointer flex">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          {/* Role */}
          <div>
            <Label className="text-[0.75rem] font-semibold text-[#7a9585] tracking-[0.07em] uppercase">
              Register As
            </Label>
            <RoleSelect value={role} onChange={setRole} />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px] py-[13px] hover:shadow-[0_6px_24px_rgba(16,185,129,0.35)] hover:-translate-y-[1px] active:translate-y-0 transition-all">
            {loading ? (
              <span className="flex items-center justify-center">
                <Spinner className="animate-spin mr-2" />
                Creating account...
              </span>
            ) : (
              "Buat Akun →"
            )}
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-emerald-500/15" />
          <span className="text-[#7a9585] text-[0.72rem] whitespace-nowrap">
            atau daftar dengan
          </span>
          <div className="flex-1 h-px bg-emerald-500/15" />
        </div>

        {/* Google */}
        <Button
          variant="outline"
          className="w-full bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] rounded-[10px]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="flex-shrink-0">
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
          Continue with Google
        </Button>

        <p className="text-center mt-5 text-[0.82rem] text-[#7a9585]">
          Sudah punya akun?
          <Link
            href="/login"
            className="text-emerald-400 font-semibold ml-1 hover:opacity-75 transition-opacity">
            Masuk di sini
          </Link>
        </p>

        <p className="text-center text-[0.72rem] text-[#7a9585] leading-relaxed mt-4">
          Dengan mendaftar, Anda menyetujui{" "}
          <a
            href="#"
            className="text-emerald-400 hover:opacity-75 transition-opacity">
            Syarat & Ketentuan
          </a>{" "}
          serta{" "}
          <a
            href="#"
            className="text-emerald-400 hover:opacity-75 transition-opacity">
            Kebijakan Privasi
          </a>{" "}
          kami.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-[rgba(122,149,133,0.55)] text-[0.7rem]">
          <span>🔒 SSL Encrypted</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[rgba(122,149,133,0.35)]" />
          <span>🛡️ PDPA Compliant</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[rgba(122,149,133,0.35)]" />
          <span>✦ RecruitAI</span>
        </div>
      </div>
    </div>
  );
}
