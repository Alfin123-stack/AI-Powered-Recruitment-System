export interface OnboardingEmailData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  reportTime?: string; // e.g. "09:00 AM"
  location?: string; // physical address
  videoCallUrl?: string; // for remote first days
  contactName?: string; // who to look for / ask for on Day 1
  contactEmail?: string;
  contactPhone?: string;
  documentsNeeded?: string[]; // e.g. ["Original diploma", "Bank account details"]
  dressCode?: string;
  firstDayAgenda?: string[]; // e.g. ["09:00 Welcome & office tour", "10:00 IT setup"]
}

// Accepts either a raw ISO date string ("2026-08-12") or an already-
// human-formatted string, same behavior as the twin helper in
// onboarding-confirmation.ts — keeps both emails' date output consistent
// without depending on the caller to pre-format startDate correctly.
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

// Small icon per logistics row so the table reads at a glance instead of
// as a wall of label/value pairs — reportTime/location/dressCode are plain
// strings (not dates), so they're shown as given; only Start Date runs
// through formatFriendlyDate.
const LOGISTICS_ICONS: Record<string, string> = {
  "Start Date": "📅",
  "Report Time": "🕐",
  Location: "📍",
  "Video Call": "💻",
  "Dress Code": "👔",
};

// The SECOND touchpoint — sent ~7 days before startDate (see the cron route
// in app/api/cron/onboarding-reminder/route.ts). This is where the actual
// logistics live, since they're only useful once they're imminent.
export function buildOnboardingEmailHtml(data: OnboardingEmailData): string {
  const {
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
    firstDayAgenda,
  } = data;

  const logisticsRows: [string, string][] = [["Start Date", formatFriendlyDate(startDate)]];
  if (reportTime) logisticsRows.push(["Report Time", reportTime]);
  if (location) logisticsRows.push(["Location", location]);
  if (videoCallUrl) logisticsRows.push(["Video Call", "Link below"]);
  if (dressCode) logisticsRows.push(["Dress Code", dressCode]);

  const logisticsHtml = logisticsRows
    .map(
      ([label, value], i) => `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="${i < logisticsRows.length - 1 ? "padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.05);" : "padding-bottom:0;"}">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="color:#7a9585;font-size:13px;padding-bottom:6px;">${LOGISTICS_ICONS[label] ?? ""}&nbsp; ${label}</td></tr>
                      <tr><td style="color:${label === "Start Date" ? "#10b981" : "#e8f0ec"};font-size:${label === "Start Date" ? "16px" : "14px"};font-weight:700;">${value}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              ${i < logisticsRows.length - 1 ? '<div style="height:14px;"></div>' : ""}`
    )
    .join("");

  const videoCallSection = videoCallUrl
    ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.14);border:1px solid rgba(16,185,129,0.3);border-radius:11px;">
                <tr>
                  <td>
                    <a href="${videoCallUrl}" style="display:block;color:#10b981;font-size:13.5px;font-weight:700;padding:13px 28px;text-decoration:none;white-space:nowrap;">
                      💻&nbsp; Join Video Call →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`
    : "";

  const documentsSection =
    documentsNeeded && documentsNeeded.length > 0
      ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.12);border-radius:14px;margin-bottom:26px;">
          <tr>
            <td style="padding:20px 22px;">
              <div style="color:#7a9585;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:14px;">📋&nbsp; Come Prepared With</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${documentsNeeded
                  .map(
                    (doc) => `
                <tr>
                  <td style="padding:6px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#10b981;font-size:12.5px;padding-right:9px;vertical-align:top;">✓</td>
                        <td style="color:#9bb3a6;font-size:12.5px;line-height:1.75;">${doc}</td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>
        </table>`
      : "";

  const agendaSection =
    firstDayAgenda && firstDayAgenda.length > 0
      ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.05);border-radius:0 10px 10px 0;margin-bottom:26px;">
          <tr>
            <td style="border-left:3px solid rgba(16,185,129,0.4);padding:18px 20px;">
              <div style="color:rgba(16,185,129,0.7);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">🗓️&nbsp; How Your First Day Will Look</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${firstDayAgenda
                  .map(
                    (item) => `
                <tr><td style="color:#9bb3a6;font-size:13px;line-height:2;">${item}</td></tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>
        </table>`
      : "";

  const contactLinks = [
    contactEmail ? `<a href="mailto:${contactEmail}" style="color:#10b981;text-decoration:none;">${contactEmail}</a>` : "",
    contactPhone ? `<a href="tel:${contactPhone.replace(/[^+\d]/g, "")}" style="color:#10b981;text-decoration:none;">${contactPhone}</a>` : "",
  ].filter(Boolean);

  const contactSection =
    contactName || contactEmail || contactPhone
      ? `
        <div style="text-align:center;margin-top:10px;">
          <span style="color:#5d7568;font-size:12px;line-height:1.85;">
            👋&nbsp; When you arrive, ask for
            ${contactName ? `<strong style="color:#9bb3a6;">${contactName}</strong>` : "your onboarding contact"} —
            they'll be expecting you${
              contactLinks.length > 0 ? `. Feel free to reach out beforehand at ${contactLinks.join(" or ")}` : ""
            }.
          </span>
        </div>`
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Getting Ready for Day 1 — ${jobTitle}</title>
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
          <div style="font-size:38px;margin-bottom:14px;line-height:1;">🗓️</div>
          <div style="display:inline-block;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:8px;padding:7px 18px;">
            <span style="color:#10b981;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Almost there!</span>
          </div>
        </div>

        <h1 style="color:#e8f0ec;font-size:21px;font-weight:800;text-align:center;margin:0 0 14px;line-height:1.3;">
          Your first day is almost here
        </h1>
        <p style="color:#7a9585;font-size:14px;text-align:center;margin:0 0 30px;line-height:1.75;">
          Hi <strong style="color:#c8d8d0;">${candidateName}</strong>, your first day as
          <strong style="color:#10b981;">${jobTitle}</strong> at <strong style="color:#c8d8d0;">${companyName}</strong>
          is coming up. Here's everything you need to know before you walk in — or log on.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;margin-bottom:22px;">
          <tr>
            <td style="padding:22px;">
              ${logisticsHtml}
            </td>
          </tr>
        </table>

        ${videoCallSection}
        ${documentsSection}
        ${agendaSection}
        ${contactSection}

        <p style="color:#5d7568;font-size:12.5px;text-align:center;margin-top:22px;line-height:1.7;">
          Anything still unclear? Just reply to this email — happy to help before you start.
        </p>
      </div>
    </div>

    <div style="text-align:center;padding:30px 12px 8px;color:#3a5245;font-size:11px;line-height:1.7;">
      You received this email because you accepted a job offer through RecruitAI.<br/>
      We can't wait to meet you!
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function buildOnboardingEmailText(data: OnboardingEmailData): string {
  const lines: string[] = [`Hi ${data.candidateName},`, "", `Your first day as ${data.jobTitle} at ${data.companyName} is coming up. Here's everything you need to know before you walk in — or log on.`, ""];

  lines.push(`Start Date: ${formatFriendlyDate(data.startDate)}`);
  if (data.reportTime) lines.push(`Report Time: ${data.reportTime}`);
  if (data.location) lines.push(`Location: ${data.location}`);
  if (data.videoCallUrl) lines.push(`Video Call: ${data.videoCallUrl}`);
  if (data.dressCode) lines.push(`Dress Code: ${data.dressCode}`);

  if (data.documentsNeeded && data.documentsNeeded.length > 0) {
    lines.push("", "Come prepared with:");
    data.documentsNeeded.forEach((d) => lines.push(`- ${d}`));
  }

  if (data.firstDayAgenda && data.firstDayAgenda.length > 0) {
    lines.push("", "How your first day will look:");
    data.firstDayAgenda.forEach((a) => lines.push(a));
  }

  if (data.contactName || data.contactEmail || data.contactPhone) {
    lines.push(
      "",
      `When you arrive, ask for ${data.contactName ?? "your onboarding contact"} — they'll be expecting you${
        data.contactEmail || data.contactPhone
          ? `. Feel free to reach out beforehand at ${[data.contactEmail, data.contactPhone].filter(Boolean).join(" or ")}`
          : ""
      }.`
    );
  }

  lines.push("", "Anything still unclear? Just reply to this email — happy to help before you start.");
  lines.push("", "— RecruitAI Team");
  return lines.join("\n").trim();
}