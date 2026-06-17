export { timeAgoShort as timeAgo, getColor, PALETTE as COLORS } from "@/lib/utils";

/**
 * calcMatchScore — canonical implementation.
 * Default score 50 jika jobSkills kosong (karena tidak ada requirements = semua bisa match).
 * Default score 0 jika candidateSkills kosong.
 */
export const calcMatchScore = (
  candidateSkills: string[],
  jobSkills: string[],
): { score: number; matched: string[]; missing: string[] } => {
  if (!jobSkills.length) return { score: 50, matched: [], missing: [] };
  if (!candidateSkills.length)
    return { score: 0, matched: [], missing: jobSkills };

  const normalize = (s: string) => s.toLowerCase().trim();
  const jobNorm = jobSkills.map(normalize);
  const candidateNorm = candidateSkills.map(normalize);

  const matched = jobSkills.filter((js) => {
    const jsNorm = normalize(js);
    return candidateNorm.some(
      (cs) => cs.includes(jsNorm) || jsNorm.includes(cs),
    );
  });

  const missing = jobSkills.filter((js) => {
    const jsNorm = normalize(js);
    return !candidateNorm.some(
      (cs) => cs.includes(jsNorm) || jsNorm.includes(cs),
    );
  });

  const score = Math.round((matched.length / jobSkills.length) * 100);
  return { score: Math.min(score, 100), matched, missing };
};

export const getMatchLabel = (
  score: number,
): { label: string; color: string; bg: string } => {
  if (score >= 80)
    return { label: "Sangat Cocok", color: "#10b981", bg: "#10b98115" };
  if (score >= 60) return { label: "Cocok", color: "#06b6d4", bg: "#06b6d415" };
  if (score >= 40)
    return { label: "Cukup Cocok", color: "#f59e0b", bg: "#f59e0b15" };
  return { label: "Kurang Cocok", color: "#6b7280", bg: "#6b728015" };
};
