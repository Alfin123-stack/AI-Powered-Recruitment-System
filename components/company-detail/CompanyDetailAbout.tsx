// SERVER Component — no "use client" directive.

import { Building2, Users, MapPin, Briefcase } from "lucide-react";
import { Company } from "@/types/main/company";

type CompanyDetailAboutProps = {
  company: Company;
  jobCount: number;
  accent: string;
};

export default function CompanyDetailAbout({
  company,
  jobCount,
  accent,
}: CompanyDetailAboutProps) {
  const details = [
    { icon: Users, label: "Company size", value: company.company_size },
    { icon: MapPin, label: "Location", value: company.location },
    { icon: Briefcase, label: "Open roles", value: `${jobCount} positions` },
  ].filter((d) => d.value);

  return (
    <div className="max-w-[640px]">
      <div
        className="rounded-[14px] border border-white/[0.07] p-[24px] bg-[#0f1612]"
        style={{ borderTop: `2px solid ${accent}` }}>
        <h2 className="font-semibold text-[1rem] text-[#e8f0ec] mb-[12px] flex items-center gap-[7px]">
          <Building2 size={15} style={{ color: accent }} />
          About {company.name}
        </h2>

        <p className="text-[#6a8878] text-[0.82rem] leading-[1.75] whitespace-pre-line">
          {company.description || "This company hasn't added a description yet."}
        </p>

        <div className="mt-[20px] pt-[16px] border-t border-white/[0.07] grid grid-cols-2 gap-[14px]">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-[8px]">
              <Icon
                size={13}
                style={{ color: accent }}
                className="mt-[2px] flex-shrink-0"
              />
              <div>
                <div className="text-[#5d7a6a] text-[0.67rem] mb-[1px]">
                  {label}
                </div>
                <div className="text-[#e8f0ec] text-[0.78rem] font-medium">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
