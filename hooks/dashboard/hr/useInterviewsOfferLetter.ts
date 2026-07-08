import { useState } from "react";
import { toast } from "sonner";
import { sendOfferLetterAction } from "@/actions/offerActions";

export interface UseInterviewsOfferLetterParams {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
}

// FIX: handleSend used to return a plain boolean. sendOfferLetterAction can
// now succeed while still reporting a non-blocking `warning` (e.g. the
// offer email sent fine but the in-app notification failed to be created).
// Returning that warning here lets the modal tell HR about it instead of
// silently swallowing it.
export interface SendOfferResult {
  ok: boolean;
  warning?: string;
}

export function useInterviewsOfferLetter({
  applicationId,
  candidateName,
  candidateEmail,
  jobTitle,
  companyName,
}: UseInterviewsOfferLetterParams) {
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const expiryPercent = ((expiryDays - 1) / (14 - 1)) * 100;

  const handleSend = async (): Promise<SendOfferResult> => {
    if (!salary.trim() || !startDate) {
      const msg = "Salary and start date are required.";
      setError(msg);
      toast.error(msg);
      return { ok: false };
    }
    setError("");
    setSending(true);

    try {
      const result = await sendOfferLetterAction({
        applicationId,
        candidateName,
        candidateEmail,
        jobTitle,
        companyName,
        salary,
        startDate,
        notes,
        expiryDays,
      });

      if (!result.success) throw new Error(result.error);

      // Pass the (optional) warning through — e.g. "email sent but
      // in-app notification failed" — so the modal can show it alongside
      // the success toast instead of reporting a clean, unqualified success.
      return { ok: true, warning: result.warning };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSending(false);
    }
  };

  return {
    salary,
    setSalary,
    startDate,
    setStartDate,
    notes,
    setNotes,
    expiryDays,
    setExpiryDays,
    sending,
    error,
    expiryPercent,
    handleSend,
  };
}