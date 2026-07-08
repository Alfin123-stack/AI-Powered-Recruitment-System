"use server";

import { sendEmail } from "@/lib/email/gmail";
import { buildOnboardingEmailHtml, buildOnboardingEmailText } from "@/lib/email/templates/onboarding";
import { getServerSession } from "@/lib/auth/getServerSession";
import { API } from "@/lib/api";
import type { ActionResult } from "./offerActions";
// FIX: generateOnboardingPdf sudah dibuat khusus untuk dilampirkan di
// email onboarding ini (lihat header comment generateOnboardingPdf.ts:
// "to be sent as an email attachment alongside the pre-boarding HTML
// email"), tapi sebelumnya tidak pernah diimpor/dipanggil di sini — jadi
// PDF-nya jadi dead code dan kandidat cuma menerima HTML tanpa attachment
// Day 1 Info Sheet yang bisa disimpan/diprint. Sekarang dipanggil sama
// seperti generateOfferLetterPdf dipanggil di offerActions.ts.
import { generateOnboardingPdf } from "@/lib/pdf/generateOnboardingPdf";
// FIX: confirmation email ("Welcome aboard 🙌") sekarang dikirim SEREMPAK
// di sini, tidak lagi otomatis saat kandidat klik Accept (lihat
// offerResponseActions.ts — pengiriman otomatisnya sudah dihapus dari
// sana atas permintaan). Alasannya: dua email jadi satu kejadian yang
// dikontrol HR, bukan satu otomatis + satu manual di waktu yang beda.
import {
  buildOnboardingConfirmationEmailHtml,
  buildOnboardingConfirmationEmailText,
} from "@/lib/email/templates/onboarding-confirmation";

export interface SendOnboardingInput {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  reportTime?: string;
  location?: string;
  videoCallUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  documentsNeeded?: string[]; // already split into an array by the hook
  dressCode?: string;
  firstDayAgenda?: string[]; // already split into an array by the hook
  additionalNotes?: string; // free-text catch-all for anything else HR wants to add
}

export async function sendOnboardingEmailAction(
  input: SendOnboardingInput,
): Promise<ActionResult<{ emailId: string }>> {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const session = await getServerSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const token = session.access_token;

  const {
    applicationId,
    candidateName,
    candidateEmail,
    jobTitle,
    companyName,
    startDate,
    reportTime,
    location,
    videoCallUrl,
    contactName,
    contactEmail,
    contactPhone,
    documentsNeeded,
    dressCode,
    firstDayAgenda,
    additionalNotes,
  } = input;

  // additionalNotes doesn't have its own slot in the onboarding template —
  // simplest integration is to tack it onto the agenda list as a final
  // note-style line, so it still shows up without needing to touch
  // onboarding.ts's HTML structure. Revisit this if it needs its own
  // styled section later.
  const agendaWithNotes =
    additionalNotes && additionalNotes.trim()
      ? [...(firstDayAgenda ?? []), `Note: ${additionalNotes.trim()}`]
      : firstDayAgenda;

  const emailData = {
    candidateName,
    jobTitle,
    companyName,
    startDate,
    reportTime,
    location,
    videoCallUrl,
    contactName,
    contactEmail,
    contactPhone,
    documentsNeeded,
    dressCode,
    firstDayAgenda: agendaWithNotes,
  };

  // ── 1. Generate the Day 1 Info Sheet PDF ──────────────────────────────────────
  // Non-fatal on failure, same pattern as generateOfferLetterPdf in
  // offerActions.ts: the email still sends without an attachment rather
  // than blocking the whole onboarding email over a PDF render error.
  let onboardingPdfBuffer: Buffer | null = null;
  try {
    onboardingPdfBuffer = await generateOnboardingPdf(emailData);
  } catch (err) {
    console.error("[sendOnboardingEmailAction] Failed to generate onboarding PDF:", err);
  }

  // ── 2. Send the onboarding email ──────────────────────────────────────────────
  const emailResult = await sendEmail({
    to: candidateEmail,
    subject: `Getting ready for Day 1 — ${jobTitle} at ${companyName}`,
    html: buildOnboardingEmailHtml(emailData),
    text: buildOnboardingEmailText(emailData),
    attachments: onboardingPdfBuffer
      ? [
          {
            filename: `Day1_Info_Sheet_${candidateName.replace(/\s+/g, "_")}.pdf`,
            content: onboardingPdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  });

  if (emailResult.error) {
    console.error("[sendOnboardingEmailAction] Gmail SMTP error:", emailResult.error);
    return { success: false, error: "Failed to send email. Please try again." };
  }

  // ── 3. Send the "Welcome aboard" confirmation email, serempak dengan email
  //      onboarding di atas ────────────────────────────────────────────────────
  // NON-BLOCKING sengaja: email onboarding utama sudah berhasil terkirim di
  // atas, jadi kegagalan di sini (SMTP hiccup, dll) tidak boleh membuat
  // seluruh aksi HR gagal — cukup dicatat di log untuk ditindaklanjuti.
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const dashboardUrl = `${baseUrl}/dashboard/candidate`;
    const confirmationData = { candidateName, jobTitle, companyName, startDate, dashboardUrl };

    await sendEmail({
      to: candidateEmail,
      subject: `Welcome aboard — ${jobTitle} at ${companyName}`,
      html: buildOnboardingConfirmationEmailHtml(confirmationData),
      text: buildOnboardingConfirmationEmailText(confirmationData),
    });
  } catch (err) {
    console.error("[sendOnboardingEmailAction] Failed to send confirmation email:", err);
  }

  // ── 4. Mark onboarding email as sent (so the button flips + no dupes) ─────────
  // Backend endpoint PUT /api/applications/:id/onboarding-sent sekarang JUGA
  // yang bertanggung jawab membuat notifikasi in-app — baik ke kandidat
  // ("Selamat, Kamu Sudah Onboard! 🎊") maupun ke HR sendiri ("Onboarding
  // Email Terkirim 📋") — lihat updateOnboardingSent di
  // applicationController.js. Notifikasi manual via POST /api/notifications
  // yang sebelumnya ada di sini SENGAJA DIHAPUS supaya kandidat tidak
  // menerima 2 notifikasi untuk 1 aksi HR yang sama. Backend jadi
  // satu-satunya sumber notifikasi untuk event ini.
  try {
    const markRes = await fetch(`${API}/api/applications/${applicationId}/onboarding-sent`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ onboarding_sent: true }),
    });
    if (!markRes.ok) {
      const err = await markRes.json().catch(() => ({}));
      console.error("[sendOnboardingEmailAction] onboarding-sent API returned error:", err);
    }
  } catch (err) {
    // Non-critical — email already sent. Log so HR/dev knows the flag
    // (dan notifikasinya) might be stale until fixed.
    console.error("[sendOnboardingEmailAction] Failed to mark onboarding_sent:", err);
  }

  return { success: true, data: { emailId: emailResult.data?.id ?? "" } };
}