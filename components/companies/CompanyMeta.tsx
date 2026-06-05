// SERVER Component — tidak ada directive "use client".

import Link from "next/link";
import { Users, Briefcase } from "lucide-react";
import type { Company } from "@/types/company";

type CompanyMetaProps = {
  id: string;
  name: string;
  companySize: Company["company_size"]; // ✅ ambil tipe dari Company, nama prop bebas
  openJobs: Company["openJobs"];
  accent: string | undefined;
};

export default function CompanyMeta({
  id,
  name,
  companySize,
  openJobs,
  accent,
}: CompanyMetaProps) {
  return (
    <>
      <div className="flex-1 min-w-0">
        <Link
          href={`/companies/${id}`}
          className="no-underline font-semibold text-[0.9rem] text-[#e8f0ec] truncate leading-tight hover:underline decoration-white/30 underline-offset-2 transition-colors hover:text-white block">
          {name}
        </Link>
        <div className="flex items-center gap-[4px] text-[0.72rem] text-[#5d7a6a] mt-[2px]">
          <Users size={11} />
          {companySize || "—"}
        </div>
      </div>

      <div
        className="inline-flex items-center gap-[4px] px-[9px] py-[4px] rounded-[6px] text-[0.68rem] font-semibold flex-shrink-0"
        style={{
          background: `${accent}14`,
          color: accent,
          border: `0.5px solid ${accent}35`,
        }}>
        <Briefcase size={10} />
        {openJobs} lowongan
      </div>
    </>
  );
}
