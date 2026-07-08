"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Gift,
  Wallet,
  CalendarDays,
  LayoutDashboard,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { respondToOfferAction } from "@/actions/offerResponseActions";

interface OfferResponseClientProps {
  applicationId: string;
  token: string;
  /** Which button the email link was for — pre-highlighted, not auto-submitted. */
  intent: "accept" | "decline";
  jobTitle: string;
  companyName: string;
  salary: string;
  startDate: string;
}

type Stage = "idle" | "submitting" | "accepted" | "declined" | "error";

/** Formats a salary value as Indonesian Rupiah when it's purely numeric
 *  (e.g. "8000000" -> "Rp 8.000.000"). If the value already has letters
 *  or symbols (e.g. "Rp 8.000.000 / month", "$3,000"), it's left as-is
 *  so HR's original wording is preserved. */
function formatSalary(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const isPureNumber = /^\d+([.,]\d+)?$/.test(trimmed);
  if (!isPureNumber) return trimmed;

  const numeric = Number(trimmed.replace(",", "."));
  if (Number.isNaN(numeric)) return trimmed;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

/** Formats a date string as "3 Juli 2026" for Indonesian candidates. */
function formatStartDate(raw: string): string {
  if (!raw) return raw;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function OfferResponseClient({
  applicationId,
  token,
  intent,
  jobTitle,
  companyName,
  salary,
  startDate,
}: OfferResponseClientProps) {
  const missingToken = !token;
  const [stage, setStage] = useState<Stage>(missingToken ? "error" : "idle");
  const [errorMessage, setErrorMessage] = useState(
    missingToken
      ? "This link is missing a required token. Please open the link from your email again."
      : "",
  );

  const respond = async (offerStatus: "accepted" | "declined") => {
    if (stage === "submitting") return;
    setStage("submitting");

    const result = await respondToOfferAction(applicationId, token, offerStatus);

    if (!result.success) {
      setErrorMessage(result.error);
      setStage("error");
      return;
    }

    setStage(offerStatus === "accepted" ? "accepted" : "declined");
  };

  // ── Done screens ──────────────────────────────────────────────────────────
  if (stage === "accepted" || stage === "declined") {
    const accepted = stage === "accepted";
    return (
      <Shell>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: accepted ? "rgba(16,185,129,0.12)" : "rgba(107,114,128,0.12)",
          }}
        >
          {accepted ? (
            <CheckCircle2 size={28} color="#10b981" />
          ) : (
            <XCircle size={28} color="#9ca3af" />
          )}
        </div>
        <h1 className="text-[1.1rem] font-black text-[#e8f0ec] mt-4">
          {accepted ? "Offer Accepted 🎉" : "Offer Declined"}
        </h1>
        <p className="text-[0.85rem] text-[#7a9585] leading-relaxed mt-2">
          {accepted
            ? "Thanks for confirming — the HR team has been notified and will be in touch about next steps."
            : "You've declined this offer. The HR team has been notified. We wish you the best in your job search."}
        </p>
        <Link
          href="/dashboard/candidate"
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-[0.82rem] font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all"
        >
          <LayoutDashboard size={14} />
          Go to Dashboard
        </Link>
      </Shell>
    );
  }

  // ── Error screen ─────────────────────────────────────────────────────────
  if (stage === "error") {
    return (
      <Shell>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.12)" }}
        >
          <AlertTriangle size={28} color="#ef4444" />
        </div>
        <h1 className="text-[1.1rem] font-black text-[#e8f0ec] mt-4">
          Something went wrong
        </h1>
        <p className="text-[0.85rem] text-red-400 leading-relaxed mt-2">
          {errorMessage}
        </p>
        {!missingToken && (
          <button
            onClick={() => setStage("idle")}
            className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-[0.82rem] font-bold border transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#9bb3a6",
            }}
          >
            <RotateCcw size={14} />
            Try again
          </button>
        )}
      </Shell>
    );
  }

  // ── Confirmation screen (idle / submitting) — the only place a mutation
  // can be triggered from, and only by an explicit click. ─────────────────
  const submitting = stage === "submitting";

  return (
    <Shell>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "rgba(16,185,129,0.12)" }}
      >
        <Gift size={26} color="#10b981" />
      </div>

      <h1 className="text-[1.1rem] font-black text-[#e8f0ec] mt-4">
        Confirm your response
      </h1>

      {(jobTitle || companyName) && (
        <p className="text-[0.85rem] text-[#c8d8d0] mt-2">
          <strong>{jobTitle}</strong>
          {companyName ? ` at ${companyName}` : ""}
        </p>
      )}

      {(salary || startDate) && (
        <div
          className="w-full mt-4 rounded-[10px] px-4 py-3 text-left text-[0.78rem]"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {salary && (
            <div className="flex justify-between items-center py-1">
              <span className="flex items-center gap-1.5 text-[#5d7a6a]">
                <Wallet size={13} />
                Salary
              </span>
              <span className="text-[#e8f0ec] font-semibold">{formatSalary(salary)}</span>
            </div>
          )}
          {startDate && (
            <div className="flex justify-between items-center py-1">
              <span className="flex items-center gap-1.5 text-[#5d7a6a]">
                <CalendarDays size={13} />
                Start date
              </span>
              <span className="text-[#e8f0ec] font-semibold">{formatStartDate(startDate)}</span>
            </div>
          )}
        </div>
      )}

      <p className="text-[0.78rem] text-[#5d7a6a] leading-relaxed mt-4">
        Please choose your response below. This action can&apos;t be undone once submitted.
      </p>

      <div className="flex gap-2 w-full mt-5">
        <button
          onClick={() => respond("declined")}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[0.82rem] font-bold transition-all border disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: intent === "decline" ? "rgba(239,68,68,0.1)" : "transparent",
            borderColor: intent === "decline" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)",
            color: intent === "decline" ? "#ef4444" : "#9bb3a6",
          }}
        >
          {submitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ThumbsDown size={14} />
          )}
          Decline
        </button>
        <button
          onClick={() => respond("accepted")}
          disabled={submitting}
          className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[0.82rem] font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ThumbsUp size={14} />
          )}
          Accept Offer
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] px-4">
      <div
        className="w-full max-w-[440px] rounded-[16px] p-8 flex flex-col items-center text-center"
        style={{ background: "#0d1310", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {children}
      </div>
    </div>
  );
}