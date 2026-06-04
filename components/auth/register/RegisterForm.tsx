"use client";

import { MobileLogo } from "@/components/auth/MobileLogo";
import { ErrorBanner } from "@/components/auth/ErrorBanner";
import { useAuthForm } from "@/hooks/auth/useAuthForm";

import { RegisterFormHeader } from "./RegisterFormHeader";
import { RegisterStepMeta } from "./RegisterStepMeta";
import { RegisterStep1 } from "./RegisterStep1";
import { RegisterStep2 } from "./RegisterStep2";
import { RegisterStep3 } from "./RegisterStep3";
import { RegisterNavButtons } from "./RegisterNavButtons";
import { RegisterFormFooter } from "./RegisterFormFooter";

export function RegisterForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    role,
    setRole,
    step,
    isFirstStep,
    isLastStep,
    loading,
    error,
    fieldErrors,
    clearError,
    showPass,
    togglePass,
    inputType,
    handleNext,
    handleBack,
    handleRegister,
  } = useAuthForm("register");

  return (
    <div className="w-full">
      <MobileLogo />
      <RegisterFormHeader />
      <RegisterStepMeta step={step} />
      <ErrorBanner message={error} />

      <form onSubmit={handleRegister} noValidate>
        {step === 1 && (
          <RegisterStep1
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            fieldErrors={fieldErrors}
            clearError={clearError}
          />
        )}

        {step === 2 && (
          <RegisterStep2
            password={password}
            setPassword={setPassword}
            showPass={showPass}
            togglePass={togglePass}
            inputType={inputType}
            fieldErrors={fieldErrors}
            clearError={clearError}
          />
        )}

        {step === 3 && (
          <RegisterStep3
            role={role}
            setRole={setRole}
            fullName={fullName}
            email={email}
            fieldErrors={fieldErrors}
            clearError={clearError}
          />
        )}

        <RegisterNavButtons
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          loading={loading}
          onBack={handleBack}
          onNext={handleNext}
        />
      </form>

      <RegisterFormFooter />
    </div>
  );
}
