// app/dashboard/candidate/matches/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Server Component — entry point halaman matches.
//
// Rendering strategy:
//   • page.tsx         → SSR (Server Component, no "use client")
//   • MatchesContent   → async Server Component, di-stream via Suspense
//   • MatchesLoading   → tampil instan sebagai fallback skeleton
//   • JobMatchList     → CSR (filter/search interaktif, sudah "use client")
//   • JobMatchCard     → CSR (animasi framer-motion, sudah "use client")
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from "react";
import MatchesLoading from "@/components/candidate/matches/MatchesLoading";
import MatchesContent from "@/components/candidate/matches/MatchesContent";

// Paksa SSR — applications berubah tiap user apply, tidak boleh di-cache di page level
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Job Matches | Candidate Dashboard",
  description: "Lowongan yang cocok dengan skills CV kamu",
};

export default function MatchesPage() {
  return (
    /**
     * Suspense + MatchesLoading (komponen yang sudah ada):
     * - MatchesLoading langsung tampil tanpa nunggu data
     * - MatchesContent di-stream dari server begitu data siap
     * - Tidak ada useEffect, tidak ada loading state di client
     */
    <Suspense fallback={<MatchesLoading />}>
      <MatchesContent />
    </Suspense>
  );
}
