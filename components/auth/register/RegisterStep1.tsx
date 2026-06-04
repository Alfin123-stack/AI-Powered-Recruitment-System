import { Mail, User } from "lucide-react";
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
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
      <InputField
        id="name"
        label="Nama Lengkap"
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
        <Divider label="atau daftar cepat" />
      </div>
      <GoogleButton />
    </div>
  );
}
