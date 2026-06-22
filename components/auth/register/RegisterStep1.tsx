"use client";

import { Mail, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { InputField } from "@/components/auth/InputField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";
import type { AuthFieldErrors } from "@/lib/auth/validation";

interface RegisterStep1Props {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  fieldErrors: Partial<AuthFieldErrors>;
  clearError: (field: keyof AuthFieldErrors) => void;
}

export function RegisterStep1({
  fullName,
  setFullName,
  email,
  setEmail,
  fieldErrors,
  clearError,
}: RegisterStep1Props) {
  const handleGoogleRegister = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
      <InputField
        id="name"
        label="Full Name"
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
        <Divider label="or sign up quickly" />
      </div>
      <GoogleButton label="Sign up with Google" onClick={handleGoogleRegister} />
    </div>
  );
}