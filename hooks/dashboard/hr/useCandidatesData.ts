"use client";

import { useState, useEffect } from "react";
import {
  apiFetch,
  getColor,
  getInitials,
} from "@/app/(role)/dashboard/hr/_components/shared";
import { useDashboard } from "@/context/DashboardContext";

import type {
  ApplicationRaw,
  CandidateExtended,
  CandidateStatus,
  JobMeta,
} from "@/types/candidates";
import { JOB_COLORS } from "@/constants/candidates";
import { isToday } from "@/lib/helpers/candidates";

export function useCandidatesData() {
  const { token } = useDashboard();
  const [candidates, setCandidates] = useState<CandidateExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/applications/hr", token)
      .then((apps: ApplicationRaw[]) => {
        const mapped: CandidateExtended[] = apps.map((a, i) => ({
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
          status: a.status,
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
