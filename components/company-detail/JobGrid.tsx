// SERVER Component — tidak ada directive "use client".
// Render grid job cards. Tidak ada state, hanya meneruskan data ke
// JobCard (client). Server component bisa render client component di dalamnya.

import { Briefcase } from "lucide-react";
import type { Job } from "@/types/jobs";
import JobCard from "./JobCard";

type JobGridProps = {
  jobs: Job[];
  accent: string;
};

export default function JobGrid({ jobs, accent }: JobGridProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 text-[#4a6456]">
        <Briefcase size={36} className="mx-auto mb-4 opacity-30" />
        <div className="text-[#e8f0ec] font-semibold mb-2">
          Belum ada lowongan aktif
        </div>
        <p className="text-[0.8rem]">
          Perusahaan ini belum membuka lowongan saat ini.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-[10px]"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
      {jobs.map((job, i) => (
        <JobCard key={job.id} job={job} accent={accent} index={i} />
      ))}
    </div>
  );
}
