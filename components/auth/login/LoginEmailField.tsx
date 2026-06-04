import { Mail } from "lucide-react";
import { InputField } from "@/components/auth/InputField";
import type { AuthFieldErrors } from "@/lib/auth/validation";

interface LoginEmailFieldProps {
  email: string;
  setEmail: (v: string) => void;
  fieldErrors: Partial<AuthFieldErrors>;
  clearError: (field: keyof AuthFieldErrors) => void;
}

export function LoginEmailField({
  email,
  setEmail,
  fieldErrors,
  clearError,
}: LoginEmailFieldProps) {
  return (
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
  );
}
