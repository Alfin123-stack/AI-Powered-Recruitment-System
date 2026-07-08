export interface OfferEmailData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  salary?: string;
  startDate?: string;
  notes?: string;
  acceptUrl: string;
  declineUrl: string;
  expiresAt: string; // ISO date string
  // --- Optional fields (backward-compatible) ---
  workingHours?: string; // e.g. "Mon–Fri, 09:00–18:00"
  contractType?: string; // e.g. "Full-time", "Contract (12 months)"
  reportingManager?: string; // e.g. "Budi Santoso, Engineering Lead"
  benefits?: string[]; // short list, e.g. ["Health insurance", "Remote-friendly"]
  hrContactName?: string;
  hrContactEmail?: string;
  hasAttachment?: boolean; // set true if a formal offer letter PDF is attached to this email
}

// Kalau salary berupa angka murni (mis. "7000000" atau "7000000-9000000"),
// format tiap angka jadi "Rp 7.000.000". Kalau sudah ada teks lain (mis.
// "Nego" atau "7-9 juta"), biarkan apa adanya supaya tidak salah format.
function formatSalaryDisplay(salary?: string): string {
  if (!salary) return "";

  const trimmed = salary.trim();

  // Cocok untuk satu angka: "7000000"
  if (/^\d+$/.test(trimmed)) {
    return `Rp ${Number(trimmed).toLocaleString("id-ID")}`;
  }

  // Cocok untuk rentang angka: "7000000-9000000" atau "7000000 - 9000000"
  const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    const [, min, max] = rangeMatch;
    return `Rp ${Number(min).toLocaleString("id-ID")} - Rp ${Number(max).toLocaleString("id-ID")}`;
  }

  // Sudah ada teks/format lain — biarkan apa adanya.
  return trimmed;
}

// Baris detail singkat untuk table (dipakai HTML & text version)
type DetailRow = { label: string; value: string };

function buildDetailRows(data: OfferEmailData, displaySalary: string): DetailRow[] {
  const rows: DetailRow[] = [{ label: "Position", value: data.jobTitle }];
  if (displaySalary) rows.push({ label: "Salary", value: displaySalary });
  if (data.startDate) rows.push({ label: "Start Date", value: data.startDate });
  if (data.contractType) rows.push({ label: "Contract Type", value: data.contractType });
  if (data.workingHours) rows.push({ label: "Working Hours", value: data.workingHours });
  if (data.reportingManager) rows.push({ label: "Reporting To", value: data.reportingManager });
  return rows;
}

