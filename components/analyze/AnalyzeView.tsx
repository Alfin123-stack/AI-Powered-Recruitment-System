// @/components/analyze/AnalyzeView.tsx
// Layout presentasional — menerima semua data & handler sebagai props

import { AnimatePresence } from "framer-motion";
import AnalyzeHero from "./AnalyzeHero";
import AnalyzeResult from "./AnalyzeResult";
import EmptyState from "./AnalyzeEmptyState";
import { AnalysisData } from "@/types/analyze";

interface AnalyzeViewProps {
  analysisData: AnalysisData | null;
  isLoading: boolean;
  onFileSelect: (file: File) => Promise<void>;
}

export function AnalyzeView({
  analysisData,
  isLoading,
  onFileSelect,
}: AnalyzeViewProps) {
  return (
    <div className="min-h-screen bg-[#090d0b] text-[#e8f0ec]">
      <main className="pt-16 min-h-screen">
        <AnalyzeHero isLoading={isLoading} analysisData={analysisData} />
        <AnimatePresence mode="wait">
          {analysisData ? (
            <AnalyzeResult
              key="result"
              data={analysisData}
              onReanalyze={onFileSelect}
              isLoading={isLoading}
            />
          ) : (
            <EmptyState
              key="empty"
              onFileSelect={onFileSelect}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
