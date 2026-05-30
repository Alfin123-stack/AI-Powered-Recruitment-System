"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import JobCard from "@/components/jobs/JobCard";
import Pagination from "@/components/Pagination";
import { FILTERS } from "@/lib/constants";
import type { Job } from "@/lib/jobs";

const JOBS_PER_PAGE = 9;

// ── Toolbar ───────────────────────────────────────────────────────────────────
function JobToolbar({
  search,
  setSearch,
  filter,
  setFilter,
}: {
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
}) {
  return (
    <section className="pt-7" id="jobs-section">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-4 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={16}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
            />
            <Input
              placeholder="Cari posisi, perusahaan, atau skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#141f19] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
            />
          </div>
          <div className="flex gap-[6px] flex-wrap">
            {FILTERS?.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-[14px] py-2 rounded-[8px] border font-medium text-[0.78rem] cursor-pointer transition-all duration-200 whitespace-nowrap
                  ${
                    filter === f
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-transparent border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"
                  }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Job List + Pagination ─────────────────────────────────────────────────────
// `key` dari parent akan reset state ini otomatis tanpa useEffect
function JobList({ filtered, search }: { filtered: Job[]; search: string }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  return (
    <section className="py-8 pb-20">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-[0.82rem] text-[#7a9585]">
            Menampilkan{" "}
            <strong className="text-[#e8f0ec]">{filtered.length}</strong>{" "}
            lowongan{search && ` untuk "${search}"`}
          </p>
          <span className="flex items-center gap-[6px] text-[#7a9585] text-[0.78rem]">
            <SlidersHorizontal size={13} />
            Urutkan: Terbaru
          </span>
        </div>

        {/* Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          }}>
          <AnimatePresence mode="popLayout">
            {paginated.length === 0 ? (
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
                  Tidak ada lowongan ditemukan
                </div>
                <p>Coba kata kunci lain atau hapus filter yang aktif.</p>
              </motion.div>
            ) : (
              paginated.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}>
                  <JobCard job={job} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollTargetId="jobs-section"
          />
        )}
      </div>
    </section>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────────
export default function JobsContainer({ initialJobs }: { initialJobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = useMemo(() => {
    let result = initialJobs;

    if (filter !== "Semua") {
      result = result.filter((j) => j.type === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.companies?.name?.toLowerCase().includes(q) ||
          j.skills?.some((s) => s.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [initialJobs, search, filter]);

  // key berubah setiap filter/search berubah → JobList di-remount → page reset ke 1
  // tanpa useEffect, tanpa cascading render
  const listKey = `${filter}__${search}`;

  return (
    <>
      <JobToolbar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />
      <JobList key={listKey} filtered={filtered} search={search} />
    </>
  );
}
