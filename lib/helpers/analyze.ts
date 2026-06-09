import { AnalysisData } from "@/types/analyze";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
export function gradeLabel(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  return "C";
}

export function scoreColor(score: number): string {
  if (score >= 70) return "#4ade80";
  if (score >= 50) return "#f59e0b";
  return "#f87171";
}

export function scoreColorMuted(score: number): string {
  if (score >= 70) return "rgba(74,222,128,0.55)";
  if (score >= 50) return "rgba(245,158,11,0.55)";
  return "rgba(248,113,113,0.55)";
}

export function scoreColorBg(score: number): string {
  if (score >= 70) return "rgba(74,222,128,0.07)";
  if (score >= 50) return "rgba(245,158,11,0.07)";
  return "rgba(248,113,113,0.07)";
}

export function scoreColorBorder(score: number): string {
  if (score >= 70) return "rgba(74,222,128,0.15)";
  if (score >= 50) return "rgba(245,158,11,0.15)";
  return "rgba(248,113,113,0.15)";
}

export function buildAISummary(data: AnalysisData): string {
  const level =
    data.overallScore >= 85
      ? "sangat kuat"
      : data.overallScore >= 70
        ? "solid"
        : "butuh perbaikan";
  const topSkills = data.skills
    .slice(0, 3)
    .map((s) => s.name)
    .join(", ");
  const missingCount = (data.atsChecks ?? []).filter((c) => !c.ok).length;
  return `CV ini menunjukkan profil ${level} dengan keahlian utama di ${topSkills || "berbagai bidang"}. ATS score ${data.atsScore}/100 — ${
    missingCount > 0
      ? `${missingCount} poin perlu diperbaiki agar lolos sistem rekrutmen otomatis.`
      : "semua kriteria ATS terpenuhi."
  } Prioritas: ${data.improvements[0]?.toLowerCase() ?? "perkuat deskripsi pengalaman dengan angka kuantitatif"}.`;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() })
    .promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText +=
      content.items
        .map((item: TextItem | TextMarkedContent) =>
          "str" in item ? item.str : "",
        )
        .join(" ") + "\n";
  }

  return fullText.trim();
}
