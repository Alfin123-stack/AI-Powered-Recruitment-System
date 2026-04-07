"use client";

import { motion, AnimatePresence } from "framer-motion";
import JobCard from "./JobCard";
import { Loader2, SlidersHorizontal } from "lucide-react";

export default function JobList({ filtered, search, loading }: any) {
  return (
    <section className="py-8 pb-20">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="flex justify-between items-center mb-5">
          <p className="text-[0.82rem] text-[#7a9585]">
            Menampilkan{" "}
            <strong className="text-[#e8f0ec]">
              {loading ? "—" : filtered.length}
            </strong>{" "}
            lowongan
            {search && ` untuk "${search}"`}
          </p>
          <span className="flex items-center gap-[6px] text-[#7a9585] text-[0.78rem]">
            <SlidersHorizontal size={13} /> Urutkan: Terbaru
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="text-emerald-400 animate-spin" />
              <span className="text-[#7a9585] text-[0.85rem]">
                Memuat lowongan...
              </span>
            </div>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            }}>
            <AnimatePresence mode="popLayout">
              {filtered?.length === 0 ? (
                <div className="col-span-full text-center py-20 text-[#7a9585]">
                  <div className="text-5xl mb-4 opacity-40">🔍</div>
                  <div className="font-syne text-[1.1rem] font-bold text-[#e8f0ec] mb-2">
                    Tidak ada lowongan ditemukan
                  </div>
                  <p>Coba kata kunci lain atau hapus filter yang aktif.</p>
                </div>
              ) : (
                filtered?.map((job, i) => (
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
        )}
      </div>
    </section>
  );
}
