// @/components/analyze/AnalyzeClient.tsx
// CSR orchestrator — wiring dua hook ke AnalyzeView, tidak ada logika di sini

"use client";

import { AnalysisData } from "@/types/analyze";
import { useLatestAnalysis } from "@/hooks/main/useLatestAnalysis";
import { useAnalyzeFile } from "@/hooks/main/useAnalyzeFile";
import { AnalyzeView } from "./AnalyzeView";
import AnalyzeSkeleton from "./AnalyzeSkeleton";

type Props = {
  initialData: AnalysisData | null;
};

export default function AnalyzeClient({ initialData }: Props) {
  const { analysisData, setAnalysisData, isFetchingInitial } =
    useLatestAnalysis(initialData);

  const { isLoading, handleFileSelect } = useAnalyzeFile(setAnalysisData);

  if (isFetchingInitial) return <AnalyzeSkeleton />;

  return (
    <AnalyzeView
      analysisData={analysisData}
      isLoading={isLoading}
      onFileSelect={handleFileSelect}
    />
  );
}
