"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  FileText,
  Search,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Video,
  ChevronRight,
  CheckCircle2,
  XCircle,
  CalendarClock,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FadeIn,
  apiFetch,
  getColor,
  statusMap,
  Application,
} from "../_components/shared";
import { useCandidate } from "../layout";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: "online" | "onsite";
  location: string | null;
  notes: string | null;
  status: "scheduled" | "done" | "cancelled";
  job_title: string;
  company_name: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const ivStatusMap: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  scheduled: {
    label: "Terjadwal",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
  },
  done: { label: "Selesai", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  cancelled: {
    label: "Dibatalkan",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();
const isTomorrow = (d: string) => {
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return new Date(d).toDateString() === tom.toDateString();
};
const getDayLabel = (d: string) => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return formatDate(d);
};

// ── Interview Card ────────────────────────────────────────────────────────────
function InterviewCard({ iv, index }: { iv: Interview; index: number }) {
  const st = ivStatusMap[iv.status] ?? ivStatusMap.scheduled;
  const upcoming =
    iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date();

  return (
    <motion.div
      key={iv.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`bg-[#0f1612] border rounded-[14px] p-5 transition-all
        ${iv.status === "cancelled" ? "border-white/[0.05] opacity-60" : "border-emerald-500/15 hover:border-emerald-500/25"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Calendar size={16} />
          </div>
          <div>
            <div className="font-syne font-bold text-[0.92rem]">
              {iv.job_title}
            </div>
            <div className="text-[0.75rem] text-[#7a9585]">
              {iv.company_name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
          {isToday(iv.scheduled_at) && iv.status === "scheduled" && (
            <span className="px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
              Hari ini!
            </span>
          )}
          <span
            className="px-[9px] py-[3px] rounded-full text-[0.67rem] font-bold"
            style={{
              background: st.bg,
              color: st.color,
              border: `1px solid ${st.color}30`,
            }}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-[#141f19] border border-emerald-500/10 rounded-[10px] p-3 mb-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-[6px] text-[0.82rem] font-semibold">
            <Calendar size={13} className="text-emerald-400" />{" "}
            {getDayLabel(iv.scheduled_at)}
          </span>
          <span className="flex items-center gap-[6px] text-[0.82rem] font-semibold">
            <Clock size={13} className="text-emerald-400" />{" "}
            {formatTime(iv.scheduled_at)} WIB
          </span>
          <span className="flex items-center gap-[6px] text-[0.78rem] text-[#7a9585]">
            {iv.type === "online" ? (
              <Video size={13} />
            ) : (
              <Building2 size={13} />
            )}
            {iv.type === "online" ? "Online" : "Onsite"}
          </span>
        </div>
      </div>

      {/* Location / Meeting link */}
      {iv.location && (
        <div className="mb-3">
          {iv.type === "online" ? (
            <a
              href={iv.location}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-between w-full px-4 py-[11px] rounded-[10px] no-underline transition-all font-semibold text-[0.85rem]
                ${
                  upcoming
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                    : "bg-[#141f19] border border-emerald-500/15 text-emerald-400 hover:border-emerald-500/30"
                }`}>
              <span className="flex items-center gap-2">
                <Video size={14} />{" "}
                {upcoming ? "🎥 Buka Link Meeting" : "Link Meeting"}
              </span>
              <ExternalLink size={13} />
            </a>
          ) : (
            <div className="flex items-center gap-2 text-[0.78rem] text-[#7a9585] bg-[#141f19] border border-emerald-500/10 rounded-[10px] px-4 py-[10px]">
              <MapPin size={13} className="text-emerald-400 flex-shrink-0" />{" "}
              {iv.location}
            </div>
          )}
        </div>
      )}

      {/* Notes dari HR */}
      {iv.notes && (
        <div className="bg-amber-500/[0.05] border border-amber-500/15 rounded-[9px] px-3 py-[10px] mb-3">
          <div className="text-[0.68rem] font-bold text-amber-400 uppercase tracking-[0.06em] mb-1">
            📝 Catatan dari HR
          </div>
          <div className="text-[0.78rem] text-[#7a9585]">{iv.notes}</div>
        </div>
      )}

      {upcoming && (
        <div className="flex items-center gap-2 text-[0.72rem] text-emerald-400/60 mt-1">
          <CheckCircle2 size={11} />
          Siapkan diri — review job description & portfolio sebelum interview
        </div>
      )}
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ApplicationsPage() {
  const { token } = useCandidate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"applications" | "interviews">(
    "applications",
  );

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        const [appsData, ivData] = await Promise.all([
          apiFetch("/api/applications/my", token),
          fetch(`${API}/api/interviews/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
        ]);

        console.log("asfasdf", appsData);
        setApplications(Array.isArray(appsData) ? appsData : []);
        setInterviews(Array.isArray(ivData) ? ivData : []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const upcomingInterviews = interviews.filter(
    (iv) => iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date(),
  );

  const groupedInterviews = interviews.reduce(
    (acc, iv) => {
      const key = getDayLabel(iv.scheduled_at);
      if (!acc[key]) acc[key] = [];
      acc[key].push(iv);
      return acc;
    },
    {} as Record<string, Interview[]>,
  );

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
          <span className="text-[#7a9585] text-[0.85rem]">Memuat data...</span>
        </div>
      </div>
    );

  return (
    <div>
      {/* Banner upcoming interview — muncul di tab applications */}
      {upcomingInterviews.length > 0 && activeTab === "applications" && (
        <FadeIn>
          <div className="bg-cyan-500/[0.06] border border-cyan-500/20 rounded-[14px] p-4 mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[9px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Calendar size={15} />
              </div>
              <div>
                <div className="font-semibold text-[0.85rem] text-cyan-400">
                  {upcomingInterviews.length === 1
                    ? "Ada 1 jadwal interview menunggumu"
                    : `${upcomingInterviews.length} jadwal interview menunggu`}
                </div>
                <div className="text-[0.72rem] text-[#7a9585] mt-[2px]">
                  {isToday(upcomingInterviews[0].scheduled_at)
                    ? `⚡ Hari ini pukul ${formatTime(upcomingInterviews[0].scheduled_at)} WIB — ${upcomingInterviews[0].job_title}`
                    : `Berikutnya: ${getDayLabel(upcomingInterviews[0].scheduled_at)} — ${upcomingInterviews[0].job_title}`}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("interviews")}
              className="flex items-center gap-1 text-[0.78rem] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex-shrink-0 cursor-pointer whitespace-nowrap">
              Lihat Jadwal <ChevronRight size={13} />
            </button>
          </div>
        </FadeIn>
      )}

      {/* Tabs */}
      <FadeIn delay={0.02}>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex gap-1 bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-1">
            {(
              [
                {
                  key: "applications",
                  label: "Lamaranku",
                  Icon: Building2,
                  count: applications.length,
                },
                {
                  key: "interviews",
                  label: "Jadwal Interview",
                  Icon: Calendar,
                  count: interviews.length,
                },
              ] as const
            ).map(({ key, label, Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-[8px] rounded-[9px] text-[0.82rem] font-medium cursor-pointer transition-all whitespace-nowrap
                  ${activeTab === key ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"}`}>
                <Icon size={13} /> {label}
                {count > 0 && (
                  <span
                    className={`rounded-[4px] px-[6px] py-[1px] text-[0.62rem] font-extrabold
                    ${activeTab === key ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.05] text-[#7a9585]"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          {activeTab === "applications" && (
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-[9px] rounded-[9px] text-[0.82rem] no-underline transition-all">
              + Lamar Lagi
            </Link>
          )}
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        {/* ── Tab: Lamaranku ── */}
        {activeTab === "applications" && (
          <motion.div
            key="apps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            {/* Search + Filter */}
            <FadeIn>
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
                    // Cek apakah ada interview aktif untuk lamaran ini
                    const appInterview = interviews.find(
                      (iv) =>
                        iv.application_id === app.id &&
                        iv.status === "scheduled",
                    );
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

                            {/* Score bars */}
                            {(app.resume_score > 0 ||
                              app.matching_score > 0) && (
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

                            {/* Interview badge kalau ada */}
                            {appInterview && (
                              <div className="flex items-center justify-between bg-cyan-500/[0.06] border border-cyan-500/20 rounded-[9px] px-3 py-[9px] mb-3">
                                <div className="flex items-center gap-2 text-[0.78rem]">
                                  <Calendar
                                    size={12}
                                    className="text-cyan-400"
                                  />
                                  <span className="text-cyan-400 font-semibold">
                                    Interview:
                                  </span>
                                  <span className="text-[#7a9585]">
                                    {getDayLabel(appInterview.scheduled_at)},{" "}
                                    {formatTime(appInterview.scheduled_at)} WIB
                                  </span>
                                  {appInterview.type === "online" && (
                                    <Video
                                      size={11}
                                      className="text-cyan-400 ml-1"
                                    />
                                  )}
                                </div>
                                <button
                                  onClick={() => setActiveTab("interviews")}
                                  className="text-[0.72rem] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors">
                                  Lihat <ChevronRight size={11} />
                                </button>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-[0.72rem] text-[#7a9585]">
                                {new Date(app.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
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
          </motion.div>
        )}

        {/* ── Tab: Jadwal Interview ── */}
        {activeTab === "interviews" && (
          <motion.div
            key="ivs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            {interviews.length === 0 ? (
              <div className="text-center py-20 text-[#7a9585]">
                <div className="text-[3rem] mb-3 opacity-20">📅</div>
                <div className="font-syne font-bold text-[1rem] mb-2">
                  Belum ada jadwal interview
                </div>
                <p className="text-[0.82rem] max-w-[260px] mx-auto leading-relaxed">
                  Jadwal interview akan muncul di sini setelah HR menjadwalkan
                  untuk lamaranmu.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {Object.entries(groupedInterviews).map(([dateLabel, items]) => (
                  <div key={dateLabel}>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`px-3 py-[5px] rounded-[7px] text-[0.75rem] font-bold
                        ${
                          dateLabel === "Hari Ini"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            : dateLabel === "Besok"
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                              : "bg-white/[0.04] text-[#7a9585] border border-white/[0.08]"
                        }`}>
                        {dateLabel}
                      </div>
                      <div className="flex-1 h-px bg-emerald-500/10" />
                      <span className="text-[0.72rem] text-[#7a9585]">
                        {items.length} interview
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {items.map((iv, i) => (
                        <InterviewCard key={iv.id} iv={iv} index={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
