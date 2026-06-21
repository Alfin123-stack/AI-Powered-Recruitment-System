"use client";

import { AnalysisData } from "@/types/main/analyze";
import { useLatestAnalysis } from "@/hooks/main/useLatestAnalysis";
import { useAnalyzeFile } from "@/hooks/main/useAnalyzeFile";
import { useUserRole } from "@/hooks/main/useUserRole";
import { AnalyzeView } from "./AnalyzeView";
import AnalyzeSkeleton from "./AnalyzeSkeleton";

type Props = {
  initialData: AnalysisData | null;
};

export default function AnalyzeClient({ initialData }: Props) {
  const { analysisData, setAnalysisData, isFetchingInitial } =
    useLatestAnalysis(initialData);

  const { isLoading, handleFileSelect } = useAnalyzeFile(setAnalysisData);
  const { role, loading: roleLoading } = useUserRole();

  if (isFetchingInitial || roleLoading) return <AnalyzeSkeleton />;

  return (
    <AnalyzeView
      analysisData={analysisData}
      isLoading={isLoading}
      onFileSelect={handleFileSelect}
      role={role}
    />
  );
}