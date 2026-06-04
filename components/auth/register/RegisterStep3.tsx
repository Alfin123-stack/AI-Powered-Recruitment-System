import { RoleSelect } from "@/components/auth/register/RoleSelect";
import { SummaryCard } from "@/components/auth/register/SummaryCard";
import type { AuthFieldErrors } from "@/lib/auth/validation";

interface RegisterStep3Props {
  role: string;
  setRole: (v: string) => void;
  fullName: string;
  email: string;
  fieldErrors: Partial<AuthFieldErrors>;
  clearError: (field: keyof AuthFieldErrors) => void;
}

export function RegisterStep3({
  role,
  setRole,
  fullName,
  email,
  fieldErrors,
  clearError,
}: RegisterStep3Props) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-250">
      <div className="flex flex-col gap-[6px]">
        <label className="text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.08em] uppercase select-none">
          Daftar Sebagai
        </label>
        <RoleSelect
          value={role}
          onChange={setRole}
          errorMessage={fieldErrors.role}
          onClearError={() => clearError("role")}
        />
      </div>
      <SummaryCard fullName={fullName} email={email} role={role} />
    </div>
  );
}
