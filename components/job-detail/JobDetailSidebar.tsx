"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import {
  CheckCircle2,
  Bookmark,
  Upload,
  Loader2,
  Info,
  Linkedin,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JobApplyModal } from "./JobApplyModal";
import { Job } from "@/types/jobs";
import { formatDeadline } from "@/lib/utils";
import { STATUS_CONFIG_UI } from "@/constants/shared";
import type { UserRole } from "@/hooks/main/useUserRole";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fallback badge used when `applicationStatus` doesn't have a matching
// entry in STATUS_CONFIG_UI (e.g. a new status like "hired"/"accepted"
// was added on the backend but the UI config wasn't updated yet).
// This guarantees an applied candidate never sees "Apply Now" again.
function resolveStatus(applicationStatus: string | null) {
  if (!applicationStatus) return null;

  const known = STATUS_CONFIG_UI[applicationStatus];
  if (known) return known;

  const label = applicationStatus
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    text: label,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  };
}

// ── Share platforms config ───────────────────────────────────────────────────
const SHARE_PLATFORMS = [
  { name: "LinkedIn", icon: Linkedin },
  { name: "WhatsApp", icon: MessageCircle },
  { name: "Twitter", icon: Twitter },
] as const;

type SharePlatform = (typeof SHARE_PLATFORMS)[number]["name"];

