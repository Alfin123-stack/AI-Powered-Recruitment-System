export interface RejectionEmailData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  feedback?: string;
  dashboardUrl: string;
  // --- New optional field (backward-compatible) ---
  tips?: string[]; // custom tips; falls back to sensible defaults if not provided
}

const DEFAULT_TIPS = [
  "Tailor your CV keywords to match each job description closely",
  "Highlight measurable outcomes from past roles, not just responsibilities",
  "Keep your RecruitAI profile and portfolio links up to date",
  "Turn on job alerts so you're first to know about new matching roles",
];

export function buildRejectionEmailHtml(data: RejectionEmailData): string {
  const { candidateName, jobTitle, companyName, feedback, dashboardUrl } = data;
  const tips = data.tips && data.tips.length > 0 ? data.tips : DEFAULT_TIPS;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Update — ${jobTitle}</title>
</head>
<body style="margin:0;padding:0;background:#0a0f0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:36px;padding-top:8px;">
      <div style="display:inline-block;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:100px;padding:8px 20px;">
        <span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;vertical-align:middle;margin-right:8px;"></span>
        <span style="color:#10b981;font-size:12px;font-weight:700;letter-spacing:0.08em;vertical-align:middle;">RECRUITAI</span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#0d1a13;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <div style="height:3px;background:linear-gradient(90deg,#6b7280,#4b5563);"></div>

      <div style="padding:36px 32px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:36px;margin-bottom:12px;line-height:1;">📋</div>
        </div>

        <h1 style="color:#e8f0ec;font-size:20px;font-weight:800;text-align:center;margin:0 0 12px;line-height:1.3;">
          Application Status Update
        </h1>
        <p style="color:#7a9585;font-size:14px;text-align:center;margin:0 0 8px;line-height:1.7;">
          Hi <strong style="color:#c8d8d0;">${candidateName}</strong>,
          thank you for taking the time to apply to <strong style="color:#c8d8d0;">${jobTitle}</strong>
          at <strong style="color:#c8d8d0;">${companyName}</strong>, and for the effort you put into
          every stage of our process.
        </p>

        <!-- Status box -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(107,114,128,0.08);border:1px solid rgba(107,114,128,0.2);border-radius:12px;margin-bottom:24px;">
          <tr>
            <td style="padding:18px 20px;text-align:center;">
              <span style="color:#9ca3af;font-size:13px;line-height:1.7;">
                After careful review, we have decided to move forward with other candidates for this position.
                This was not an easy decision, and it does not reflect a lack of merit on your part —
                simply that another candidate's profile more closely matched what we needed right now.
              </span>
            </td>
          </tr>
        </table>

        ${feedback ? `
        <!-- Feedback from HR -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(245,158,11,0.05);border-radius:0 8px 8px 0;margin-bottom:24px;">
          <tr>
            <td style="border-left:3px solid rgba(245,158,11,0.4);padding:16px 18px;">
              <div style="color:rgba(245,158,11,0.7);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Feedback</div>
              <p style="color:#9bb3a6;font-size:13px;line-height:1.7;margin:0;">${feedback}</p>
            </td>
          </tr>
        </table>` : ""}

        <!-- Tips for next time -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.1);border-radius:12px;margin-bottom:24px;">
          <tr>
            <td style="padding:18px 20px;">
              <div style="color:#7a9585;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">Tips to strengthen future applications</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${tips
                  .map(
                    (tip) => `
                <tr>
                  <td style="padding:5px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#10b981;font-size:12.5px;padding-right:8px;vertical-align:top;">✓</td>
                        <td style="color:#9bb3a6;font-size:12.5px;line-height:1.7;">${tip}</td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>
        </table>

        <!-- Encouragement -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.1);border-radius:12px;margin-bottom:28px;">
          <tr>
            <td style="padding:18px 20px;">
              <p style="color:#5d8a6d;font-size:13px;line-height:1.7;margin:0;text-align:center;">
                💡 Don't be discouraged — every application is a step forward. Your profile and CV
                remain active on RecruitAI, and new opportunities that match your skills are added regularly.
                We'd genuinely love to see you apply again in the future.
              </p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);border-radius:10px;">
                <tr>
                  <td>
                    <a href="${dashboardUrl}"
                      style="display:block;color:#10b981;font-size:13px;font-weight:600;padding:12px 26px;text-decoration:none;white-space:nowrap;">
                      Browse More Jobs →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:28px 12px 8px;color:#3a5245;font-size:11px;line-height:1.7;">
      You received this email because you applied through RecruitAI.<br/>
      We wish you all the best in your job search, and hope to see you again soon.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function buildRejectionEmailText(data: RejectionEmailData): string {
  const tips = data.tips && data.tips.length > 0 ? data.tips : DEFAULT_TIPS;

  return `
Hi ${data.candidateName},

Thank you for taking the time to apply to ${data.jobTitle} at ${data.companyName}, and for the effort you put into every stage of our process.

After careful review, we have decided to move forward with other candidates for this position. This was not an easy decision, and it does not reflect a lack of merit on your part — simply that another candidate's profile more closely matched what we needed right now.

${data.feedback ? `Feedback from HR:\n${data.feedback}\n` : ""}
Tips to strengthen future applications:
${tips.map((t) => `- ${t}`).join("\n")}

Don't be discouraged — your profile is still active on RecruitAI and new opportunities matching your skills are added regularly. We'd genuinely love to see you apply again in the future.

Browse more jobs: ${data.dashboardUrl}

— RecruitAI Team
  `.trim();
}