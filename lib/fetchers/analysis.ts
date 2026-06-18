import { AnalysisData } from "@/types/main/analyze";
import { mapApiToAnalysisData } from "../mappers/analysis";

import { API } from "@/lib/api";

export async function fetchLatestAnalysis(
  accessToken: string,
): Promise<AnalysisData | null> {
  const res = await fetch(`${API}/api/cv-analysis/latest`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.resume_score) return null;

  return mapApiToAnalysisData(data);
}
