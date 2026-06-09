import { Loader2, Pencil, Sparkles } from "lucide-react";

interface JobsFormFooterProps {
  isEdit: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function JobsFormFooter({
  isEdit,
  loading,
  onClose,
  onSubmit,
}: JobsFormFooterProps) {
  return (
    <div className="flex gap-2 px-6 py-4 border-t border-emerald-500/10 bg-[#080f0b] flex-shrink-0">
      <button
        onClick={onClose}
        className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer">
        Batal
      </button>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 py-[10px] rounded-[10px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.82rem] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Menyimpan...
          </>
        ) : isEdit ? (
          <>
            <Pencil size={14} />
            Simpan Perubahan
          </>
        ) : (
          <>
            <Sparkles size={14} />
            Publikasikan Lowongan
          </>
        )}
      </button>
    </div>
  );
}
