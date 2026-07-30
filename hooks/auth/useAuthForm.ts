"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  type AuthFieldErrors,
  validateEmail,
  validatePassword,
  validateFullName,
  validateRole,
  validateStrongPassword,
} from "@/lib/auth/validation";

import { useFieldErrors } from "@/hooks/auth/useFieldErrors";
import { usePasswordToggle } from "@/hooks/auth/usePasswordToggle";
import { TOTAL_STEPS } from "@/constants/auth/auth";

type AuthMode = "login" | "register";

const GOOGLE_STEP = 3;

// ─── Auth error message helper (di dalam file ini, tidak perlu import terpisah) ──

function getAuthErrorMessage(err: unknown): string {
  // Network / fetch gagal total (server tidak terjangkau, offline, dsb)
  if (err instanceof TypeError && err.message === "Failed to fetch") {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.";
  }

  const message = err instanceof Error ? err.message : "";

  const map: Record<string, string> = {
    "Invalid login credentials": "Email atau password yang Anda masukkan salah.",
    "Email not confirmed": "Email Anda belum diverifikasi. Silakan cek inbox Anda.",
    "User already registered": "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.",
    "Password should be at least 6 characters": "Password minimal harus 6 karakter.",
    "Too many requests": "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi.",
  };

  return map[message] ?? "Terjadi kesalahan. Silakan coba lagi.";
}

export function useAuthForm(mode: AuthMode) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isGoogleProvider =
    mode === "register" && (
      searchParams.get("provider") === "google" ||
      pathname === "/onboarding/role"
    );

  const { fieldErrors, setFieldErrors, clearError, clearAll } = useFieldErrors();
  const { showPass, togglePass, inputType } = usePasswordToggle();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (mode === "register" && isGoogleProvider) {
      setStep(GOOGLE_STEP);
      // Sonner hint untuk Google onboarding
      toast.info("One more step!", {
        description: "Please choose your role to complete your account setup.",
        duration: 5000,
      });
    }
  }, [mode, isGoogleProvider]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateRegisterStep = useCallback(
    (currentStep: number): AuthFieldErrors => {
      const errors: AuthFieldErrors = {};
      if (currentStep === 1) {
        const nameErr = validateFullName(fullName);
        const emailErr = validateEmail(email);
        if (nameErr) errors.fullName = nameErr;
        if (emailErr) errors.email = emailErr;
      }
      if (currentStep === 2) {
        const passErr = validateStrongPassword(password);
        if (passErr) errors.password = passErr;
      }
      if (currentStep === 3) {
        const roleErr = validateRole(role);
        if (roleErr) errors.role = roleErr;
      }
      return errors;
    },
    [fullName, email, password, role]
  );

  const handleNext = useCallback(() => {
    const errors = validateRegisterStep(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    clearAll();
    setStep((s) => s + 1);
  }, [step, validateRegisterStep, setFieldErrors, clearAll]);

  const handleBack = useCallback(() => {
    clearAll();
    if (isGoogleProvider && step <= GOOGLE_STEP) return;
    setStep((s) => s - 1);
  }, [clearAll, isGoogleProvider, step]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const errors: AuthFieldErrors = {};
      const emailErr = validateEmail(email);
      const passErr = validatePassword(password);
      if (emailErr) errors.email = emailErr;
      if (passErr) errors.password = passErr;

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      clearAll();
      setLoading(true);

      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword(
          { email, password }
        );

        if (authError) {
          setError(getAuthErrorMessage(authError));
          return;
        }

        toast.success("Welcome back!", {
          description: "You have successfully signed in.",
        });

        const userRole = data.session?.user?.user_metadata?.role;
        router.push(userRole === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
      } catch (err) {
        setError(getAuthErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [email, password, router, setFieldErrors, clearAll]
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateRegisterStep(step);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      setError("");
      setLoading(true);

      try {
        if (isGoogleProvider) {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            setError("Sesi tidak ditemukan. Silakan coba masuk kembali.");
            return;
          }

          const { error: upsertError } = await supabase.from("users").upsert(
            {
              id: user.id,
              email: user.email,
              full_name:
                user.user_metadata?.full_name ??
                user.user_metadata?.name ??
                user.email,
              role,
            },
            { onConflict: "id" }
          );

          if (upsertError) {
            setError(getAuthErrorMessage(upsertError));
            return;
          }

          toast.success("Account setup complete!", {
            description: "Welcome to RecruitAI!",
          });

          router.push(role === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role } },
        });

        if (signUpError) {
          setError(getAuthErrorMessage(signUpError));
          return;
        }

        toast.success("Account created!", {
          description: "Please check your email to verify your account.",
        });

        router.push("/login?registered=1");
      } catch (err) {
        setError(getAuthErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [step, validateRegisterStep, setFieldErrors, email, password, fullName, role, router, isGoogleProvider]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    role,
    setRole,
    step,
    isFirstStep: isGoogleProvider ? true : step === 1,
    isLastStep: step === TOTAL_STEPS,
    isGoogleProvider,
    showPass,
    togglePass,
    inputType,
    loading,
    error,
    fieldErrors,
    clearError,
    handleLogin,
    handleNext,
    handleBack,
    handleRegister,
  } as const;
}