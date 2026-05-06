// app/(auth)/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const token = data.session?.access_token;
    localStorage.setItem("token", token!);
    router.push("/dashboard");
    setLoading(false);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/");
    };
    checkSession();
  }, [router]);

  return (
    <div className="w-full">
      {/* Mobile logo — hidden on desktop (layout shows it on left panel) */}
      <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base font-extrabold text-black bg-gradient-to-br from-emerald-500 to-cyan-400">
          ✦
        </div>
        <span className="font-syne text-[1.4rem] font-extrabold tracking-tight text-[#e8f0ec]">
          Recruit<em className="not-italic text-emerald-400">AI</em>
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[1.8rem] font-extrabold text-[#e8f0ec] tracking-tight mb-1">
          Selamat datang kembali
        </h2>
        <p className="text-[#7a9585] text-[0.88rem]">
          Masuk ke dashboard rekrutmen Anda
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[0.75rem] font-semibold text-[#7a9585] tracking-[0.06em] uppercase">
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
              required
              className="pl-[42px] bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.5)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 focus:bg-emerald-500/[0.04] h-11"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[0.75rem] font-semibold text-[#7a9585] tracking-[0.06em] uppercase">
              Password
            </Label>
            <a
              href="#"
              className="text-emerald-400 text-xs font-semibold hover:opacity-75 transition-opacity">
              Lupa password?
            </a>
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
            />
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              required
              className="pl-[42px] pr-[42px] bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.5)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 focus:bg-emerald-500/[0.04] h-11"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-emerald-400 transition-colors bg-transparent border-0 p-0 cursor-pointer flex"
              aria-label="Toggle password">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px] h-11 hover:shadow-[0_6px_24px_rgba(16,185,129,0.35)] hover:-translate-y-[1px] active:translate-y-0 transition-all">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="animate-spin" />
              Logging in...
            </span>
          ) : (
            "Masuk →"
          )}
        </Button>
      </form>

      {/* Separator */}
      <div className="flex items-center gap-3 my-6">
        <Separator className="flex-1 bg-emerald-500/15" />
        <span className="text-[#7a9585] text-xs whitespace-nowrap">
          atau lanjutkan dengan
        </span>
        <Separator className="flex-1 bg-emerald-500/15" />
      </div>

      {/* Google */}
      <Button
        variant="outline"
        className="w-full bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] rounded-[10px] h-11 hover:bg-emerald-500/[0.06] hover:border-emerald-500/30 transition-all">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className="flex-shrink-0 mr-2">
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

      {/* Footer */}
      <p className="text-center mt-6 text-[0.82rem] text-[#7a9585]">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-emerald-400 font-semibold hover:opacity-75 transition-opacity">
          Daftar sekarang
        </Link>
      </p>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 mt-5 text-[rgba(122,149,133,0.6)] text-[0.7rem]">
        <span>🔒 SSL Encrypted</span>
        <span className="w-[3px] h-[3px] rounded-full bg-[rgba(122,149,133,0.4)]" />
        <span>🛡️ PDPA Compliant</span>
        <span className="w-[3px] h-[3px] rounded-full bg-[rgba(122,149,133,0.4)]" />
        <span>✦ RecruitAI</span>
      </div>
    </div>
  );
}