export default function JobDetailSidebar({
  job,
  color,
}: {
  job: Job;
  color: string;
}) {
  const router = useRouter();

  // ── Role state ───────────────────────────────────────────────────────────────
  const [role, setRole] = useState<UserRole>(null);

  // ── Apply state ──────────────────────────────────────────────────────────────
  const [session, setSession] = useState<Session | null>(null);
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null,
  );
  const [checkingApplied, setCheckingApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // ── Save state ───────────────────────────────────────────────────────────────
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      setSession(s);
      if (!s?.access_token) return;

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", s.user.id)
        .single<{ role: string }>();

      const currentRole: UserRole = userData?.role === "hr" ? "hr" : "candidate";
      setRole(currentRole);

      // HR accounts can't apply or save jobs — skip those status checks entirely
      if (currentRole === "hr") return;

      // Parallel: check apply status + save status
      setCheckingApplied(true);
      setCheckingSaved(true);

      await Promise.allSettled([
        fetch(`${API}/api/applications/check/${job.id}`, {
          headers: { Authorization: `Bearer ${s.access_token}` },
        })
          .then((r) => r.json())
          .then(({ applied: isApplied, status }) => {
            if (isApplied) {
              setApplied(true);
              setApplicationStatus(status);
            }
          })
          .finally(() => setCheckingApplied(false)),

        fetch(`${API}/api/saved-jobs/check/${job.id}`, {
          headers: { Authorization: `Bearer ${s.access_token}` },
        })
          .then((r) => r.json())
          .then(({ saved: isSaved }) => setSaved(isSaved))
          .finally(() => setCheckingSaved(false)),
      ]);
    };

    init();
  }, [job.id]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleApplyClick = () => {
    if (!session) {
      router.push(`/login?redirect=/jobs/${job.id}`);
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setApplied(true);
    setApplicationStatus("applied");
    setShowApplyModal(false);
  };

  const handleToggleSave = async () => {
    const {
      data: { session: s },
    } = await supabase.auth.getSession();
    if (!s?.access_token) {
      router.push(`/login?redirect=/jobs/${job.id}`);
      return;
    }
    setSavingLoading(true);
    try {
      if (saved) {
        await fetch(`${API}/api/saved-jobs/${job.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${s.access_token}` },
        });
        setSaved(false);
      } else {
        await fetch(`${API}/api/saved-jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${s.access_token}`,
          },
          body: JSON.stringify({ job_id: job.id }),
        });
        setSaved(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleShare = (platform: SharePlatform) => {
    const shareUrl = window.location.href;
    const companyName = job.companies?.name;
    const shareText = companyName
      ? `Check out this job opening: ${job.title} at ${companyName}`
      : `Check out this job opening: ${job.title}`;

    const links: Record<SharePlatform, string> = {
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      WhatsApp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      Twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    };

    window.open(links[platform], "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const status = resolveStatus(applicationStatus);
  const isHR = role === "hr";

  return (
    <>
      {/* Apply Modal */}
      {showApplyModal && session && (
        <JobApplyModal
          job={job}
          token={session.access_token}
          userId={session.user.id}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}

      <div className="sticky top-20">
        {/* Main card */}
        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 mb-4">
          {/* Apply button area */}
          {isHR ? (
            <div className="w-full rounded-[11px] border border-amber-500/25 bg-amber-500/[0.06] flex items-start gap-3 px-4 py-[14px] mb-[10px]">
              <Info size={16} className="text-amber-400 flex-shrink-0 mt-[1px]" />
              <span className="text-[0.8rem] text-[#d8c8a0] leading-relaxed">
                You&apos;re signed in as an HR account. Only candidate
                accounts can apply for jobs.
              </span>
            </div>
          ) : checkingApplied ? (
            <div className="w-full py-[14px] rounded-[11px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center gap-2 mb-[10px]">
              <Loader2 size={14} className="text-emerald-400 animate-spin" />
              <span className="text-[#7a9585] text-[0.85rem]">
                Checking status...
              </span>
            </div>
          ) : applied ? (
            <div className="mb-[10px]">
              <div
                className="w-full py-[13px] rounded-[11px] border flex items-center justify-center gap-2 mb-2"
                style={{
                  background: status?.bg ?? "rgba(16,185,129,0.1)",
                  borderColor: status?.border ?? "rgba(16,185,129,0.3)",
                }}>
                <CheckCircle2 size={15} style={{ color: status?.color ?? "#10b981" }} />
                <span
                  className="font-bold text-[0.9rem]"
                  style={{ color: status?.color ?? "#10b981" }}>
                  {status?.text ?? "Applied"}
                </span>
              </div>
              <Link
                href="/dashboard/candidate/applications"
                className="flex items-center justify-center gap-1 text-[0.75rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors">
                View application detail →
              </Link>
            </div>
          ) : (
            <Button
              onClick={handleApplyClick}
              className="w-full py-[14px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[11px] text-[0.95rem] hover:shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] mb-[10px]">
              <Upload size={15} /> Apply Now
            </Button>
          )}

          {/* Save button — candidates only */}
          {!isHR && (
            <button
              onClick={handleToggleSave}
              disabled={savingLoading || checkingSaved}
              className={`
                w-full py-[11px] rounded-[11px] text-[0.88rem] font-semibold border
                flex items-center justify-center gap-2
                transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  saved
                    ? `bg-emerald-500/10 text-emerald-400 border-emerald-500/30
                       hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30
                       active:scale-[0.98]`
                    : `bg-[#141f19] text-[#c5d8cc] border-emerald-500/15
                       hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/40
                       hover:shadow-[0_0_16px_rgba(16,185,129,0.08)]
                       active:scale-[0.98]`
                }
              `}>
              {savingLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Bookmark
                  size={14}
                  fill={saved ? "currentColor" : "none"}
                  className="transition-transform duration-200"
                />
              )}
              {savingLoading
                ? "Processing..."
                : saved
                  ? "Saved · Click to remove"
                  : "Save Job"}
            </button>
          )}

          <Separator className="my-5 bg-emerald-500/15" />

          {/* Job info rows */}
          <div className="mb-5">
            {[
              { label: "Job Type", value: job.type },
              { label: "Salary", value: job.salary || "—" },
              { label: "Location", value: job.location },
              { label: "Deadline", value: formatDeadline(job.deadline || "-") },
            ].map((row, i, arr) => (
              <div
                key={i}
                className={`flex justify-between items-center py-[9px] ${
                  i < arr.length - 1 ? "border-b border-emerald-500/15" : ""
                }`}>
                <span className="text-[0.75rem] text-[#7a9585]">
                  {row.label}
                </span>
                <span className="text-[0.82rem] font-semibold">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* AI Match CTA — candidates only */}
          {!isHR && (
            <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-[12px] p-4">
              <div className="text-[0.75rem] font-bold text-emerald-400 tracking-[0.07em] uppercase mb-2">
                ✦ AI Match Score
              </div>
              <p className="text-[0.82rem] text-[#7a9585] leading-relaxed mb-[10px]">
                Upload your CV to find out how well you match this position.
              </p>
              <Link
                href="/analyze"
                className="flex items-center justify-center gap-2 w-full py-[9px] rounded-[9px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/20 transition-all">
                Analyze My CV →
              </Link>
            </div>
          )}
        </div>

        {/* Share card */}
        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] px-[22px] py-[18px]">
          <div className="text-[0.78rem] text-[#7a9585] mb-3">
            Share this job
          </div>
          <div className="flex gap-2">
            {SHARE_PLATFORMS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => handleShare(name)}
                title={`Share via ${name}`}
                className="flex-1 bg-[#141f19] border border-emerald-500/15 rounded-[8px] py-2 px-[6px] text-[#7a9585] text-[0.72rem] font-semibold hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all cursor-pointer flex items-center justify-center gap-[5px]">
                <Icon size={13} className="flex-shrink-0" />
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}