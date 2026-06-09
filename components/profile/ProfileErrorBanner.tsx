import { AlertCircle } from "lucide-react";

export function ProfileErrorBanner({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2 mb-4">
      <AlertCircle size={13} /> {msg}
    </div>
  );
}
