import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/auth/Spinner";

interface LoginSubmitButtonProps {
  loading: boolean;
}

export function LoginSubmitButton({ loading }: LoginSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="relative w-full h-[46px] rounded-[11px] overflow-hidden
        bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-[0.9rem]
        flex items-center justify-center gap-2
        hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)]
        hover:-translate-y-[1px] active:translate-y-0 active:shadow-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
        transition-all duration-200 cursor-pointer mt-1">
      {loading ? (
        <>
          <Spinner />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          Sign In to Dashboard
          <ArrowRight size={15} />
        </>
      )}
    </button>
  );
}
