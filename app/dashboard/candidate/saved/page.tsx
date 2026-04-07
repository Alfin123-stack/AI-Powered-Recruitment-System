"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Bookmark,
  Loader2,
  ChevronRight,
  Search,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCandidate } from "../layout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
type SavedJob = {
  saved_id: string;
  saved_at: string;
  id: string;
  title: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  deadline: string | null;
  created_at: string;
  companies: { name: string; logo_url: string | null; company_size: string };
  color: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];
const getColor = (i: number) => COLORS[i % COLORS.length];

const timeAgo = (dateStr: string) => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari lalu";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
};

const isDeadlineSoon = (deadline: string | null) => {
  if (!deadline) return false;
  const days = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / 86400000,
  );
  return days >= 0 && days <= 7;
};

const isExpired = (deadline: string | null) => {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
};

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SavedJobsPage() {
  const { token } = useCandidate();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchSaved = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSavedJobs(
        (Array.isArray(data) ? data : []).map((j: any, i: number) => ({
          ...j,
          color: getColor(i),
        })),
      );
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [token]);

  const handleUnsave = async (jobId: string) => {
    setRemovingId(jobId);
    try {
      await fetch(`${API}/api/saved-jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch {
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = savedJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companies?.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-emerald-400 animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Memuat lowongan tersimpan...
          </span>
        </div>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="font-bold text-[1rem]">Lowongan Tersimpan</div>
            <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
              {savedJobs.length} lowongan disimpan
            </div>
          </div>
          {savedJobs.length > 0 && (
            <div className="relative min-w-[220px]">
              <Search
                size={14}
                className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari lowongan tersimpan..."
                className="pl-[34px] bg-[#0f1612] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
          )}
        </div>
      </FadeIn>

      {/* Empty state */}
      {savedJobs.length === 0 ? (
        <FadeIn delay={0.05}>
          <div className="text-center py-20 text-[#7a9585]">
            <div className="text-[3rem] mb-4 opacity-20">🔖</div>
            <div className="font-syne font-bold text-[1rem] mb-2">
              Belum ada lowongan tersimpan
            </div>
            <p className="text-[0.82rem] mb-5 max-w-[280px] mx-auto leading-relaxed">
              Tekan ikon bookmark di halaman lowongan untuk menyimpannya dan
              temukan lagi nanti.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[10px] rounded-[9px] no-underline text-[0.85rem] transition-all">
              <Briefcase size={14} /> Jelajahi Lowongan
            </Link>
          </div>
        </FadeIn>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#7a9585]">
          <div className="text-[2rem] mb-3 opacity-20">🔍</div>
          <div className="text-[0.9rem] font-semibold">
            Tidak ada hasil untuk "{search}"
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((job, i) => {
              const expired = isExpired(job.deadline);
              const soon = isDeadlineSoon(job.deadline);
              return (
                <motion.div
                  key={job.saved_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`bg-[#0f1612] border rounded-[14px] p-5 transition-all hover:-translate-y-[2px]
                    ${expired ? "border-white/[0.06] opacity-60" : "border-emerald-500/15 hover:border-emerald-500/30"}`}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                      style={{
                        background: `${job.color}18`,
                        color: job.color,
                      }}>
                      <Building2 size={18} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <div className="font-syne font-bold text-[0.95rem]">
                            {job.title}
                          </div>
                          <div className="text-[0.78rem] text-[#7a9585]">
                            {job.companies?.name}
                          </div>
                        </div>
                        {/* badges */}
                        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                          {expired && (
                            <span className="px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                              Expired
                            </span>
                          )}
                          {!expired && soon && (
                            <span className="px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                              Deadline segera!
                            </span>
                          )}
                          <span
                            className="px-[8px] py-[2px] rounded-[5px] text-[0.65rem] font-semibold"
                            style={{
                              background: `${job.color}15`,
                              color: job.color,
                              border: `1px solid ${job.color}25`,
                            }}>
                            {job.type}
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 text-[0.75rem] text-[#7a9585] mb-3">
                        {job.location && (
                          <span className="flex items-center gap-[4px]">
                            <MapPin size={11} /> {job.location}
                          </span>
                        )}
                        {job.salary && <span>💰 {job.salary}</span>}
                        {job.deadline && (
                          <span
                            className={`flex items-center gap-[4px] ${soon && !expired ? "text-amber-400" : ""}`}>
                            <Clock size={11} />
                            Deadline:{" "}
                            {new Date(job.deadline).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        )}
                        <span className="flex items-center gap-[4px] text-[#7a9585]/60">
                          <Bookmark size={10} /> Disimpan{" "}
                          {timeAgo(job.saved_at)}
                        </span>
                      </div>

                      {/* Skills */}
                      {(job.skills || []).length > 0 && (
                        <div className="flex flex-wrap gap-[5px] mb-3">
                          {job.skills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="px-[7px] py-[2px] rounded-[4px] text-[0.68rem] font-mono bg-white/[0.04] border border-white/[0.07] text-[#e8f0ec]">
                              {s}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="text-[0.68rem] text-[#7a9585] py-[2px]">
                              +{job.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {!expired && (
                            <Link
                              href={`/jobs/${job.id}`}
                              className="flex items-center gap-1 px-4 py-[7px] rounded-[7px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.78rem] font-bold no-underline transition-all hover:shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                              Apply Sekarang →
                            </Link>
                          )}
                          <Link
                            href={`/jobs/${job.id}`}
                            className="flex items-center gap-1 px-3 py-[7px] rounded-[7px] bg-[#141f19] border border-emerald-500/15 text-emerald-400 text-[0.78rem] font-semibold no-underline hover:border-emerald-500/30 transition-all">
                            Detail <ChevronRight size={12} />
                          </Link>
                        </div>

                        {/* Hapus dari simpanan */}
                        <button
                          onClick={() => handleUnsave(job.id)}
                          disabled={removingId === job.id}
                          title="Hapus dari simpanan"
                          className="flex items-center gap-1 px-3 py-[7px] rounded-[7px] bg-red-500/[0.06] border border-red-500/15 text-red-400 text-[0.75rem] font-medium cursor-pointer hover:bg-red-500/12 hover:border-red-500/25 transition-all disabled:opacity-40">
                          {removingId === job.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* CTA */}
      {savedJobs.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[10px] rounded-[9px] text-[0.85rem] font-semibold no-underline transition-all">
            <Briefcase size={14} /> Cari Lowongan Lainnya
          </Link>
        </div>
      )}
    </div>
  );
}
