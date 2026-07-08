"use client";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  Send,
  Loader2,
  Gift,
  Mail,
  Bell,
  CheckCircle2,
  RefreshCcw,
  DollarSign,
  CalendarDays,
  MessageSquare,
  Timer,
} from "lucide-react";
import type { EvaluationResult } from "./EvaluationModal";
import { useInterviewsOfferLetter } from "@/hooks/dashboard/hr/useInterviewsOfferLetter";
import RichTextEditor from "./RichTextEditor";

export interface OfferLetterPayload {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  salary: string;
  startDate: string;
  notes: string;
  expiresAt: string;
}

interface OfferLetterModalProps {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  evaluation: EvaluationResult;
  onClose: () => void;
  onSent: () => void;
}

// Format angka mentah jadi "Rp 8.000.000". Menerima string apapun,
// membuang semua karakter non-digit dulu sebelum diberi separator ribuan.
function formatRupiah(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, "");
  if (!digitsOnly) return "";
  const numeric = Number(digitsOnly);
  return `Rp ${new Intl.NumberFormat("id-ID").format(numeric)}`;
}

function OfferSection({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-emerald-400/70">{icon}</span>
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#4d7060]">
        {label}
      </span>
      <div className="flex-1 h-px bg-emerald-500/10" />
    </div>
  );
}

