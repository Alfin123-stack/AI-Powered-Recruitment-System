export interface OnboardingConfirmationEmailData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  startDate?: string;
  dashboardUrl: string;
}

// Accepts either a raw ISO date string ("2026-08-12") or an already-
// human-formatted string. If it doesn't parse as a valid date, the
// original string is returned as-is — so callers who already format
// startDate upstream don't get garbled output, and callers who pass a raw
// date get a friendly one automatically.
function formatFriendlyDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// This is the FIRST touchpoint after acceptance — sent immediately when the
// candidate clicks Accept. Keep it short and warm; the detailed logistics
// (report time, location, documents, dress code) belong in the separate
// pre-boarding email sent closer to the start date (see onboarding.ts),
// not here. Dumping everything into one email right after accept tends to
// get skimmed and forgotten by the time the start date actually arrives.
export function buildOnboardingConfirmationEmailHtml(data: OnboardingConfirmationEmailData): string {
  const { candidateName, jobTitle, companyName, startDate, dashboardUrl } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome Aboard — ${jobTitle}</title>
</head>
<body style="margin:0;padding:0;background:#0a0f0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:36px;padding-top:8px;">
      <div style="display:inline-block;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:100px;padding:9px 22px;">
        <span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;vertical-align:middle;margin-right:8px;"></span>
        <span style="color:#10b981;font-size:12px;font-weight:700;letter-spacing:0.08em;vertical-align:middle;">RECRUITAI</span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#0d1a13;border:1px solid rgba(16,185,129,0.2);border-radius:18px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.4);">
      <div style="height:3px;background:linear-gradient(90deg,#10b981,#06b6d4);"></div>

      <div style="padding:40px 34px;">
        <div style="text-align:center;margin-bottom:26px;">
          <div style="font-size:42px;margin-bottom:14px;line-height:1;">🙌</div>
          <div style="display:inline-block;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:8px;padding:7px 18px;">
            <span style="color:#10b981;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">It's official</span>
          </div>
        </div>

        <h1 style="color:#e8f0ec;font-size:21px;font-weight:800;text-align:center;margin:0 0 14px;line-height:1.3;">
          Welcome to ${companyName}, ${candidateName}!
        </h1>
        <p style="color:#7a9585;font-size:14px;text-align:center;margin:0 0 8px;line-height:1.75;">
          Congratulations on accepting the <strong style="color:#10b981;">${jobTitle}</strong> role.
          Out of everyone we spoke with, you were the one we kept coming back to — and we're genuinely
          excited to see what you'll bring to the team.
        </p>

        ${startDate ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.18);border-radius:14px;margin:24px 0;">
          <tr>
            <td style="padding:20px;text-align:center;">
              <div style="color:#7a9585;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding-bottom:8px;">📅 You Start On</div>
              <div style="color:#10b981;font-size:18px;font-weight:800;">${formatFriendlyDate(startDate)}</div>
            </td>
          </tr>
        </table>` : ""}

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.15);border-radius:12px;margin-bottom:26px;">
          <tr>
            <td style="padding:16px 18px;">
              <span style="color:#67c7dd;font-size:12.5px;line-height:1.7;">
                📬&nbsp; One more thing: about a week before your start date, we'll send a separate email with
                everything you need for Day 1 — report time, location or video call link, what to bring,
                and who to look for when you arrive.
              </span>
            </td>
          </tr>
        </table>

        <p style="color:#5d7568;font-size:12.5px;text-align:center;margin:0 0 22px;line-height:1.7;">
          Have a question before then? Just reply to this email — we're happy to help.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.14);border:1px solid rgba(16,185,129,0.3);border-radius:11px;">
                <tr>
                  <td>
                    <a href="${dashboardUrl}"
                      style="display:block;color:#10b981;font-size:13.5px;font-weight:700;padding:13px 28px;text-decoration:none;white-space:nowrap;">
                      View My Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div style="text-align:center;padding:30px 12px 8px;color:#3a5245;font-size:11px;line-height:1.7;">
      You received this email because you accepted a job offer through RecruitAI.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function buildOnboardingConfirmationEmailText(data: OnboardingConfirmationEmailData): string {
  return `
Hi ${data.candidateName},

Congratulations on accepting the ${data.jobTitle} role at ${data.companyName}! Out of everyone we spoke with, you were the one we kept coming back to — and we're genuinely excited to see what you'll bring to the team.

${data.startDate ? `You start on: ${formatFriendlyDate(data.startDate)}\n` : ""}
One more thing: about a week before your start date, we'll send a separate email with everything you need for Day 1 — report time, location or video call link, what to bring, and who to look for when you arrive.

Have a question before then? Just reply to this email — we're happy to help.

View your dashboard: ${data.dashboardUrl}

— RecruitAI Team
  `.trim();
}