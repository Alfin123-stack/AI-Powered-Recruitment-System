"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AnalyzeHero from "@/components/analyze/AnalyzeHero";
import AnalyzeResult from "@/components/analyze/AnalyzeResult";
import AnalyzeSkeleton from "@/components/analyze/AnalyzeSkeleton";
import EmptyState from "@/components/analyze/EmptyState";
import { extractTextFromPDF } from "@/components/analyze/analyze-helpers";
import { fetchLatestAnalysis } from "@/lib/fetchers/analysis";
import { persistAnalysis } from "@/lib/api/analysis";
import { mapResultToAnalysisData } from "@/lib/mappers/analysis";
import { AnalysisData } from "@/types/analyze";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Props = {
  initialData: AnalysisData | null;
};

export default function AnalyzeClient({ initialData }: Props) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(
    initialData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitial, setIsFetchingInitial] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;

    async function loadLatest() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const data = await fetchLatestAnalysis(session.access_token);
        if (data) setAnalysisData(data);
      } catch {
        // silent fail — user tinggal upload baru
      } finally {
        setIsFetchingInitial(false);
      }
    }

    loadLatest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isFetchingInitial) return <AnalyzeSkeleton />;

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const extractedText = await extractTextFromPDF(file);

      const res = await fetch(`${API}/api/ai/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });
      if (!res.ok) throw new Error("Analisis gagal");
      const result = await res.json();

      const newData = mapResultToAnalysisData(result, file.name);
      setAnalysisData(newData);

      // Persist to DB — fire-and-forget
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          await persistAnalysis(result, file.name, session.access_token);
        }
      } catch {
        // Non-critical — user tetap lihat hasil
      }
    } catch (err) {
      console.error("Analisis gagal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d0b] text-[#e8f0ec]">
      <main className="pt-16 min-h-screen">
        <AnalyzeHero isLoading={isLoading} analysisData={analysisData} />
        <AnimatePresence mode="wait">
          {analysisData ? (
            <AnalyzeResult
              key="result"
              data={analysisData}
              onReanalyze={handleFileSelect}
              isLoading={isLoading}
            />
          ) : (
            <EmptyState
              key="empty"
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
