"use server";

import { sendEmail } from "@/lib/email/gmail";
import { buildOfferEmailHtml, buildOfferEmailText } from "@/lib/email/templates/offer";
import { getServerSession } from "@/lib/auth/getServerSession";
import { API } from "@/lib/api";
import { generateOfferLetterPdf } from "@/lib/pdf/generateOfferLetterPdf";
import { sendOfferInputSchema, formatZodError } from "@/lib/validators/actionSchemas";

export interface SendOfferInput {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  salary: string;
  startDate: string;
  notes?: string;
  expiryDays?: number;
  // Optional extra terms for the PDF/email — safe to omit; UI doesn't
  // currently collect these (OfferLetterModal only has salary/startDate/
  // notes/expiryDays), so they'll simply be undefined until a form field
  // is added for them.
  workingHours?: string;
  contractType?: string;
  reportingManager?: string;
  benefits?: string[];
}

export type ActionResult<T = void> =
  | { success: true; data: T; warning?: string }
  | { success: false; error: string };
export async function sendOfferLetterAction(
  input: SendOfferInput,
): Promise<ActionResult<{ emailId: string; expiresAt: string }>> {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const session = await getServerSession();
  if (!session) return { success: false, error: "Unauthorized" };
  const token = session.access_token;

  // ── Validasi input (Zod) ───────────────────────────────────────────────────
  // FIX (security): Server Action ini pada dasarnya endpoint HTTP juga --
  // bisa dipanggil langsung tanpa lewat UI form. Sebelumnya tidak ada
  // validasi sama sekali di sini (beda dengan backend Express yang sudah
  // pakai Zod).
  const parsed = sendOfferInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: `Data tidak valid: ${formatZodError(parsed.error)}` };
  }

  const {
    applicationId,
    candidateName,
    candidateEmail,
    jobTitle,
    companyName,
    salary,
    startDate,
    notes,
    expiryDays = 7,
    workingHours,
    contractType,
    reportingManager,
    benefits,
  } = parsed.data;

  // Guard against silently sending "undefined" into the email template —
  // if the caller (HR form) forgot to pass one of these, fall back to a
  // safe placeholder instead of letting `undefined` render as literal text.
  const safeJobTitle = jobTitle || "this position";
  const safeCompanyName = companyName || "the company";

  const expiresAt = new Date(
    Date.now() + expiryDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // ── 0. Get a signed token for the accept/decline links ────────────────────────
  // The candidate clicking these links from their inbox isn't necessarily
  // logged in, so we can't rely on their session. The backend generates an
  // HMAC-signed token (scoped to this applicationId + expiresAt) that the
  // confirmation page forwards back to the backend via respondToOfferAction
  // instead of a Bearer token. This also marks offer_status "pending" on
  // the application row so it can't be responded to twice.
  let offerToken: string;
  try {
    const tokenRes = await fetch(
      `${API}/api/applications/${applicationId}/offer-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expires_at: expiresAt }),
      },
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.json().catch(() => ({}));
      throw new Error(err.error || "Failed to prepare offer link");
    }

    ({ token: offerToken } = await tokenRes.json());
  } catch (err) {
    console.error("[sendOfferLetterAction] Failed to create offer token:", err);
    return {
      success: false,
      error: "Failed to prepare offer link. Please try again.",
    };
  }

  // FIX: previously pointed to app/api/offer/[id]/accept|decline, a GET
  // route that mutated offer_status as a side effect of a plain page load
  // — unsafe, because email security scanners (Outlook Safe Links,
  // corporate antivirus, link-preview bots) auto-follow every link in an
  // email, which would silently accept/decline the offer before the
  // candidate ever saw it. That route has been removed.
  //
  // Both links now point to the same render-only confirmation page
  // (app/offer-response/[id]/page.tsx). `intent` just pre-highlights which
  // button the email link was for — the actual mutation only fires when
  // the candidate explicitly clicks a button there, via
  // respondToOfferAction. Job/company/salary/start are passed along so the
  // confirmation page can show a summary without an extra fetch.
  //
  // NOTE: confirm this matches your actual route folder — adjust the path
  // below if app/offer-response/[id]/page.tsx lives somewhere else (e.g.
  // app/dashboard/candidate/offer/[id]/page.tsx).
  const offerParams = new URLSearchParams({
    token: offerToken,
    job: safeJobTitle,
    company: safeCompanyName,
    salary: salary || "",
    start: startDate || "",
  });

  const acceptUrl = `${baseUrl}/offer-response/${applicationId}?${offerParams.toString()}&intent=accept`;
  const declineUrl = `${baseUrl}/offer-response/${applicationId}?${offerParams.toString()}&intent=decline`;

  // ── 1. Generate the formal offer letter PDF ───────────────────────────────────
  // Full contract-style detail lives here, not in the email body — the
  // email stays short/scannable per best practice, the PDF carries the
  // complete terms. Non-fatal on failure: the email still sends without
  // an attachment rather than blocking the whole offer.
  let offerPdfBuffer: Buffer | null = null;
  try {
    offerPdfBuffer = await generateOfferLetterPdf({
      candidateName,
      jobTitle: safeJobTitle,
      companyName: safeCompanyName,
      salary,
      startDate,
      notes,
      expiresAt,
      workingHours,
      contractType,
      reportingManager,
      benefits,
    });
  } catch (err) {
    console.error("[sendOfferLetterAction] Failed to generate offer letter PDF:", err);
  }

  // ── 2. Send email via Gmail SMTP (Nodemailer) ─────────────────────────────────
  const sharedTemplateData = {
    candidateName,
    jobTitle: safeJobTitle,
    companyName: safeCompanyName,
    salary,
    startDate,
    notes,
    acceptUrl,
    declineUrl,
    expiresAt,
    workingHours,
    contractType,
    reportingManager,
    benefits,
    hasAttachment: !!offerPdfBuffer,
  };

  const emailResult = await sendEmail({
    to: candidateEmail,
    subject: `Job Offer — ${safeJobTitle} at ${safeCompanyName}`,
    html: buildOfferEmailHtml(sharedTemplateData),
    text: buildOfferEmailText(sharedTemplateData),
    attachments: offerPdfBuffer
      ? [
          {
            filename: `Offer_Letter_${candidateName.replace(/\s+/g, "_")}.pdf`,
            content: offerPdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  });

  if (emailResult.error) {
    console.error("[sendOfferLetterAction] Gmail SMTP error:", emailResult.error);
    return { success: false, error: "Failed to send email. Please try again." };
  }

  // ── 3. Update application status to "offered" ────────────────────────────────
  // FIX: step lama "Create in-app notification" (POST /api/notifications
  // manual, tipe "offer_letter") SUDAH DIHAPUS dari sini. Notifikasi itu
  // sekarang dibuat oleh backend di updateApplicationStatus
  // (applicationController.js, lihat notifMap.offered) — endpoint yang
  // sama yang dipanggil di bawah ini. Karena backend tidak tahu
  // salary/startDate/notes/expiresAt/accept_url/decline_url (data-data
  // ini tidak pernah tersimpan di kolom applications manapun — cuma hidup
  // di form OfferLetterModal saat kirim), semuanya dilewatkan lewat body
  // request ini supaya backend bisa membangun notifikasi yang sama
  // lengkapnya seperti sebelumnya.
  //
  // skipStatusNotification TIDAK dikirim lagi (sebelumnya true) — kalau
  // masih true, notifMap.offered yang baru di backend tidak akan pernah
  // jalan dan kandidat tidak dapat notifikasi offer sama sekali.
  try {
    const statusRes = await fetch(`${API}/api/applications/${applicationId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "offered",
        salary,
        start_date: startDate,
        notes,
        expires_at: expiresAt,
        accept_url: acceptUrl,
        decline_url: declineUrl,
      }),
    });

    if (!statusRes.ok) {
      const err = await statusRes.json().catch(() => ({}));
      console.error("[sendOfferLetterAction] Status update API returned error:", err);
    }
  } catch (err) {
    console.error("[sendOfferLetterAction] Failed to update status:", err);
  }

  return {
    success: true,
    data: { emailId: emailResult.data?.id ?? "", expiresAt },
  };
}