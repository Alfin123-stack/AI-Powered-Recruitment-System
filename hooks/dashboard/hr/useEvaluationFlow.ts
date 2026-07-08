"use client";

import { useState, useCallback } from "react";
import type { Interview } from "@/types/calendar";
import type { EvaluationResult } from "@/components/hr/interviews/EvaluationModal";
import { sendRejectionAction } from "@/actions/rejectionActions";
import { apiFetch } from "@/lib/api";

export type EvaluationFlowStage =
  | "idle"
  | "evaluating"
  | "submitting"
  | "loading_offer"
  | "offer_confirm"
  | "offering"
  | "sending_rejection"
  | "done_offer"
  | "done_rejection"
  | "done_consider"
  | "error";

export interface EvaluationFlowState {
  stage: EvaluationFlowStage;
  interview: Interview | null;
  candidateEmail: string;
  companyName: string;
  evaluation: EvaluationResult | null;
  errorMessage: string;
}

/**
 * Orchestrates the post-interview flow:
 *   1. HR opens EvaluationModal            → stage: "evaluating"
 *   1b. Evaluation is persisted to backend → stage: "submitting"
 *   2a. Hire → confirm before offer letter → stage: "offer_confirm"
 *   2a'. HR confirms → opens OfferLetterModal → stage: "offering"
 *   2b. Reject → sends rejection email     → stage: "sending_rejection" → "done_rejection"
 *   2c. Consider → saved, no email sent    → stage: "done_consider"
 *   3. Offer sent                           → stage: "done_offer"
 *
 * Usage:
 *   const flow = useEvaluationFlow(token, fetchData);
 *   flow.start(interview, candidateEmail, companyName);
 *
 * `onSuccess` (opsional) dipanggil setiap kali evaluasi berhasil tersimpan
 * ke backend (hire/reject/consider) — dipakai parent untuk refetch list
 * interview supaya UI (status/tombol Evaluate) langsung ter-update tanpa
 * perlu reload manual.
 */
