// @/hooks/analyze/useAnalyzeFile.ts
// Mengelola seluruh alur analisis: extract PDF → hit AI API → persist ke DB

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { extractTextFromPDF } from "@/lib/helpers/main/analyze";
import { persistAnalysis } from "@/lib/api/analysis";
import { mapResultToAnalysisData } from "@/lib/mappers/analysis";
import { AnalysisData } from "@/types/main/analyze";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface UseAnalyzeFileReturn {
  isLoading: boolean;
  handleFileSelect: (file: File) => Promise<void>;
}

export function useAnalyzeFile(
  onSuccess: (data: AnalysisData) => void,
): UseAnalyzeFileReturn {
  const [isLoading, setIsLoading] = useState(false);

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
      onSuccess(newData);

      // Persist ke DB — fire-and-forget, non-critical
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          await persistAnalysis(result, file.name, session.access_token);
        }
      } catch {
        // User tetap lihat hasil meski persist gagal
      }
    } catch (err) {
      // FIX (UX): sebelumnya cuma console.error -- user tidak tahu kenapa
      // tidak ada yang terjadi setelah upload (misal file .pdf tapi
      // sebenarnya korup/bukan PDF asli, jadi gagal di-parse pdfjs-dist).
      console.error("Analisis gagal:", err);
      const message =
        err instanceof Error && err.message === "Analisis gagal"
          ? "Analisis gagal, coba lagi dalam beberapa saat."
          : "Gagal membaca file. Pastikan file PDF tidak korup lalu coba lagi.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleFileSelect };
}
