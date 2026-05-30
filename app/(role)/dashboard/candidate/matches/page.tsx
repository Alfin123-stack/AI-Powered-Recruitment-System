"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/app/(role)/layout";
import type {
  Job,
  JobWithMatch,
  CvAnalysis,
} from "../../../../../components/candidate/matches/types";
import {
  calcMatchScore,
  getColor,
} from "../../../../../components/candidate/matches/helpers";
import JobMatchList from "../../../../../components/candidate/matches/JobMatchList";
import NoCvState from "../../../../../components/candidate/matches/NoCvState";

// Import skeleton langsung — bukan dari loading.tsx
// karena loading.tsx hanya bekerja untuk server component + Suspense,
// bukan untuk client component yang fetch pakai useEffect.
import MatchesLoading from "../../../../../components/candidate/matches/MatchesLoading";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MatchesPage() {
  const { token } = useDashboard();
  const [jobs, setJobs] = useState<JobWithMatch[]>([]);
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const cvRes = await fetch(`${API}/api/cv-analysis/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cvRes.ok) {
          setLoading(false);
          return;
        }

        const cvData: CvAnalysis = await cvRes.json();

        if (!cvData?.extracted_skills) {
          setLoading(false);
          return;
        }

        setCvAnalysis(cvData);

        const candidateSkills = cvData.extracted_skills.map((s) => s.name);

        const jobsRes = await fetch(`${API}/api/jobs`);
        const allJobs: Job[] = await jobsRes.json();

        const appsRes = await fetch(`${API}/api/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myApps = await appsRes.json();
        const appliedJobIds = new Set((myApps || []).map((a: any) => a.job_id));

        const jobsWithMatch: JobWithMatch[] = allJobs.map((job, i) => {
          const { score, matched, missing } = calcMatchScore(
            candidateSkills,
            job.skills || [],
          );
          return {
            ...job,
            matchScore: score,
            matchedSkills: matched,
            missingSkills: missing,
            alreadyApplied: appliedJobIds.has(job.id),
            color: getColor(i),
          };
        });

        jobsWithMatch.sort((a, b) => {
          if (a.alreadyApplied !== b.alreadyApplied)
            return a.alreadyApplied ? 1 : -1;
          return b.matchScore - a.matchScore;
        });

        setJobs(jobsWithMatch);
      } catch (err) {
        console.error("[MatchesPage]", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Tampilkan skeleton saat masih loading
  if (loading) return <MatchesLoading />;

  // Belum ada analisis CV
  if (!cvAnalysis) {
    return (
      <div>
        <div className="mb-6">
          <div className="font-bold text-[1rem]">Job Matches</div>
          <div className="text-[0.73rem] text-white/35 mt-[2px]">
            Cocokkan skills CV kamu dengan lowongan yang tersedia
          </div>
        </div>
        <NoCvState />
      </div>
    );
  }

  return <JobMatchList jobs={jobs} cvAnalysis={cvAnalysis} />;
}
