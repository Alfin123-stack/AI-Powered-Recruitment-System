// page.tsx
import { Suspense } from "react";
import AnalyzeClient from "@/components/analyze/AnalyzeClient";
import AnalyzeSkeleton from "@/components/analyze/AnalyzeSkeleton";

export default function AnalyzePage() {
  return (
    <Suspense fallback={<AnalyzeSkeleton />}>
      <AnalyzeClient initialData={null} />
    </Suspense>
  );
}

export const metadata = {
  title: "Analisis CV | AI Resume Analyzer",
  description:
    "Upload CV kamu dan dapatkan skor, ATS check, feedback, dan saran penulisan dalam hitungan detik.",
};
