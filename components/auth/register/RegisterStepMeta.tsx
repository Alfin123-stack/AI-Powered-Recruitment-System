import { StepProgress } from "@/components/auth/register/StepProgress";
import { STEP_META, TOTAL_STEPS } from "@/constants/auth";

interface RegisterStepMetaProps {
  step: number;
}

export function RegisterStepMeta({ step }: RegisterStepMetaProps) {
  const currentMeta = STEP_META[step - 1];

  return (
    <>
      {/* ── Step counter & dot progress ── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <StepProgress current={step} total={TOTAL_STEPS} />
          <span className="text-[0.7rem] text-[#3a5444] font-medium">
            {step} / {TOTAL_STEPS}
          </span>
        </div>
        <p className="text-[0.78rem] font-semibold text-emerald-400 leading-none mb-[3px]">
          {currentMeta.title}
        </p>
        <p className="text-[0.7rem] text-[#3a5444]">{currentMeta.sub}</p>
      </div>

      {/* ── Progress bar ── */}
      <div className="w-full h-[2px] rounded-full bg-emerald-500/10 mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </>
  );
}