export function useEvaluationFlow(token: string, onSuccess?: () => void) {
  const [state, setState] = useState<EvaluationFlowState>({
    stage: "idle",
    interview: null,
    candidateEmail: "",
    companyName: "",
    evaluation: null,
    errorMessage: "",
  });

  /** Step 1 — HR clicks "Evaluate" on an interview card */
  const start = useCallback(
    (interview: Interview, candidateEmail: string, companyName: string) => {
      setState({
        stage: "evaluating",
        interview,
        candidateEmail,
        companyName,
        evaluation: null,
        errorMessage: "",
      });
    },
    [],
  );

  /**
   * Resume langsung ke step Offer Letter untuk kandidat yang statusnya
   * sudah "evaluated" (HR sudah pilih Hire & evaluasi sudah tersimpan di
   * backend sebelumnya) tapi offer letter belum sempat dikirim — misalnya
   * HR menutup/membatalkan OfferLetterModal di tengah jalan lalu reload
   * halaman, sehingga `evaluation` di state lokal sudah hilang.
   *
   * Berbeda dari `start()`: ini TIDAK membuka EvaluationModal lagi (evaluasi
   * sudah final, tidak boleh dievaluasi ulang), melainkan mengambil kembali
   * evaluasi "hire" yang sudah tersimpan lewat
   * GET /api/evaluations/application/:applicationId, lalu langsung set
   * stage ke "offering".
   *
   * FIX: sengaja langsung ke "offering", BUKAN "offer_confirm" — beda
   * dengan handleHire di bawah. HR yang memanggil resumeOffer() sudah
   * eksplisit memilih untuk melanjutkan ke offer letter (biasanya lewat
   * tombol "Lanjutkan ke Offer" di tabel kandidat berstatus "evaluated"),
   * jadi tidak perlu ditanya ulang lewat layar konfirmasi "offer_confirm" —
   * itu cuma relevan tepat setelah evaluasi Hire baru saja disubmit, saat
   * HR belum tentu berniat langsung lanjut ke offer letter.
   */
  const resumeOffer = useCallback(
    async (interview: Interview, candidateEmail: string, companyName: string) => {
      setState({
        stage: "loading_offer",
        interview,
        candidateEmail,
        companyName,
        evaluation: null,
        errorMessage: "",
      });

      try {
        const evaluations = await apiFetch(
          `/api/evaluations/application/${interview.application_id}`,
          token,
        );
        // Ambil evaluasi "hire" paling baru — endpoint mengembalikan
        // riwayat evaluasi (bisa lebih dari satu kalau pernah interview
        // ulang / dievaluasi lebih dari sekali), diurutkan created_at DESC
        // dari backend, jadi cukup ambil elemen pertama yang cocok.
        const hireEvaluation = (evaluations ?? []).find(
          (e: { recommendation: string }) => e.recommendation === "hire",
        );

        if (!hireEvaluation) {
          setState((prev) => ({
            ...prev,
            stage: "error",
            errorMessage:
              "Evaluasi 'Hire' untuk kandidat ini tidak ditemukan. Coba refresh halaman.",
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          stage: "offering",
          evaluation: {
            score: hireEvaluation.score,
            notes: hireEvaluation.notes ?? "",
            recommendation: "hire",
          },
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          stage: "error",
          errorMessage:
            err instanceof Error
              ? err.message
              : "Gagal memuat data evaluasi kandidat.",
        }));
      }
    },
    [token],
  );

  /**
   * Simpan evaluasi ke POST /api/evaluations. Dipanggil di ketiga cabang
   * (hire/reject/consider) karena score & notes harus tetap tersimpan
   * apapun rekomendasi HR-nya — sebelumnya evaluasi cuma hidup di state
   * React lalu hilang begitu modal ditutup, ga pernah kekirim ke backend.
   */
  const saveEvaluation = useCallback(
    async (interview: Interview, evaluation: EvaluationResult) => {
      await apiFetch("/api/evaluations", token, {
        method: "POST",
        body: JSON.stringify({
          application_id: interview.application_id,
          interview_id: interview.id,
          score: evaluation.score,
          recommendation: evaluation.recommendation,
          notes: evaluation.notes,
        }),
      });
    },
    [token],
  );

  /**
   * Set status candidate ke "evaluated". Dipakai HANYA di handleHire,
   * setelah evaluasi tersimpan tapi SEBELUM offer letter benar-benar
   * dikirim — supaya kalau HR menutup/membatalkan OfferLetterModal di
   * tengah jalan, status kandidat tidak nyangkut jadi "offered" padahal
   * offer belum terkirim. Fire-and-forget: kalau gagal, tidak
   * menggagalkan alur (evaluasi sudah kepakai), cukup dicatat di console.
   */
  const markEvaluated = useCallback(
    async (applicationId: string) => {
      try {
        await apiFetch(`/api/applications/${applicationId}/status`, token, {
          method: "PUT",
          body: JSON.stringify({ status: "evaluated" }),
        });
      } catch (err) {
        console.error(
          "[useEvaluationFlow] gagal update status ke 'evaluated':",
          err,
        );
      }
    },
    [token],
  );

  /** Step 2a — HR chose "Hire" in EvaluationModal */
  const handleHire = useCallback(
    async (evaluation: EvaluationResult) => {
      const { interview } = state;
      if (!interview) return;

      setState((prev) => ({ ...prev, stage: "submitting", evaluation }));

      try {
        await saveEvaluation(interview, evaluation);
        onSuccess?.();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          stage: "error",
          errorMessage:
            err instanceof Error ? err.message : "Gagal menyimpan evaluasi.",
        }));
        return;
      }

      // TAMBAHAN: ubah status ke "evaluated" sebelum lanjut ke form offer
      // letter (lihat komentar markEvaluated di atas).
      await markEvaluated(interview.application_id);

      // FIX: sebelumnya langsung `stage: "offering"` di sini — begitu
      // evaluasi Hire tersimpan, OfferLetterModal otomatis dirender tanpa
      // jeda. Sekarang berhenti dulu di "offer_confirm": Controller
      // menampilkan layar konfirmasi ("Buat Offer Sekarang" / "Nanti"),
      // dan cuma lanjut ke "offering" (baca: OfferLetterModal benar-benar
      // dibuka) kalau HR eksplisit klik confirmOffer(). Kalau HR pilih
      // "Nanti", reset() dipanggil dari Controller — status kandidat tetap
      // "evaluated" (sudah di-set barusan), jadi tidak hilang, tinggal
      // dilanjutkan lewat resumeOffer() kapan saja.
      setState((prev) => ({ ...prev, stage: "offer_confirm" }));
    },
    [state, saveEvaluation, markEvaluated, onSuccess],
  );

  /**
   * TAMBAHAN — dipanggil dari layar konfirmasi "offer_confirm" saat HR klik
   * "Buat Offer Sekarang". Guard `stage === "offer_confirm"` mencegah
   * pemanggilan nyasar (mis. tombol lama yang masih ter-mount) mengubah
   * stage dari state lain yang tidak terkait.
   */
  const confirmOffer = useCallback(() => {
    setState((prev) =>
      prev.stage === "offer_confirm" ? { ...prev, stage: "offering" } : prev,
    );
  }, []);

  /** Step 2b — HR chose "Reject" → save, then fire-and-forget email */
  const handleReject = useCallback(
    async (evaluation: EvaluationResult) => {
      const { interview, candidateEmail, companyName } = state;
      if (!interview) return;

      setState((prev) => ({ ...prev, stage: "submitting", evaluation }));

      try {
        await saveEvaluation(interview, evaluation);
        onSuccess?.();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          stage: "error",
          errorMessage:
            err instanceof Error ? err.message : "Gagal menyimpan evaluasi.",
        }));
        return;
      }

      setState((prev) => ({ ...prev, stage: "sending_rejection" }));

      const result = await sendRejectionAction({
        applicationId: interview.application_id,
        candidateName: interview.candidate_name ?? "Candidate",
        candidateEmail,
        jobTitle: interview.job_title ?? "",
        companyName,
        feedback: evaluation.notes,
      });

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          stage: "error",
          errorMessage: result.error,
        }));
        return;
      }

      setState((prev) => ({ ...prev, stage: "done_rejection" }));
    },
    [state, saveEvaluation, onSuccess],
  );

  /** Step 2c — HR chose "Consider" → save only, no email, no notification */
  const handleConsider = useCallback(
    async (evaluation: EvaluationResult) => {
      const { interview } = state;
      if (!interview) return;

      setState((prev) => ({ ...prev, stage: "submitting", evaluation }));

      try {
        await saveEvaluation(interview, evaluation);
        onSuccess?.();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          stage: "error",
          errorMessage:
            err instanceof Error ? err.message : "Gagal menyimpan evaluasi.",
        }));
        return;
      }

      setState((prev) => ({ ...prev, stage: "done_consider" }));
    },
    [state, saveEvaluation, onSuccess],
  );

  /** Step 3 — Offer letter sent successfully */
  const handleOfferSent = useCallback(() => {
    setState((prev) => ({ ...prev, stage: "done_offer" }));
  }, []);

  /** Reset to idle (close all modals) */
  const reset = useCallback(() => {
    setState({
      stage: "idle",
      interview: null,
      candidateEmail: "",
      companyName: "",
      evaluation: null,
      errorMessage: "",
    });
  }, []);

  return {
    ...state,
    start,
    resumeOffer,
    handleHire,
    confirmOffer,
    handleReject,
    handleConsider,
    handleOfferSent,
    reset,
  };
}