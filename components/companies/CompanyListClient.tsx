"use client";

// Wajib client karena mengelola state search & filter (useState).
// Menerima data companies dari server (CompanyPage) sebagai props,
// lalu melakukan filter di sisi client agar search terasa instan.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";
import CompanyToolbar from "./CompanyToolbar";

type CompanyListClientProps = {
  companies: Company[];
};

export default function CompanyListClient({
  companies,
}: CompanyListClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "Semua" || c.location === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <CompanyToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        resultCount={filtered.length}
      />

      <section className="py-7 pb-20">
        <div className="max-w-[1160px] mx-auto px-6">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 text-[#4a6456]">
                <Building2 size={40} className="mx-auto mb-4 opacity-30" />
                <div className="text-[#e8f0ec] text-[1rem] font-semibold mb-2">
                  Tidak ada perusahaan ditemukan
                </div>
                <p className="text-[0.8rem]">
                  Coba kata kunci lain atau hapus filter.
                </p>
              </motion.div>
            ) : (
              <div
                key="grid"
                className="grid gap-[10px]"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}>
                {filtered.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    index={companies.indexOf(company)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
