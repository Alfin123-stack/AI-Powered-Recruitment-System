import nodemailer from "nodemailer";

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment variables");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Sender address — bebas kirim ke email manapun (dinamis, sesuai
// candidateEmail dari database), tidak dibatasi seperti Resend testing
// mode yang cuma boleh kirim ke email akun sendiri.
export const FROM_EMAIL = `RecruitAI <${process.env.GMAIL_USER}>`;

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

// Wrapper dengan bentuk return mirip resend.emails.send(), supaya
// offerActions.ts / rejectionActions.ts tidak banyak berubah.
//
// FIX: added optional `attachments` — needed so sendOfferLetterAction can
// attach the formal offer letter PDF without changing the sendEmail
// call shape for callers that don't need it (rejectionActions.ts still
// calls this the same way it always has).
export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
}) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
      attachments,
    });
    return { data: { id: info.messageId }, error: null as null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}