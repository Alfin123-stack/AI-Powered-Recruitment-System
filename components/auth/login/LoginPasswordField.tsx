import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";
import { InputField } from "@/components/auth/InputField";
import type { AuthFieldErrors } from "@/lib/auth/validation";

interface LoginPasswordFieldProps {
  password: string;
  setPassword: (v: string) => void;
  showPass: boolean;
  togglePass: () => void;
  inputType: string;
  fieldErrors: Partial<AuthFieldErrors>;
  clearError: (field: keyof AuthFieldErrors) => void;
}

export function LoginPasswordField({
  password,
  setPassword,
  showPass,
  togglePass,
  inputType,
  fieldErrors,
  clearError,
}: LoginPasswordFieldProps) {
  return (
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
          Forgot password?
        </Link>
      </div>

      <InputField
        id="password"
        type={inputType}
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        required
        icon={<Lock size={15} />}
        suffix={
          <button
            type="button"
            onClick={togglePass}
            className="text-[#4a6b58] hover:text-emerald-400 transition-colors cursor-pointer flex items-center"
            aria-label="Toggle password visibility">
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
        errorMessage={fieldErrors.password}
        onClearError={() => clearError("password")}
      />
    </div>
  );
}
