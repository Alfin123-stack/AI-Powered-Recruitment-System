// SERVER Component — no "use client" directive.

import Link from "next/link";
import { Building2, Users, MapPin, ArrowLeft, Tag } from "lucide-react";
import type { Company } from "@/types/main/company";

type CompanyDetailHeaderProps = {
  company: Company;
  jobCount: number;
  accent: string;
};

export default function CompanyDetailHeader({
  company,
  jobCount,
  accent,
}: CompanyDetailHeaderProps) {
  return (
    <section
      className="pt-[90px] pb-[0px] relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${accent}08 0%, transparent 60%), #0a0f0d`,
      }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${accent}04 1px, transparent 1px), linear-gradient(90deg, ${accent}04 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-[900px] mx-auto px-6 pb-0">
        {/* Back */}
        <Link
          href="/companies"
          className="inline-flex items-center gap-[5px] text-[#5d7a6a] text-[0.75rem] hover:text-[#e8f0ec] transition-colors no-underline mb-[24px] group">
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-[2px] transition-transform"
          />
          Company Directory
        </Link>

        {/* Header */}
        <div className="flex items-start gap-[18px] mb-[28px]">
          {/* Logo */}
          <div
            className="w-[64px] h-[64px] flex-shrink-0 rounded-[14px] flex items-center justify-center border border-white/[0.08]"
            style={{ background: `${accent}18` }}>
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-full h-full object-cover rounded-[14px]"
              />
            ) : (
              <Building2 size={28} style={{ color: accent }} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-[1.5rem] text-[#e8f0ec] leading-tight mb-[4px]">
              {company.name}
            </h1>

            <div className="flex items-center gap-[16px] flex-wrap text-[0.75rem] text-[#5d7a6a] mb-[10px]">
              {company.company_size && (
                <span className="flex items-center gap-[4px]">
                  <Users size={12} /> {company.company_size}
                </span>
              )}
              {company.location && (
                <span className="flex items-center gap-[4px]">
                  <MapPin size={12} /> {company.location}
                </span>
              )}
            </div>

            {(company.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-[5px]">
                {(company.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-[3px] bg-white/[0.04] border border-white/[0.07] text-[#8aaa96] px-[8px] py-[3px] rounded-[5px] text-[0.67rem]">
                    <Tag size={9} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats badge */}
          <div
            className="flex-shrink-0 flex flex-col items-center gap-[2px] px-[18px] py-[12px] rounded-[12px] border"
            style={{ background: `${accent}10`, borderColor: `${accent}25` }}>
            <span className="text-[1.4rem] font-bold" style={{ color: accent }}>
              {jobCount}
            </span>
            <span className="text-[0.67rem] text-[#5d7a6a] whitespace-nowrap">
              open roles
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
