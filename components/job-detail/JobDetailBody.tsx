// Server Component — tidak ada "use client"
// Render deskripsi, requirements, benefits, dan about company

import React from "react";
import { CheckCircle2, Building2 } from "lucide-react";
import FadeIn from "./FadeIn";
import { Job } from "@/types/jobs";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 mb-4 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-[18px] font-syne text-[1.05rem] font-bold">
      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
  );
}

export default function JobDetailBody({
  job,
  requirements,
  color,
}: {
  job: Job;
  requirements: string[];
  color: string;
}) {
  return (
    <div>
      {/* Description */}
      <FadeIn delay={0.05}>
        <Card>
          <CardTitle>Deskripsi Pekerjaan</CardTitle>
          <p className="text-[#7a9585] text-[0.9rem] leading-[1.75] whitespace-pre-line">
            {job.description}
          </p>
        </Card>
      </FadeIn>

      {/* Requirements */}
      {requirements.length > 0 && (
        <FadeIn delay={0.1}>
          <Card>
            <CardTitle>Kualifikasi & Persyaratan</CardTitle>
            <div className="flex flex-col gap-[10px]">
              {requirements.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-[10px] text-[#7a9585] text-[0.88rem] leading-[1.55]">
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 mt-[1px] text-cyan-400"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Benefits */}
      {(job.benefits || []).length > 0 && (
        <FadeIn delay={0.15}>
          <Card>
            <CardTitle>Benefit & Fasilitas</CardTitle>
            <div className="grid grid-cols-2 gap-2">
              {job.benefits?.map((b, i) => (
                <div
                  key={i}
                  className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-[9px] px-[14px] py-[10px] text-[0.8rem] text-[#e8f0ec] flex items-center gap-[7px]">
                  <span className="text-emerald-400">✦</span> {b}
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      )}

      {/* About Company */}
      {job.companies && (
        <FadeIn delay={0.2}>
          <Card>
            <CardTitle>Tentang Perusahaan</CardTitle>
            <div className="flex gap-[14px] items-start mb-[14px]">
              <div
                className="w-12 h-12 rounded-[11px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                style={{ background: `${color}18`, color }}>
                <Building2 size={20} />
              </div>
              <div>
                <div className="font-syne font-bold mb-1">
                  {job.companies.name}
                </div>
                {job.companies.company_size && (
                  <div className="text-[0.78rem] text-[#7a9585]">
                    👥 {job.companies.company_size}
                  </div>
                )}
              </div>
            </div>
            {job.companies.description && (
              <p className="text-[#7a9585] text-[0.9rem] leading-[1.75]">
                {job.companies.description}
              </p>
            )}
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
