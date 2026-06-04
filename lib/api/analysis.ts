import { AnalyzeApiResult } from "@/types/analyze";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function persistAnalysis(
  result: AnalyzeApiResult,
  fileName: string,
  accessToken: string,
): Promise<void> {
  await fetch(`${API}/api/cv-analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      resume_score: result.resumeScore,
      ats_score: result.atsScore,
      overall_score: result.overallScore,
      readability_score: result.readabilityScore ?? null,
      impact_score: result.impactScore ?? null,
      extracted_skills: result.skills || [],
      categories: result.categories || [],
      strengths: result.strengths || [],
      improvements: result.improvements || [],
      ats_checks: result.atsChecks ?? null,
      line_feedback: result.lineFeedback ?? null,
      writing_suggestions: result.writingSuggestions ?? null,
      ai_summary: result.aiSummary ?? null,
      job_title: result.jobTitle ?? null,
      experience_level: result.experienceLevel ?? null,
      file_name: fileName,
    }),
  });
}
