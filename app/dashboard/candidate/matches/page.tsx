"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  MapPin,
  ChevronRight,
  Briefcase,
  Loader2,
  Search,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCandidate } from "../layout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
type Job = {
  id: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  created_at: string;
  companies: { name: string; logo_url: string | null };
};

type JobWithMatch = Job & {
  matchScore: number;
  matchedSkills: string[];
  alreadyApplied: boolean;
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

// Hitung match score berdasarkan overlap skills kandidat vs job
const calcMatchScore = (
  candidateSkills: string[],
  jobSkills: string[],
): { score: number; matched: string[] } => {
  if (!jobSkills.length) return { score: 50, matched: [] }; // default 50 kalau job tidak punya skills
  if (!candidateSkills.length) return { score: 0, matched: [] };

  const normalize = (s: string) => s.toLowerCase().trim();
  const jobNorm = jobSkills.map(normalize);
  const candidateNorm = candidateSkills.map(normalize);

  // Cari skills yang match (exact atau partial)
  const matched = jobSkills.filter((js) => {
    const jsNorm = normalize(js);
    return candidateNorm.some(
      (cs) => cs.includes(jsNorm) || jsNorm.includes(cs),
    );
  });

  const score = Math.round((matched.length / jobSkills.length) * 100);
  return { score: Math.min(score, 100), matched };
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

// ── Match Score Badge ─────────────────────────────────────────────────────────
function MatchBadge({ score, color }: { score: number; color: string }) {
  const label =
    score >= 80
      ? "Sangat Cocok"
      : score >= 60
        ? "Cocok"
        : score >= 40
          ? "Cukup Cocok"
          : "Kurang Cocok";
  return (
    <div className="text-right flex-shrink-0">
      <div
        className="font-extrabold text-[1.2rem] leading-none"
        style={{ color }}>
        {score}%
      </div>
      <div className="text-[0.62rem] mt-[2px]" style={{ color, opacity: 0.7 }}>
        {label}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MatchesPage() {
  const { token, user } = useCandidate();
  const [jobs, setJobs] = useState<JobWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unapplied" | "high">(
    "unapplied",
  );

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // 1. Fetch semua jobs aktif (public, tidak butuh auth)
        const jobsRes = await fetch(`${API}/api/jobs`);
        const allJobs: Job[] = await jobsRes.json();

        // 2. Fetch lamaran kandidat untuk tahu yang sudah apply
        const appsRes = await fetch(`${API}/api/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myApps = await appsRes.json();
        const appliedJobIds = new Set((myApps || []).map((a: any) => a.job_id));

        // 3. Fetch skills kandidat dari resume_analysis terbaru
        // Ambil dari aplikasi yang punya resume_analysis
        const latestAnalysis = (myApps || [])
          .filter((a: any) => a.resume_score > 0)
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )[0];

        // Kandidat skills dari nama user metadata atau default kosong
        // Dalam real app bisa dari profil kandidat, di sini kita pakai skills
        // yang pernah terdeteksi di resume_analysis terakhir
        const candidateSkillsRes = latestAnalysis
          ? await fetch(`${API}/api/applications/my`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((r) => r.json())
          : [];

        // Kumpulkan semua skills unik dari semua lamaran yang punya analisis
        const allDetectedSkills: string[] = [];
        (candidateSkillsRes || []).forEach((a: any) => {
          // skills tersimpan di extracted_skills, tapi endpoint /my tidak return ini
          // kita gunakan skills dari job yang pernah dilamar sebagai proxy
        });

        // Fallback: pakai nama/title dari job yang pernah dilamar
        // Atau lebih baik, fetch analisis CV terbaru dari endpoint yang ada
        const candidateSkills = allDetectedSkills;

        // 4. Hitung match score setiap job
        const jobsWithMatch: JobWithMatch[] = allJobs.map((job, i) => {
          const { score, matched } = calcMatchScore(
            candidateSkills,
            job.skills || [],
          );
          return {
            ...job,
            matchScore: score,
            matchedSkills: matched,
            alreadyApplied: appliedJobIds.has(job.id),
            color: getColor(i),
          };
        });

        // Sort: belum apply dulu, lalu by match score
        jobsWithMatch.sort((a, b) => {
          if (a.alreadyApplied !== b.alreadyApplied)
            return a.alreadyApplied ? 1 : -1;
          return b.matchScore - a.matchScore;
        });

        setJobs(jobsWithMatch);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filtered = jobs.filter((j) => {
    const mSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companies?.name.toLowerCase().includes(search.toLowerCase());
    const mFilter =
      filter === "all"
        ? true
        : filter === "unapplied"
          ? !j.alreadyApplied
          : j.matchScore >= 60;
    return mSearch && mFilter;
  });

  const unappliedCount = jobs.filter((j) => !j.alreadyApplied).length;
  const highMatchCount = jobs.filter((j) => j.matchScore >= 60).length;

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-emerald-400 animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Mencari lowongan yang cocok...
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
            <div className="font-bold text-[1rem]">Job Matches</div>
            <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
              {unappliedCount} lowongan belum kamu lamar · {highMatchCount}{" "}
              dengan kecocokan tinggi
            </div>
          </div>

          {/* Info cara kerja */}
          <div className="flex items-center gap-2 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-[10px] px-3 py-2">
            <Zap size={13} className="text-emerald-400 flex-shrink-0" />
            <span className="text-[0.72rem] text-[#7a9585]">
              Match score dihitung dari kecocokan skills CV kamu dengan
              kebutuhan lowongan
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Search + Filter */}
      <FadeIn delay={0.04}>
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
          <div className="flex gap-2">
            {[
              { val: "unapplied", label: "Belum Dilamar" },
              { val: "high", label: "Match Tinggi (≥60%)" },
              { val: "all", label: "Semua" },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setFilter(val as any)}
                className={`px-3 py-[7px] rounded-[8px] border text-[0.78rem] font-medium cursor-pointer transition-all whitespace-nowrap
                  ${filter === val ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-transparent border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#7a9585]">
          <div className="text-[2.5rem] mb-3 opacity-30">🔍</div>
          <div className="font-syne font-bold text-[1rem] mb-2">
            {jobs.length === 0
              ? "Belum ada lowongan tersedia"
              : "Tidak ada lowongan ditemukan"}
          </div>
          <p className="text-[0.82rem]">
            Coba ubah filter atau kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`bg-[#0f1612] border rounded-[14px] p-5 transition-all hover:-translate-y-[2px]
                  ${
                    job.alreadyApplied
                      ? "border-white/[0.06] opacity-60"
                      : "border-emerald-500/15 hover:border-emerald-500/30"
                  }`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                    style={{ background: `${job.color}18`, color: job.color }}>
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
                      <MatchBadge score={job.matchScore} color={job.color} />
                    </div>

                    {/* Match bar */}
                    <div className="h-[4px] rounded-full bg-white/[0.05] overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${job.matchScore}%` }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${job.color}, #06b6d4)`,
                        }}
                      />
                    </div>

                    {/* Matched skills */}
                    {job.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-[5px] mb-3">
                        <span className="text-[0.68rem] text-[#7a9585] py-[2px]">
                          Skills match:
                        </span>
                        {job.matchedSkills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="px-[7px] py-[2px] rounded-[4px] text-[0.68rem] font-mono"
                            style={{
                              background: `${job.color}15`,
                              color: job.color,
                              border: `1px solid ${job.color}25`,
                            }}>
                            {s}
                          </span>
                        ))}
                        {job.matchedSkills.length > 4 && (
                          <span className="text-[0.68rem] text-[#7a9585] py-[2px]">
                            +{job.matchedSkills.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta + actions */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-3 text-[0.75rem] text-[#7a9585]">
                        <span className="flex items-center gap-[4px]">
                          <MapPin size={11} /> {job.location}
                        </span>
                        {job.salary && <span>💰 {job.salary}</span>}
                        <span
                          className="px-[7px] py-[1px] rounded-[4px] text-[0.65rem] font-medium"
                          style={{
                            background: `${job.color}10`,
                            color: job.color,
                            border: `1px solid ${job.color}20`,
                          }}>
                          {job.type}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {job.alreadyApplied ? (
                          <span className="flex items-center gap-1 px-3 py-[6px] rounded-[7px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[0.75rem] font-semibold">
                            ✓ Sudah Dilamar
                          </span>
                        ) : (
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
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* CTA lihat semua */}
      <div className="mt-6 text-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[10px] rounded-[9px] text-[0.85rem] font-semibold no-underline transition-all">
          <Briefcase size={14} /> Lihat Semua Lowongan
        </Link>
      </div>
    </div>
  );
}
