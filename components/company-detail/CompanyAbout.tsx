// SERVER Component — tidak ada directive "use client".

import { Building2, Users, MapPin, Briefcase } from "lucide-react";
import { Company } from "@/types/company";
type CompanyAboutProps = {
  company: Company;
  jobCount: number;
  accent: string;
};

export default function CompanyAbout({
  company,
  jobCount,
  accent,
}: CompanyAboutProps) {
  const details = [
    { icon: Users, label: "Ukuran", value: company.company_size },
    { icon: MapPin, label: "Lokasi", value: company.location },
    { icon: Briefcase, label: "Lowongan aktif", value: `${jobCount} posisi` },
  ].filter((d) => d.value);

  return (
    <div className="max-w-[640px]">
      <div
        className="rounded-[14px] border border-white/[0.07] p-[24px] bg-[#0f1612]"
        style={{ borderTop: `2px solid ${accent}` }}>
        <h2 className="font-semibold text-[1rem] text-[#e8f0ec] mb-[12px] flex items-center gap-[7px]">
          <Building2 size={15} style={{ color: accent }} />
          Tentang {company.name}
        </h2>

        <p className="text-[#6a8878] text-[0.82rem] leading-[1.75] whitespace-pre-line">
          {company.description || "Perusahaan ini belum menambahkan deskripsi."}
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
