"use client";

import { sendOnboardingEmailAction } from "@/actions/onboardingActions";
import { useState } from "react";

export interface UseOnboardingEmailParams {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  initialStartDate?: string; // prefill only — not guaranteed accurate, HR confirms in the form
}

export function useOnboardingEmail({
  applicationId,
  candidateName,
  candidateEmail,
  jobTitle,
  companyName,
  initialStartDate,
}: UseOnboardingEmailParams) {
  const [startDate, setStartDate] = useState(initialStartDate ?? "");
  const [reportTime, setReportTime] = useState("");
  const [location, setLocation] = useState("");
  const [videoCallUrl, setVideoCallUrl] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  // Textareas — one item per line, split into arrays right before sending.
  const [documentsNeededText, setDocumentsNeededText] = useState("");
  const [firstDayAgendaText, setFirstDayAgendaText] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false); // flips true after a successful send, for this modal session

  const linesToArray = (text: string): string[] =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const handleSend = async (): Promise<{ ok: boolean; warning?: string }> => {
    if (!startDate) {
      setError("Start date wajib diisi.");
      return { ok: false };
    }

    setError(null);
    setSending(true);

    try {
      const result = await sendOnboardingEmailAction({
        applicationId,
        candidateName,
        candidateEmail,
        jobTitle,
        companyName,
        startDate,
        reportTime: reportTime.trim() || undefined,
        location: location.trim() || undefined,
        videoCallUrl: videoCallUrl.trim() || undefined,
        dressCode: dressCode.trim() || undefined,
        contactName: contactName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        documentsNeeded: linesToArray(documentsNeededText),
        firstDayAgenda: linesToArray(firstDayAgendaText),
        additionalNotes: additionalNotes.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error);
        return { ok: false };
      }

      setSent(true);
      return { ok: true };
    } catch (err) {
      console.error("[useOnboardingEmail] handleSend failed:", err);
      setError("Something went wrong. Please try again.");
      return { ok: false };
    } finally {
      setSending(false);
    }
  };

  return {
    startDate,
    setStartDate,
    reportTime,
    setReportTime,
    location,
    setLocation,
    videoCallUrl,
    setVideoCallUrl,
    dressCode,
    setDressCode,
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
    documentsNeededText,
    setDocumentsNeededText,
    firstDayAgendaText,
    setFirstDayAgendaText,
    additionalNotes,
    setAdditionalNotes,
    sending,
    error,
    sent,
    handleSend,
  };
}
