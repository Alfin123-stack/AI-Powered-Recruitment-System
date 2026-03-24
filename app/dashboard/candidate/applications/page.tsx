"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Building2, FileText, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FadeIn,
  apiFetch,
  getColor,
  statusMap,
  Application,
} from "../_components/shared";
import { useCandidate } from "../layout";

export default function ApplicationsPage() {
  const { token } = useCandidate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/applications/my", token)
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = applications.filter((a) => {
    const ms = filter === "all" || a.status === filter;
    const mq =
      (a.job_title || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.company_name || "").toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-emerald-400 animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Memuat lamaran...
          </span>
        </div>
      </div>
    );

  return (
    <div>
      <FadeIn>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-bold text-[1rem]">Riwayat Lamaran</div>
            <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
              {applications.length} lamaran ·{" "}
              {applications.filter((a) => a.status === "shortlisted").length}{" "}
              shortlisted
            </div>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-[9px] rounded-[9px] text-[0.82rem] no-underline transition-all">
            + Lamar Lagi
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari posisi atau perusahaan..."
              className="pl-[34px] bg-[#0f1612] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { val: "all", label: "Semua" },
              { val: "applied", label: "Dikirim" },
              { val: "review", label: "Direview" },
              { val: "shortlisted", label: "Shortlisted" },
              { val: "rejected", label: "Ditolak" },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3 py-[7px] rounded-[8px] border text-[0.78rem] font-medium cursor-pointer transition-all whitespace-nowrap
                  ${filter === val ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-transparent border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#7a9585]">
          <div className="text-[2.5rem] mb-3 opacity-30">🔍</div>
          <div className="font-syne font-bold text-[1rem] mb-2">
            {applications.length === 0
              ? "Belum ada lamaran"
              : "Tidak ditemukan"}
          </div>
          {applications.length === 0 && (
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[10px] rounded-[9px] text-[0.85rem] no-underline mt-4">
              Cari Lowongan →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((app, i) => {
              const st = statusMap[app.status] ?? {
                label: app.status,
                color: "#7a9585",
              };
              const color = getColor(i);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 hover:border-emerald-500/25 transition-all">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                      style={{ background: `${color}18`, color }}>
                      <Building2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="font-syne font-bold text-[0.95rem]">
                            {app.job_title}
                          </div>
                          <div className="text-[0.78rem] text-[#7a9585]">
                            {app.company_name}
                          </div>
                        </div>
                        <span
                          className="px-[10px] py-[4px] rounded-full text-[0.67rem] font-bold flex-shrink-0"
                          style={{
                            background: `${st.color}15`,
                            color: st.color,
                            border: `1px solid ${st.color}30`,
                          }}>
                          {st.label}
                        </span>
                      </div>

                      {(app.resume_score > 0 || app.matching_score > 0) && (
                        <div className="flex gap-5 mb-3">
                          {app.resume_score > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-[70px] h-[4px] rounded-full bg-white/[0.05] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${app.resume_score}%`,
                                    background:
                                      "linear-gradient(90deg,#10b981,#06b6d4)",
                                  }}
                                />
                              </div>
                              <span className="text-[0.72rem] font-bold text-emerald-400">
                                {app.resume_score}{" "}
                                <span className="text-[#7a9585] font-normal">
                                  CV
                                </span>
                              </span>
                            </div>
                          )}
                          {app.matching_score > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-[70px] h-[4px] rounded-full bg-white/[0.05] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${app.matching_score}%`,
                                    background:
                                      "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                                  }}
                                />
                              </div>
                              <span className="text-[0.72rem] font-bold text-violet-400">
                                {app.matching_score}%{" "}
                                <span className="text-[#7a9585] font-normal">
                                  Match
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-[0.72rem] text-[#7a9585]">
                          {new Date(app.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </span>
                        {app.cv_url && (
                          <a
                            href={app.cv_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[0.72rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors">
                            <FileText size={12} /> Lihat CV
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
