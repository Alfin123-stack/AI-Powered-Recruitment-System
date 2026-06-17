"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  ChevronRight,
  Clock,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import type { Job } from "@/types/jobs";
import CompanyDetailTypeBadge from "./CompanyDetailTypeBadge";
import CompanyDetailJobSkills from "./CompanyDetailJobSkills";
import CompanyDetailJobBenefits from "./CompanyDetailJobBenefits";

type CompanyDetailJobCardProps = {
  job: Job;
  accent: string;
  index: number;
};

export default function CompanyDetailJobCard({
  job,
  accent,
  index,
}: CompanyDetailJobCardProps) {
  const [now] = useState(() => Date.now());

  const daysAgo = useMemo(
    () =>
      Math.floor((now - new Date(job.created_at ?? 0).getTime()) / 86400000),
    [now, job.created_at],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col gap-[10px] rounded-[12px] border border-white/[0.07] bg-[#0f1612] p-[16px] transition-all duration-200 hover:border-white/[0.13] hover:-translate-y-[1px] overflow-hidden">
      {/* Accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: accent }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-[0.88rem] text-[#e8f0ec] leading-tight mb-[3px]">
            {job.title}
          </h3>
          <div className="flex items-center gap-[10px] flex-wrap">
            <CompanyDetailTypeBadge type={job.type || "type"} />
            <span className="flex items-center gap-[3px] text-[#5d7a6a] text-[0.68rem]">
              <Clock size={10} />
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </span>
          </div>
        </div>
        {job.salary && (
          <div
            className="flex items-center gap-[4px] text-[0.7rem] font-semibold px-[8px] py-[4px] rounded-[6px] flex-shrink-0"
            style={{ background: `${accent}12`, color: accent }}>
            <DollarSign size={10} />
            {job.salary}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-[#6a8878] text-[0.76rem] leading-[1.6] line-clamp-2">
        {job.description}
      </p>

      {/* Meta: location + deadline */}
      <div className="flex items-center gap-[12px] flex-wrap">
        <span className="flex items-center gap-[3px] text-[#5d7a6a] text-[0.7rem]">
          <MapPin size={10} /> {job.location}
        </span>
        {job.deadline && (
          <span className="flex items-center gap-[3px] text-[#5d7a6a] text-[0.7rem]">
            <CalendarDays size={10} /> Deadline:{" "}
            {new Date(job.deadline).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>

      <CompanyDetailJobSkills skills={job.skills ?? []} />

      <CompanyDetailJobBenefits benefits={job.benefits ?? []} accent={accent} />

      {/* CTA */}
      <div className="flex gap-[6px] mt-auto pt-1">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center gap-[5px] px-[10px] py-[7px] rounded-[8px] text-[0.73rem] font-semibold no-underline transition-all duration-200"
          style={{
            background: `${accent}14`,
            border: `0.5px solid ${accent}35`,
            color: accent,
          }}>
          View details <ChevronRight size={11} />
        </Link>
        <Link
          href={`/jobs/${job.id}/apply`}
          className="px-[14px] py-[7px] rounded-[8px] text-[0.73rem] font-semibold no-underline transition-all duration-200"
          style={{ background: accent, color: "#0a0f0d" }}>
          Apply
        </Link>
      </div>
    </motion.div>
  );
}
