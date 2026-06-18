// @/hooks/analyze/useLatestAnalysis.ts
// Fetch analisis terakhir user saat mount — hanya berjalan jika initialData null

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchLatestAnalysis } from "@/lib/fetchers/analysis";
import { AnalysisData } from "@/types/main/analyze";

export function useLatestAnalysis(initialData: AnalysisData | null) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(
    initialData,
  );
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

  return { analysisData, setAnalysisData, isFetchingInitial };
}
