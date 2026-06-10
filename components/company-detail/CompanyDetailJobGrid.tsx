// SERVER Component — no "use client" directive.

import { Briefcase } from "lucide-react";
import type { Job } from "@/types/jobs";
import CompanyDetailJobCard from "./CompanyDetailJobCard";

type CompanyDetailJobGridProps = {
  jobs: Job[];
  accent: string;
};

export default function CompanyDetailJobGrid({
  jobs,
  accent,
}: CompanyDetailJobGridProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 text-[#4a6456]">
        <Briefcase size={36} className="mx-auto mb-4 opacity-30" />
        <div className="text-[#e8f0ec] font-semibold mb-2">
          No open roles yet
        </div>
        <p className="text-[0.8rem]">
          This company hasn't posted any positions at the moment.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-[10px]"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
      {jobs.map((job, i) => (
        <CompanyDetailJobCard key={job.id} job={job} accent={accent} index={i} />
      ))}
    </div>
  );
}
