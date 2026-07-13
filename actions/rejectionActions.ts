"use server";

import { sendEmail } from "@/lib/email/gmail";
import { buildRejectionEmailHtml, buildRejectionEmailText } from "@/lib/email/templates/rejection";
import { getServerSession } from "@/lib/auth/getServerSession";
import { API } from "@/lib/api";
import type { ActionResult } from "./offerActions";
import { sendRejectionInputSchema, formatZodError } from "@/lib/validators/actionSchemas";

export interface SendRejectionInput {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  feedback?: string;
}

export async function sendRejectionAction(
  input: SendRejectionInput,
): Promise<ActionResult> {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const session = await getServerSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const token = session.access_token;

  // ── Validasi input (Zod) ───────────────────────────────────────────────────
  const parsed = sendRejectionInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: `Data tidak valid: ${formatZodError(parsed.error)}` };
  }

  const { applicationId, candidateName, candidateEmail, jobTitle, companyName, feedback } = parsed.data;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/dashboard/candidate`;

  // ── 1. Send rejection email via Gmail SMTP (Nodemailer) ────────────────────
  // Ganti dari Resend karena akun Resend masih testing mode (belum
  // verifikasi domain) dan cuma boleh kirim ke email akun sendiri. Gmail
  // SMTP bisa kirim ke candidateEmail manapun secara dinamis.
  const emailResult = await sendEmail({
    to: candidateEmail,
    subject: `Application Update — ${jobTitle} at ${companyName}`,
    html: buildRejectionEmailHtml({ candidateName, jobTitle, companyName, feedback, dashboardUrl }),
    text: buildRejectionEmailText({ candidateName, jobTitle, companyName, feedback, dashboardUrl }),
  });

  if (emailResult.error) {
    console.error("[sendRejectionAction] Gmail SMTP error:", emailResult.error);
    return { success: false, error: "Failed to send email. Please try again." };
  }

  // ── 2. Update application status to "rejected" ──────────────────────────────
  // FIX: step lama "Create in-app notification" (POST /api/notifications
  // manual) SUDAH DIHAPUS dari sini. Notifikasi in-app untuk reject
  // sekarang dibuat oleh backend di createEvaluation
  // (evaluationController.js) — dipicu SEBELUM action ini dipanggil, lewat
  // saveEvaluation() di useEvaluationFlow.handleReject, dengan `notes`
  // yang sama persis dipakai sebagai `feedback` di sini. Backend jadi
  // satu-satunya sumber notifikasi in-app untuk keputusan reject, supaya
  // kandidat tidak menerima 2 notifikasi untuk 1 aksi HR yang sama.
  //
  // skipStatusNotification: true TETAP dipertahankan — notifMap.rejected
  // di updateApplicationStatus (applicationController.js) masih ada dan
  // akan tetap memicu notif KEDUA kalau flag ini dilepas.
  try {
    await fetch(`${API}/api/applications/${applicationId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "rejected", skipStatusNotification: true }),
    });
  } catch (err) {
    console.error("[sendRejectionAction] Failed to update status:", err);
  }

  return { success: true, data: undefined };
}