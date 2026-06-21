"use client";

// Must be client because it uses framer-motion (motion.div).

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Building2 } from "lucide-react";
import type { Company } from "@/types/main/company";
import CompanyLogo from "./CompanyLogo";
import CompanyMeta from "./CompanyMeta";
import CompanyLocation from "./CompanyLocation";
import CompanyTags from "./CompanyTags";

type CompanyCardProps = {
  company: Company;
  index: number;
};

export default function CompanyCard({ company, index }: CompanyCardProps) {
  const accent = company.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.32,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col gap-[11px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0f1612] p-[18px] transition-all duration-250 hover:border-[rgba(255,255,255,0.13)] hover:-translate-y-[2px] overflow-hidden">
      {/* Accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: accent }}
      />

      {/* Header */}
      <div className="flex items-start gap-[10px]">
        <CompanyLogo
          id={company.id}
          name={company.name}
          logoUrl={company.logo_url}
          accent={company.color ?? "#34d399"}
        />
        <CompanyMeta
          id={company.id}
          name={company.name}
          companySize={company.company_size}
          openJobs={company.openJobs}
          accent={accent}
        />
      </div>

      {/* Description */}
      <p className="text-[#6a8878] text-[0.78rem] leading-[1.6] line-clamp-2">
        {company.description || "This company has not added a description yet."}
      </p>

      <CompanyLocation location={company.location} />
      <CompanyTags tags={company.tags ?? []} />

      {/* CTA */}
      <div className="mt-auto pt-1">
        <Link
          href={`/companies/${company.id}`}
          className="w-full flex items-center justify-center gap-[5px] px-[10px] py-[8px] rounded-[8px] text-[0.75rem] font-semibold no-underline transition-all duration-200"
          style={{
            background: `${accent}12`,
            border: `0.5px solid ${accent}30`,
            color: accent,
          }}>
          <Building2 size={12} />
          View Profile &amp; Jobs
          <ChevronRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}
