"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Clock, FileSignature, ArrowRight } from "lucide-react";
import EvaluationModal from "./EvaluationModal";
import OfferLetterModal from "./OfferLetterModal";
import { useEvaluationFlow } from "@/hooks/dashboard/hr/useEvaluationFlow";
import type { Interview } from "@/types/calendar";

interface EvaluationFlowControllerProps {
  /** Expose flow.start() to parent via ref or render prop */
  flow: ReturnType<typeof useEvaluationFlow>;
  companyName: string;
}

/**
 * Drop this component anywhere in the HR interviews page.
 * Parent controls when to open via flow.start(interview, email, company).
 *
 * Example in parent:
 *   const flow = useEvaluationFlow();
 *   ...
 *   <button onClick={() => flow.start(interview, candidate.email, company.name)}>
 *     Evaluate
 *   </button>
 *   <EvaluationFlowController flow={flow} companyName={company.name} />
 */
export default function EvaluationFlowController({
  flow,
  companyName,
}: EvaluationFlowControllerProps) {
  const {
    stage,
    interview,
    candidateEmail,
    evaluation,
    errorMessage,
    handleHire,
    confirmOffer,
    handleReject,
    handleConsider,
    handleOfferSent,
    reset,
  } = flow;

  return (
    <>
      {/* ── Step 1: Evaluation form ── */}
      {stage === "evaluating" && interview && (
        <EvaluationModal
          interview={interview}
          candidateEmail={candidateEmail}
          companyName={companyName}
          onClose={reset}
          onHire={handleHire}
          onReject={handleReject}
          onConsider={handleConsider}
        />
      )}

      {/* ── Step 1b: Saving evaluation to database ── */}
      {stage === "submitting" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="rounded-[14px] px-8 py-6 flex flex-col items-center gap-3"
            style={{ background: "#0a0f0c", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Loader2 size={28} className="text-emerald-400 animate-spin" />
            <p className="text-[0.85rem] text-[#7a9585]">Saving evaluation...</p>
          </div>
        </div>
      )}

      {/* ── Step 1c: Loading a previously-saved "hire" evaluation before
           resuming to the offer letter (resumeOffer()) ── */}
      {/* TAMBAHAN: stage "loading_offer" sebelumnya tidak punya render sama
          sekali di sini — selama fetch GET /api/evaluations/application/:id
          berjalan di resumeOffer(), layar cuma kosong tanpa indikasi apa
          pun sedang terjadi. */}
      {stage === "loading_offer" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="rounded-[14px] px-8 py-6 flex flex-col items-center gap-3"
            style={{ background: "#0a0f0c", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Loader2 size={28} className="text-emerald-400 animate-spin" />
            <p className="text-[0.85rem] text-[#7a9585]">Loading evaluation data...</p>
          </div>
        </div>
      )}

      {/* ── Step 2a-pre: konfirmasi sebelum form offer letter dibuka ── */}
      {/* FIX: sebelumnya begitu evaluasi Hire tersimpan, stage langsung
          "offering" dan OfferLetterModal otomatis dirender tanpa jeda.
          Sekarang handleHire di useEvaluationFlow berhenti dulu di stage
          "offer_confirm" — layar ini yang dirender di situ, dan
          OfferLetterModal (di bawah) cuma dibuka kalau HR eksplisit klik
          "Buat Offer Sekarang" (memanggil flow.confirmOffer()).
          NOTE: resumeOffer() TIDAK pernah mengarah ke "offer_confirm" —
          dia langsung ke "offering", karena HR yang memanggil resumeOffer
          sudah eksplisit memilih lanjut ke offer letter (lihat komentar di
          useEvaluationFlow.ts), jadi tidak perlu ditanya ulang di sini. */}
      <AnimatePresence>
        {stage === "offer_confirm" && interview && evaluation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-[16px] px-8 py-8 flex flex-col items-center gap-3 text-center max-w-[340px]"
              style={{ background: "#0a0f0c", border: "1px solid rgba(16,185,129,0.25)" }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.12)" }}>
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-[1rem] font-black text-[#e8f0ec]">
                Evaluasi Tersimpan
              </h3>
              <p className="text-[0.78rem] text-[#5d7a6a] leading-relaxed">
                {interview.candidate_name ?? "Kandidat ini"} direkomendasikan
                untuk di-hire. Buat offer letter sekarang, atau lanjutkan
                nanti dari halaman kandidat.
              </p>
              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={reset}
                  className="flex-1 py-[10px] rounded-[9px] text-[0.8rem] font-bold transition-all cursor-pointer border"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                    color: "#9bb3a6",
                  }}>
                  Nanti
                </button>
                <button
                  onClick={confirmOffer}
                  className="flex-[1.4] flex items-center justify-center gap-2 py-[10px] rounded-[9px] text-[0.8rem] font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all cursor-pointer border-0">
                  <FileSignature size={14} />
                  Buat Offer Sekarang
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 2a: Offer letter form ── */}
      {stage === "offering" && interview && evaluation && (
        <OfferLetterModal
          applicationId={interview.application_id}
          candidateName={interview.candidate_name ?? "Candidate"}
          candidateEmail={candidateEmail}
          jobTitle={interview.job_title ?? ""}
          companyName={companyName}
          evaluation={evaluation}
          onClose={reset}
          onSent={handleOfferSent}
        />
      )}

      {/* ── Step 2b: Rejection sending spinner ── */}
      {stage === "sending_rejection" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="rounded-[14px] px-8 py-6 flex flex-col items-center gap-3"
            style={{ background: "#0a0f0c", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Loader2 size={28} className="text-emerald-400 animate-spin" />
            <p className="text-[0.85rem] text-[#7a9585]">Sending rejection notification...</p>
          </div>
        </div>
      )}

      {/* ── Done: Offer sent ── */}
      <AnimatePresence>
        {stage === "done_offer" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={reset}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-[16px] px-8 py-8 flex flex-col items-center gap-3 text-center max-w-[320px]"
              style={{ background: "#0a0f0c", border: "1px solid rgba(16,185,129,0.25)" }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.12)" }}>
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-[1rem] font-black text-[#e8f0ec]">Offer Sent!</h3>
              <p className="text-[0.78rem] text-[#5d7a6a] leading-relaxed">
                The offer letter has been sent via email and in-app notification.
                You will be notified when the candidate responds.
              </p>
              <button
                onClick={reset}
                className="mt-1 px-6 py-2 rounded-[9px] text-[0.8rem] font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all cursor-pointer border-0">
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Done: Rejection sent ── */}
      <AnimatePresence>
        {stage === "done_rejection" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={reset}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-[16px] px-8 py-8 flex flex-col items-center gap-3 text-center max-w-[320px]"
              style={{ background: "#0a0f0c", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(107,114,128,0.1)" }}>
                <XCircle size={28} className="text-gray-400" />
              </div>
              <h3 className="text-[1rem] font-black text-[#e8f0ec]">Rejection Sent</h3>
              <p className="text-[0.78rem] text-[#5d7a6a] leading-relaxed">
                The candidate has been notified via email and in-app notification
                with your feedback.
              </p>
              <button
                onClick={reset}
                className="mt-1 px-6 py-2 rounded-[9px] text-[0.8rem] font-bold transition-all cursor-pointer border"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "#9bb3a6",
                }}>
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Done: Evaluation saved as "Consider" ── */}
      <AnimatePresence>
        {stage === "done_consider" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={reset}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-[16px] px-8 py-8 flex flex-col items-center gap-3 text-center max-w-[320px]"
              style={{ background: "#0a0f0c", border: "1px solid rgba(245,158,11,0.25)" }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.12)" }}>
                <Clock size={28} className="text-amber-400" />
              </div>
              <h3 className="text-[1rem] font-black text-[#e8f0ec]">Evaluation Saved</h3>
              <p className="text-[0.78rem] text-[#5d7a6a] leading-relaxed">
                Marked as &quot;Consider&quot;. No notification was sent — you can decide later.
              </p>
              <button
                onClick={reset}
                className="mt-1 px-6 py-2 rounded-[9px] text-[0.8rem] font-bold transition-all cursor-pointer border"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "#9bb3a6",
                }}>
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error state ── */}
      <AnimatePresence>
        {stage === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={reset}>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="rounded-[16px] px-8 py-8 flex flex-col items-center gap-3 text-center max-w-[320px]"
              style={{ background: "#0a0f0c", border: "1px solid rgba(239,68,68,0.25)" }}>
              <XCircle size={28} className="text-red-400" />
              <h3 className="text-[1rem] font-black text-[#e8f0ec]">Something went wrong</h3>
              <p className="text-[0.78rem] text-red-400">{errorMessage}</p>
              <button
                onClick={reset}
                className="px-6 py-2 rounded-[9px] text-[0.8rem] font-bold text-black bg-red-500 hover:bg-red-400 transition-all cursor-pointer border-0">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}