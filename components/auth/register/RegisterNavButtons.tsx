import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Spinner } from "@/components/auth/Spinner";

interface RegisterNavButtonsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function RegisterNavButtons({
  isFirstStep,
  isLastStep,
  loading,
  onBack,
  onNext,
}: RegisterNavButtonsProps) {
  return (
    <div className={`flex gap-3 mt-5 ${!isFirstStep ? "justify-between" : ""}`}>
      {!isFirstStep && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-[7px] h-[46px] px-5 rounded-[11px]
            bg-transparent border border-emerald-500/15 text-[#7a9585]
            hover:border-emerald-500/35 hover:text-emerald-400 hover:bg-emerald-500/[0.05]
            text-[0.86rem] font-medium transition-all duration-200 cursor-pointer">
          <ArrowLeft size={14} /> Back
        </button>
      )}

      {!isLastStep ? (
        <button
          type="button"
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 h-[46px] rounded-[11px]
            bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-[0.9rem]
            hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)]
            hover:-translate-y-[1px] active:translate-y-0 active:shadow-none
            transition-all duration-200 cursor-pointer">
          Next <ArrowRight size={15} />
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 h-[46px] rounded-[11px]
            bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-[0.9rem]
            hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)]
            hover:-translate-y-[1px] active:translate-y-0 active:shadow-none
            disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0
            transition-all duration-200 cursor-pointer">
          {loading ? (
            <>
              <Spinner />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>Create Account Now</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
