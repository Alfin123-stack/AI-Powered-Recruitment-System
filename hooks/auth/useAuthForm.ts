// hooks/auth/useAuthForm.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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

export function useAuthForm(mode: AuthMode) {
  const router = useRouter();

  // ── Sub-hooks ────────────────────────────────────────────────────────────
  const { fieldErrors, setFieldErrors, clearError, clearAll } =
    useFieldErrors();
  const { showPass, togglePass, inputType } = usePasswordToggle();

  // ── Shared field state ───────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── Register-only field state ────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");

  // ── Multi-step state (register only) ────────────────────────────────────
  const [step, setStep] = useState(1);

  // ── Async state ──────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Per-step validation (register) ──────────────────────────────────────
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
    [fullName, email, password, role],
  );

  // ── Register navigation ──────────────────────────────────────────────────
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
    setStep((s) => s - 1);
  }, [clearAll]);

  // ── Login submit ─────────────────────────────────────────────────────────
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

      const { data, error: authError } = await supabase.auth.signInWithPassword(
        { email, password },
      );

      setLoading(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      const userRole = data.session?.user?.user_metadata?.role;
      router.push(userRole === "hr" ? "/dashboard/hr" : "/dashboard/candidate");
    },
    [email, password, router, setFieldErrors, clearAll],
  );

  // ── Register submit ──────────────────────────────────────────────────────
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
    },
    [
      step,
      validateRegisterStep,
      setFieldErrors,
      email,
      password,
      fullName,
      role,
      router,
    ],
  );

  // ── Return ───────────────────────────────────────────────────────────────
  return {
    // shared fields
    email,
    setEmail,
    password,
    setPassword,

    // register-only fields
    fullName,
    setFullName,
    role,
    setRole,

    // step helpers (register)
    step,
    isFirstStep: step === 1,
    isLastStep: step === TOTAL_STEPS,

    // from usePasswordToggle
    showPass,
    togglePass,
    inputType,

    // async state
    loading,
    error,

    // from useFieldErrors
    fieldErrors,
    clearError,

    // handlers
    handleLogin,
    handleNext,
    handleBack,
    handleRegister,
  } as const;
}
