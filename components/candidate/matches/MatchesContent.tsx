

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/getServerSession";

import type { JobWithMatch } from "../../../types/candidate/matches";
import MatchesList from "./MatchesList";
import MatchesNoCVState from "./MatchesNoCVState";

import { getColor } from "@/lib/utils";
import {
  fetchCvAnalysis,
  fetchJobs,
} from "@/lib/fetchers/candidate/dashboard";
import { fetchMyApplications } from "@/lib/fetchers/candidate/matches";
import { calcMatchScore } from "@/lib/helpers/candidate/matches";

// ── Private sub-component ─────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="mb-6">
      <div className="font-bold text-[1rem]">Job Matches</div>
      <div className="text-[0.73rem] text-white/35 mt-[2px]">
        Cocokkan skills CV kamu dengan lowongan yang tersedia
      </div>
    </div>
  );
}

// ── Server Component ──────────────────────────────────────────────────────────

export default async function MatchesContent() {
  const session = await getServerSession();

  if (!session?.access_token) {
    redirect("/login");
  }

  const token = session.access_token;

  const [cvAnalysis, allJobs, myApps] = await Promise.all([
    fetchCvAnalysis(token),
    fetchJobs(),
    fetchMyApplications(token),
  ]);

  if (!cvAnalysis) {
    return (
      <div>
        <PageHeader />
        <MatchesNoCVState />
      </div>
    );
  }

  const candidateSkills = cvAnalysis.extracted_skills.map((s) => s.name);
  const appliedJobIds = new Set(myApps.map((a) => a.job_id));

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
    if (a.alreadyApplied !== b.alreadyApplied) return a.alreadyApplied ? 1 : -1;
    return b.matchScore - a.matchScore;
  });

  return <MatchesList jobs={jobsWithMatch} cvAnalysis={cvAnalysis} />;
}
