"use client";

import { useState, useEffect } from "react";

import { useDashboard } from "@/context/DashboardContext";

import type {
  CandidateRaw,
  CandidateStatus,
  JobMeta,
} from "@/types/candidates";
import { JOB_COLORS } from "@/constants/candidates";
import { isToday } from "@/lib/helpers/candidate/dashboard";
import { Application } from "@/types/hr/dashboard";
import { apiFetch } from "@/lib/api";
import { getColor, getInitials } from "@/lib/utils";

// ── Turunkan status tampilan dari 2 kolom backend (`status` +
// `offer_status`), bukan cuma copy `status` mentah seperti sebelumnya. ──
//
// PENTING: "accepted" TIDAK PERNAH dikembalikan di sini secara sengaja.
// Alasannya: di updateOfferStatus (applicationController.js), begitu
// offer_status di-set "accepted", `status` langsung di-set "hired" di
// baris yang sama — tidak ada jeda waktu di mana kandidat "accepted tapi
// belum hired" untuk dibaca dari data. Jadi begitu status backend sudah
// "hired", kita berhenti di situ; tidak perlu (dan tidak bisa) membedakan
// lebih jauh menjadi "accepted".
function deriveDisplayStatus(a: Application): CandidateStatus {
  // hired & rejected adalah status akhir — offer_status tidak lagi relevan
  // begitu sampai di sini.
  if (a.status === "hired" || a.status === "rejected") {
    return a.status;
  }

  if (a.offer_status === "declined") return "declined";

  if (a.offer_status === "pending") {
    const isExpired =
      !!a.offer_expires_at && new Date(a.offer_expires_at) < new Date();
    return isExpired ? "expired" : "offered";
  }

  // applied | review | shortlisted | offered (belum ada offer_status sama
  // sekali, mis. baru dipindah manual ke "offered" tapi belum kirim link).
  return a.status as CandidateStatus;
}

export function useCandidatesData() {
  const { token } = useDashboard();
  const [candidates, setCandidates] = useState<CandidateRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/applications/hr", token)
      .then((apps: Application[]) => {
        const mapped: CandidateRaw[] = apps.map((a, i) => ({
          id: a.id,
          name: a.candidate_name ?? "Kandidat",
          avatar: getInitials(a.candidate_name ?? "KD"),
          job: a.job_title ?? "-",
          jobId: a.job_id ?? "",
          resumeScore: a.resume_score ?? 0,
          matchScore: a.matching_score ?? 0,
          skills: (a.extracted_skills ?? [])
            .slice(0, 6)
            .map((s) => (typeof s === "string" ? s : (s.name ?? ""))),
          status: deriveDisplayStatus(a),
          // FIX: sebelumnya tidak di-mapping sama sekali — tombol "Kirim
          // Onboarding Email" balik ke status awal setiap kali halaman
          // di-refresh, walau backend sudah menyimpan true. Sekarang
          // dibaca langsung dari response API.
          onboarding_sent: a.onboarding_sent ?? false,
          appliedDate: new Date(a.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          created_at: a.created_at,
          color: getColor(i),
          cv_url: a.cv_url ?? null,
          email: a.candidate_email ?? "",
          phone: a.candidate_phone ?? "",
          location: a.location ?? "Jakarta",
        }));
        setCandidates(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (
    applicationId: string,
    status: CandidateStatus,
  ) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === applicationId ? { ...c, status } : c)),
    );
    try {
      await apiFetch(`/api/applications/${applicationId}/status`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const jobMetas: JobMeta[] = [...new Set(candidates.map((c) => c.job))]
    .sort()
    .map((job, i) => {
      const jobCandidates = candidates.filter((c) => c.job === job);
      return {
        key: job,
        label: job,
        color: JOB_COLORS[i % JOB_COLORS.length],
        count: jobCandidates.length,
        todayCount: jobCandidates.filter((c) => isToday(c.created_at)).length,
      };
    });

  const getJobColor = (job: string): string =>
    jobMetas.find((j) => j.key === job)?.color ?? "#7a9585";

  return { candidates, loading, jobMetas, getJobColor, updateStatus };
}