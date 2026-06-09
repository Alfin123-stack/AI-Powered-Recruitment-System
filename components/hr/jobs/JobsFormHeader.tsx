import { X, Pencil, Sparkles } from "lucide-react";

interface JobsFormHeaderProps {
  isEdit: boolean;
  onClose: () => void;
}

export function JobsFormHeader({ isEdit, onClose }: JobsFormHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          {isEdit ? <Pencil size={15} /> : <Sparkles size={15} />}
        </div>
        <div>
          <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
            {isEdit ? "Edit Job Listing" : "Create New Job Listing"}
          </h2>
          <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
            {isEdit
              ? "Update job listing details"
              : "Fill in details to publish"}
          </p>
        </div>
      </div>
      <button
        title="close"
        onClick={onClose}
        className="w-8 h-8 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
}
