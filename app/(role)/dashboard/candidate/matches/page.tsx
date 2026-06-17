import { Suspense } from "react";
import MatchesLoading from "@/components/candidate/matches/MatchesLoading";
import MatchesContent from "@/components/candidate/matches/MatchesContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Job Matches | Candidate Dashboard",
  description: "Lowongan yang cocok dengan skills CV kamu",
};

export default function MatchesPage() {
  return (
    <Suspense fallback={<MatchesLoading />}>
      <MatchesContent />
    </Suspense>
  );
}
