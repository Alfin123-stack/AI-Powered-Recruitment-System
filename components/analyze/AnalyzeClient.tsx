"use client";

// ─── ANALYZE CLIENT SHELL ─────────────────────────────────────────────────────
// CSR: owns all mutable state (upload, analysis result, loading).
// initialData selalu null (server tidak bisa baca Supabase session).
// Data awal di-fetch client-side via useEffect + Bearer token.

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AnalyzeHero from "@/components/analyze/AnalyzeHero";
import AnalyzeResult from "@/components/analyze/AnalyzeResult";
import AnalyzeSkeleton from "@/components/analyze/AnalyzeSkeleton";
import EmptyState from "@/components/analyze/EmptyState";
import { extractTextFromPDF } from "./analyze-helpers";
import type { AnalysisData } from "./analyze";

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

  // ─── Fetch data terakhir saat mount (client-side, pakai Bearer token) ────────
  useEffect(() => {
    if (initialData) return; // kalau server sudah kasih data, skip

    async function fetchLatest() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const res = await fetch(`${API}/api/cv-analysis/latest`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        if (!data?.resume_score) return;

        setAnalysisData({
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
        });
      } catch {
        // silent fail — user tinggal upload baru
      } finally {
        setIsFetchingInitial(false);
      }
    }

    fetchLatest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Tampilkan skeleton selama fetch awal berlangsung
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

      const newData: AnalysisData = {
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
        fileName: file.name,
        isFromDB: false,
      };
      setAnalysisData(newData);

      // Persist to DB jika session ada (fire-and-forget)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch(`${API}/api/cv-analysis`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
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
              file_name: file.name,
            }),
          });
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
        {/* Hero — CSR karena baca live loading/result state */}
        <AnalyzeHero isLoading={isLoading} analysisData={analysisData} />

        {/* Content — AnimatePresence handle transisi empty↔result */}
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
