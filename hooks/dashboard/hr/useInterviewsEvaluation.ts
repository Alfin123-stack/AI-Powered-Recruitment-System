import { useState } from "react";
import { toast } from "sonner";
import type { EvaluationResult } from "@/components/hr/interviews/EvaluationModal";

export interface UseInterviewsEvaluationParams {
  onHire: (evaluation: EvaluationResult) => void;
  onReject: (evaluation: EvaluationResult) => void;
  onConsider: (evaluation: EvaluationResult) => void;
}

export function useInterviewsEvaluation({
  onHire,
  onReject,
  onConsider,
}: UseInterviewsEvaluationParams) {
  const [score, setScore] = useState(7);
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] =
    useState<EvaluationResult["recommendation"]>("hire");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      toast.error("Evaluation notes are required");
      return;
    }

    setSubmitting(true);
    try {
      const evaluation: EvaluationResult = { score, notes, recommendation };

      if (recommendation === "hire") {
        onHire(evaluation);
        toast.success("Evaluasi disimpan — lanjut ke offer letter");
      } else if (recommendation === "reject") {
        onReject(evaluation);
        toast.success("Evaluasi disimpan — rejection sedang dikirim");
      } else {
        onConsider(evaluation);
        toast.success("Evaluasi berhasil disimpan");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit evaluation",
      );
    } finally {
      // parent handles close after async actions
      setSubmitting(false);
    }
  };

  return {
    score,
    setScore,
    notes,
    setNotes,
    recommendation,
    setRecommendation,
    submitting,
    handleSubmit,
  };
}