"use client";

import { ErrorBanner } from "@/components/auth/ErrorBanner";
import { useAuthForm } from "@/hooks/auth/useAuthForm";

import { LoginGoogleSection } from "./LoginGoogleSection";
import { LoginEmailField } from "./LoginEmailField";
import { LoginPasswordField } from "./LoginPasswordField";
import { LoginSubmitButton } from "./LoginSubmitButton";

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    fieldErrors,
    clearError,
    showPass,
    togglePass,
    inputType,
    handleLogin,
  } = useAuthForm("login");

  return (
    <>
      <LoginGoogleSection />
      <ErrorBanner message={error} />

      <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
        <LoginEmailField
          email={email}
          setEmail={setEmail}
          fieldErrors={fieldErrors}
          clearError={clearError}
        />
        <LoginPasswordField
          password={password}
          setPassword={setPassword}
          showPass={showPass}
          togglePass={togglePass}
          inputType={inputType}
          fieldErrors={fieldErrors}
          clearError={clearError}
        />
        <LoginSubmitButton loading={loading} />
      </form>
    </>
  );
} 