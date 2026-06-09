import { AlertCircle } from "lucide-react";

export function ProfileFormField({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-[0.72rem] font-semibold text-[#7a9585] mb-[6px] block tracking-[0.06em] uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[0.7rem] text-red-400 mt-[5px]">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-[0.7rem] text-[#7a9585] mt-[5px]">{hint}</p>
      )}
    </div>
  );
}
