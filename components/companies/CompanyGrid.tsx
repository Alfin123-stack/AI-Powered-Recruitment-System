// @/components/company/CompanyGrid.tsx
// Animated grid: renders CompanyCard or empty state
// Zero state — purely presentational

import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";
import CompanyCard from "./CompanyCard";
import type { Company } from "@/types/main/company";

interface CompanyGridProps {
  companies: Company[];
  allCompanies: Company[]; // required for index relative to original list
}

export function CompanyGrid({ companies, allCompanies }: CompanyGridProps) {
  return (
    <section className="py-7 pb-20">
      <div className="max-w-[1160px] mx-auto px-6">
        <AnimatePresence mode="popLayout">
          {companies.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-[#4a6456]">
              <Building2 size={40} className="mx-auto mb-4 opacity-30" />
              <div className="text-[#e8f0ec] text-[1rem] font-semibold mb-2">
                No companies found
              </div>
              <p className="text-[0.8rem]">
                Try a different keyword or clear your filters.
              </p>
            </motion.div>
          ) : (
            <div
              key="grid"
              className="grid gap-[10px]"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}>
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  index={allCompanies.indexOf(company)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
