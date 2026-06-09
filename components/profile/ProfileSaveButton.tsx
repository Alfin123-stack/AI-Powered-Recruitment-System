import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileSaveButton({
  loading,
  saved,
  onClick,
  label = "Simpan Perubahan",
}: {
  loading: boolean;
  saved: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={`px-6 py-[10px] rounded-[10px] font-bold text-[0.88rem] transition-all
        ${
          saved
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default"
            : "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
        }`}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin mr-2" />
      ) : saved ? (
        <Check size={15} className="mr-2" />
      ) : null}
      {loading ? "Menyimpan..." : saved ? "Tersimpan!" : label}
    </Button>
  );
}
