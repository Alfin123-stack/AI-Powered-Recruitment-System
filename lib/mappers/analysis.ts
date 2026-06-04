import type {
  AnalysisApiResponse,
  AnalysisData,
  AnalyzeApiResult,
} from "@/types/analyze";

// ─── DB response (snake_case) → AnalysisData ─────────────────────────────────
export function mapApiToAnalysisData(data: AnalysisApiResponse): AnalysisData {
  return {
    resumeScore: data.resume_score,
    atsScore: data.ats_score,
    overallScore: data.overall_score,
    readabilityScore: data.readability_score ?? undefined,
    impactScore: data.impact_score ?? undefined,
    skills: data.extracted_skills || [],
    categories: data.categories || [],
    strengths: data.strengths || [],
    improvements: data.improvements || [],
    atsChecks: data.ats_checks ?? undefined,
    lineFeedback: data.line_feedback ?? undefined,
    writingSuggestions: data.writing_suggestions ?? undefined,
    aiSummary: data.ai_summary ?? undefined,
    jobTitle: data.job_title ?? undefined,
    experienceLevel: data.experience_level ?? undefined,
    fileName: data.file_name,
    created_at: data.created_at,
    isFromDB: true,
  };
}

// ─── API analyze response (camelCase) → AnalysisData ─────────────────────────
export function mapResultToAnalysisData(
  result: AnalyzeApiResult,
  fileName: string,
): AnalysisData {
  return {
    resumeScore: result.resumeScore,
    atsScore: result.atsScore,
    overallScore: result.overallScore,
    readabilityScore: result.readabilityScore ?? undefined,
    impactScore: result.impactScore ?? undefined,
    skills: result.skills || [],
    categories: result.categories || [],
    strengths: result.strengths || [],
    improvements: result.improvements || [],
    atsChecks: result.atsChecks ?? undefined,
    lineFeedback: result.lineFeedback ?? undefined,
    writingSuggestions: result.writingSuggestions ?? undefined,
    aiSummary: result.aiSummary ?? undefined,
    jobTitle: result.jobTitle ?? undefined,
    experienceLevel: result.experienceLevel ?? undefined,
    fileName,
    isFromDB: false,
  };
}
