
import { motion, AnimatePresence } from "framer-motion";
import { PackageSearch } from "lucide-react";
import JobsCard from "./JobsCard";
import type { Job } from "@/types/jobs";
import type { UserRole } from "@/hooks/main/useUserRole";

interface JobsGridProps {
  jobs: Job[];
  role?: UserRole;
}

export function JobsGrid({ jobs, role }: JobsGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
      <AnimatePresence mode="popLayout">
        {jobs.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-20 text-[#7a9585]">
            <PackageSearch
              size={48}
              className="mx-auto mb-4 opacity-30 text-emerald-400"
            />
            <div className="font-syne text-[1.1rem] font-bold text-[#e8f0ec] mb-2">
              No jobs found
            </div>
            <p>Try different keywords or clear the active filters.</p>
          </motion.div>
        ) : (
          jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}>
              <JobsCard job={job} role={role} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}