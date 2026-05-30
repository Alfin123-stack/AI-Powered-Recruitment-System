// SERVER Component — tidak ada directive "use client".
// Render daftar benefit dengan icon CheckCircle2. Pure HTML statis.

import { CheckCircle2 } from "lucide-react";

type JobBenefitsProps = {
  benefits: string[];
  accent: string;
};

export default function JobBenefits({ benefits, accent }: JobBenefitsProps) {
  if (!benefits?.length) return null;

  const visible = benefits.slice(0, 3);

  return (
    <div className="flex flex-wrap gap-[6px]">
      {visible.map((benefit) => (
        <span
          key={benefit}
          className="flex items-center gap-[3px] text-[#5d7a6a] text-[0.67rem]"
        >
          <CheckCircle2 size={10} style={{ color: accent }} />
          {benefit}
        </span>
      ))}
    </div>
  );
}