export function buildOfferEmailHtml(data: OfferEmailData): string {
  const {
    candidateName,
    jobTitle,
    companyName,
    notes,
    acceptUrl,
    declineUrl,
    expiresAt,
    benefits,
    hrContactName,
    hrContactEmail,
    hasAttachment,
  } = data;

  const expireDate = new Date(expiresAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displaySalary = formatSalaryDisplay(data.salary);
  const rows = buildDetailRows(data, displaySalary);

  const detailRowsHtml = rows
    .map(
      (row, i) => `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="${i < rows.length - 1 ? "padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.05);" : "padding-bottom:0;"}">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#7a9585;font-size:13px;padding-bottom:6px;">${row.label}</td>
                      </tr>
                      <tr>
                        <td style="color:${row.label === "Salary" ? "#10b981" : "#e8f0ec"};font-size:${row.label === "Salary" ? "16px" : "14px"};font-weight:700;">${row.value}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ${i < rows.length - 1 ? '<div style="height:14px;"></div>' : ""}`
    )
    .join("");

  const benefitsLine =
    benefits && benefits.length > 0
      ? `<p style="color:#9bb3a6;font-size:12.5px;text-align:center;margin:0 0 24px;line-height:1.7;">
          <strong style="color:#7a9585;">Benefits:</strong> ${benefits.join(" · ")}
        </p>`
      : "";

  const attachmentNote = hasAttachment
    ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.15);border-radius:10px;margin-bottom:24px;">
          <tr>
            <td style="padding:14px 16px;">
              <span style="color:#67c7dd;font-size:12.5px;line-height:1.6;">
                📎 The complete offer letter — including full terms, conditions, and benefit details — is attached to this email as a PDF.
              </span>
            </td>
          </tr>
        </table>`
    : "";

  const hrContactSection =
    hrContactName || hrContactEmail
      ? `
        <div style="text-align:center;margin-top:20px;">
          <span style="color:#5d7568;font-size:12px;line-height:1.7;">
            Questions? Contact
            ${hrContactName ? `<strong style="color:#9bb3a6;">${hrContactName}</strong>` : "our HR team"}
            ${hrContactEmail ? `at <a href="mailto:${hrContactEmail}" style="color:#10b981;text-decoration:none;">${hrContactEmail}</a>` : ""}.
          </span>
        </div>`
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Job Offer — ${jobTitle}</title>
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
    <div style="background:#0d1a13;border:1px solid rgba(16,185,129,0.2);border-radius:16px;overflow:hidden;">

      <!-- Top accent -->
      <div style="height:3px;background:linear-gradient(90deg,#10b981,#06b6d4);"></div>

      <div style="padding:36px 32px;">
        <!-- Congrats badge -->
        <div style="text-align:center;margin-bottom:28px;">
          <div style="font-size:40px;margin-bottom:12px;line-height:1;">🎉</div>
          <div style="display:inline-block;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:8px;padding:6px 16px;">
            <span style="color:#10b981;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Congratulations!</span>
          </div>
        </div>

        <!-- Main copy (kept short — full context goes in the attached letter) -->
        <h1 style="color:#e8f0ec;font-size:22px;font-weight:800;text-align:center;margin:0 0 12px;line-height:1.3;">
          You've received a job offer
        </h1>
        <p style="color:#7a9585;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.7;">
          Hi <strong style="color:#c8d8d0;">${candidateName}</strong>,
          <strong style="color:#c8d8d0;">${companyName}</strong> is pleased to offer you
          the <strong style="color:#10b981;">${jobTitle}</strong> position. Key details are below.
        </p>

        <!-- Offer details (scannable) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;margin-bottom:20px;">
          <tr>
            <td style="padding:20px;">
              ${detailRowsHtml}
            </td>
          </tr>
        </table>

        ${benefitsLine}
        ${attachmentNote}

        ${notes ? `
        <!-- Notes from HR -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.05);border-radius:0 8px 8px 0;margin-bottom:24px;">
          <tr>
            <td style="border-left:3px solid rgba(16,185,129,0.4);padding:16px 18px;">
              <div style="color:rgba(16,185,129,0.7);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Message from HR</div>
              <p style="color:#9bb3a6;font-size:13px;line-height:1.7;margin:0;">${notes}</p>
            </td>
          </tr>
        </table>` : ""}

        <!-- CTA buttons -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
          <tr>
            <td width="48%" style="border-radius:10px;background:#10b981;text-align:center;">
              <a href="${acceptUrl}"
                style="display:block;color:#000;font-size:14px;font-weight:700;text-align:center;padding:14px 8px;text-decoration:none;white-space:nowrap;">
                ✓ Accept Offer
              </a>
            </td>
            <td width="4%"></td>
            <td width="48%" style="border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);text-align:center;">
              <a href="${declineUrl}"
                style="display:block;color:#9bb3a6;font-size:14px;font-weight:600;text-align:center;padding:13px 8px;text-decoration:none;white-space:nowrap;">
                Decline
              </a>
            </td>
          </tr>
        </table>

        <!-- Expiry warning -->
        <div style="text-align:center;">
          <span style="color:#f59e0b;font-size:12px;line-height:1.6;">
            ⏳ Please respond by <strong>${expireDate}</strong>
          </span>
        </div>

        ${hrContactSection}
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:28px 12px 8px;color:#3a5245;font-size:11px;line-height:1.7;">
      You received this email because you applied through RecruitAI.<br/>
      If you have questions, please log in to your candidate dashboard.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function buildOfferEmailText(data: OfferEmailData): string {
  const displaySalary = formatSalaryDisplay(data.salary);
  const rows = buildDetailRows(data, displaySalary);
  const detailsText = rows.map((r) => `${r.label}: ${r.value}`).join("\n");
  const benefitsText = data.benefits && data.benefits.length > 0 ? `Benefits: ${data.benefits.join(", ")}\n` : "";
  const attachmentText = data.hasAttachment
    ? "\nThe complete offer letter, including full terms and conditions, is attached to this email as a PDF.\n"
    : "";
  const hrContactText =
    data.hrContactName || data.hrContactEmail
      ? `\nQuestions? Contact ${data.hrContactName ?? "our HR team"}${data.hrContactEmail ? ` at ${data.hrContactEmail}` : ""}.\n`
      : "";

  return `
Hi ${data.candidateName},

${data.companyName} is pleased to offer you the ${data.jobTitle} position. Key details are below.

${detailsText}
${benefitsText}${attachmentText}
${data.notes ? `Message from HR:\n${data.notes}\n` : ""}
Accept: ${data.acceptUrl}
Decline: ${data.declineUrl}

Please respond by ${new Date(data.expiresAt).toLocaleDateString("en-US", { dateStyle: "full" })}.
${hrContactText}
— RecruitAI Team
  `.trim();
}