export default function OfferLetterModal({
  applicationId,
  candidateName,
  candidateEmail,
  jobTitle,
  companyName,
  onClose,
  onSent,
}: OfferLetterModalProps) {
  const {
    salary,
    setSalary,
    startDate,
    setStartDate,
    notes,
    setNotes,
    expiryDays,
    setExpiryDays,
    sending,
    error,
    expiryPercent,
    handleSend,
  } = useInterviewsOfferLetter({
    applicationId,
    candidateName,
    candidateEmail,
    jobTitle,
    companyName,
  });

  const handleSubmit = async () => {
    // FIX: handleSend() now returns { ok, warning } instead of a plain
    // boolean, so it can carry a non-blocking warning (e.g. offer email
    // sent fine but the in-app notification failed to be created) without
    // treating the whole action as a failure.
    const result = await handleSend();
    if (result.ok) {
      toast.success(`Offer letter berhasil dikirim ke ${candidateName}`);
      if (result.warning) {
        // Separate, non-blocking toast so HR sees it without it looking
        // like the whole send failed. Falls back to a plain toast() call
        // if your installed `sonner` version doesn't export `.warning`.
        toast.warning(result.warning);
      }
      onSent();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[500px] max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Gift size={15} />
              </div>
              <div>
                <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
                  Send Offer Letter
                </h2>
                <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
                  {candidateName} · {jobTitle}
                </p>
              </div>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="w-8 h-8 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {/* Candidate info */}
            <div
              className="rounded-[10px] px-4 py-3"
              style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)" }}>
              <div className="text-[0.68rem] text-[#4d7060] font-bold uppercase tracking-wide mb-1">
                Sending to
              </div>
              <div className="text-[0.82rem] text-[#e8f0ec] font-semibold">{candidateName}</div>
              <div className="text-[0.72rem] text-[#5a8070]">{candidateEmail}</div>
            </div>

            <OfferSection label="Compensation" icon={<DollarSign size={12} />} />

            {/* Salary */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <DollarSign size={10} />
                </span>
                Salary / Compensation <span className="text-red-400 normal-case">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={salary}
                onChange={(e) => setSalary(formatRupiah(e.target.value))}
                placeholder="Rp 8.000.000 / month"
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <CalendarDays size={10} />
                </span>
                Start Date <span className="text-red-400 normal-case">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  colorScheme: "dark",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>

            <OfferSection label="Additional Details" icon={<MessageSquare size={12} />} />

            {/* Notes */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <MessageSquare size={10} />
                </span>
                Personal Message
                <span className="text-[#3d5c49] normal-case font-normal">(optional)</span>
              </label>
              <RichTextEditor
                value={notes}
                onChange={setNotes}
                placeholder="Write a personal message to the candidate..."
                minHeight={80}
              />
            </div>

            {/* Offer expiry */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center justify-between text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="flex items-center gap-[6px]">
                  <span className="opacity-60">
                    <Timer size={10} />
                  </span>
                  Offer Expires In
                </span>
                <span
                  className="normal-case font-bold text-[0.72rem] px-2 py-[3px] rounded-full"
                  style={{ background: "rgba(16,185,129,0.14)", color: "#34d399" }}>
                  {expiryDays} day{expiryDays !== 1 ? "s" : ""}
                </span>
              </label>

              <div className="offer-slider relative pt-1">
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="offer-slider-input w-full cursor-pointer"
                  style={
                    {
                      "--fill": `${expiryPercent}%`,
                    } as React.CSSProperties
                  }
                />
                {/* Tick marks */}
                <div className="flex justify-between px-[2px] mt-[6px]">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
                    <span
                      key={day}
                      className="rounded-full transition-all"
                      style={{
                        width: day % 7 === 0 || day === 1 ? "3px" : "2px",
                        height: day % 7 === 0 || day === 1 ? "6px" : "4px",
                        background:
                          day <= expiryDays
                            ? "rgba(16,185,129,0.55)"
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-[0.62rem] text-[#3d5c49] font-medium mt-2">
                <span>1 day</span>
                <span>7 days</span>
                <span>14 days</span>
              </div>

              <style jsx>{`
                .offer-slider-input {
                  -webkit-appearance: none;
                  appearance: none;
                  height: 6px;
                  border-radius: 999px;
                  background: linear-gradient(
                    to right,
                    #10b981 var(--fill),
                    rgba(255, 255, 255, 0.07) var(--fill)
                  );
                  outline: none;
                  transition: box-shadow 0.15s ease;
                }

                .offer-slider-input::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #eafff5;
                  border: 3px solid #10b981;
                  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.18),
                    0 2px 6px rgba(0, 0, 0, 0.4);
                  cursor: pointer;
                  transition: transform 0.15s ease, box-shadow 0.15s ease;
                }

                .offer-slider-input::-webkit-slider-thumb:hover {
                  transform: scale(1.15);
                  box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.22),
                    0 2px 6px rgba(0, 0, 0, 0.4);
                }

                .offer-slider-input:active::-webkit-slider-thumb {
                  transform: scale(1.05);
                  background: #10b981;
                }

                .offer-slider-input::-moz-range-track {
                  height: 6px;
                  border-radius: 999px;
                  background: rgba(255, 255, 255, 0.07);
                }

                .offer-slider-input::-moz-range-progress {
                  height: 6px;
                  border-radius: 999px;
                  background: #10b981;
                }

                .offer-slider-input::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #eafff5;
                  border: 3px solid #10b981;
                  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.18);
                  cursor: pointer;
                  transition: transform 0.15s ease;
                }

                .offer-slider-input::-moz-range-thumb:hover {
                  transform: scale(1.15);
                }
              `}</style>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-[0.75rem] text-red-400"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            {/* What happens info */}
            <div
              className="rounded-[10px] px-3 py-2.5 text-[0.72rem] text-[#5a8070]"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="font-bold text-[#4d7060] mb-2 text-[0.65rem] uppercase tracking-wide">
                What happens next
              </div>
              <div className="flex flex-col gap-[7px]">
                <span className="flex items-center gap-2">
                  <Mail size={13} className="text-emerald-400 shrink-0" />
                  Candidate receives an offer email at{" "}
                  <strong className="text-[#e8f0ec]">{candidateEmail}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <Bell size={13} className="text-emerald-400 shrink-0" />
                  In-app notification is created on their dashboard
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  They can accept or decline within {expiryDays} days
                </span>
                <span className="flex items-center gap-2">
                  <RefreshCcw size={13} className="text-emerald-400 shrink-0" />
                  You will be notified of their response
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-4 border-t border-emerald-500/10 bg-[#080f0b] flex-shrink-0">
            <button
              onClick={onClose}
              disabled={sending}
              className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer disabled:opacity-40">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={sending || !salary.trim() || !startDate}
              className="flex-[2] flex items-center justify-center gap-2 py-[10px] rounded-[10px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.82rem] font-bold transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed">
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Send Offer Letter
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}