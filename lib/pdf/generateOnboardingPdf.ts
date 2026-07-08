// lib/pdf/generateOnboardingPdf.ts
//
// Generates the "Day 1 Info Sheet" as a PDF Buffer, to be sent as an email
// attachment alongside the pre-boarding HTML email (buildOnboardingEmailHtml).
// The email body stays short and scannable with a clickable "Join Video
// Call" button; this PDF is the thing candidates can actually save/print
// and open offline on the way to the office.
//
// Uses `pdf-lib` — same library already used for generateOfferLetterPdf.ts,
// no new dependency needed.
//
// Design notes:
// - Mirrors generateOfferLetterPdf.ts's palette, letterhead pattern,
//   section-heading style, and auto-pagination logic on purpose — these
//   two PDFs are the only documents a candidate receives from RecruitAI,
//   and having them look like two different products would undercut the
//   very trust this document is meant to build going into Day 1.
// - Unlike the offer letter, there's no legal/authorization block here —
//   this is a logistics reference sheet, not a contract, so it skips the
//   response-deadline row, the signature line, and the contingency notice.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export interface OnboardingPdfData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  reportTime?: string;
  location?: string;
  videoCallUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  documentsNeeded?: string[];
  dressCode?: string;
  firstDayAgenda?: string[];
}

// ── Palette — identical to generateOfferLetterPdf.ts, same app theme ───────
const palette = {
  emerald50: rgb(0.925, 0.992, 0.961),
  emerald100: rgb(0.820, 0.980, 0.898),
  emerald200: rgb(0.655, 0.949, 0.827),
  emerald500: rgb(0.063, 0.725, 0.506),
  emerald600: rgb(0.020, 0.588, 0.412),
  emerald700: rgb(0.016, 0.471, 0.341),
  slate900: rgb(0.059, 0.090, 0.165),
  slate600: rgb(0.278, 0.333, 0.412),
  slate400: rgb(0.580, 0.639, 0.722),
  slate200: rgb(0.886, 0.910, 0.941),
  slate100: rgb(0.945, 0.957, 0.973),
  white: rgb(1, 1, 1),
};

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_RESERVE = 54;

function formatLongDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateOnboardingPdf(data: OnboardingPdfData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let page: PDFPage;
  let y = 0;
  const pages: PDFPage[] = [];

  const drawLetterhead = (isFirstPage: boolean) => {
    const bandHeight = isFirstPage ? 118 : 56;
    page.drawRectangle({ x: 0, y: PAGE_HEIGHT - bandHeight, width: PAGE_WIDTH, height: bandHeight, color: palette.emerald700 });
    page.drawEllipse({
      x: PAGE_WIDTH - 60,
      y: PAGE_HEIGHT - bandHeight + 18,
      xScale: 90,
      yScale: 90,
      color: palette.emerald600,
      opacity: 0.35,
    });

    if (isFirstPage) {
      page.drawText(data.companyName.toUpperCase(), {
        x: MARGIN,
        y: PAGE_HEIGHT - 48,
        size: 19,
        font: fontBold,
        color: palette.white,
      });
      page.drawText("DAY 1 INFO SHEET", {
        x: MARGIN,
        y: PAGE_HEIGHT - 70,
        size: 10.5,
        font: fontBold,
        color: palette.emerald100,
      });
      page.drawText(`For ${data.candidateName} — ${data.jobTitle}`, {
        x: MARGIN,
        y: PAGE_HEIGHT - 88,
        size: 10,
        font: fontRegular,
        color: palette.emerald100,
      });
      y = PAGE_HEIGHT - bandHeight - 30;
    } else {
      page.drawText(data.companyName.toUpperCase(), {
        x: MARGIN,
        y: PAGE_HEIGHT - 35,
        size: 11,
        font: fontBold,
        color: palette.white,
      });
      page.drawText("Day 1 Info Sheet — continued", {
        x: PAGE_WIDTH - MARGIN - 170,
        y: PAGE_HEIGHT - 35,
        size: 9,
        font: fontRegular,
        color: palette.emerald100,
      });
      y = PAGE_HEIGHT - bandHeight - 30;
    }
  };

  const addPage = (isFirstPage: boolean) => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    drawLetterhead(isFirstPage);
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < MARGIN + FOOTER_RESERVE) {
      addPage(false);
    }
  };

  const drawText = (
    text: string,
    opts: { x?: number; size?: number; font?: PDFFont; color?: ReturnType<typeof rgb> } = {},
  ) => {
    const { x = MARGIN, size = 11, font = fontRegular, color = palette.slate900 } = opts;
    page.drawText(text, { x, y, size, font, color });
  };

  const drawParagraph = (
    text: string,
    opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; lineGap?: number; maxWidth?: number } = {},
  ) => {
    const { size = 11, font = fontRegular, color = palette.slate900, lineGap = 15.5, maxWidth = CONTENT_WIDTH } = opts;
    const lines = wrapText(text, font, size, maxWidth);
    ensureSpace(lines.length * lineGap);
    lines.forEach((line) => {
      page.drawText(line, { x: MARGIN, y, size, font, color });
      y -= lineGap;
    });
  };

  const sectionHeading = (title: string) => {
    ensureSpace(28);
    y -= 6;
    page.drawRectangle({ x: MARGIN, y: y - 9, width: 3, height: 12, color: palette.emerald500 });
    page.drawText(title.toUpperCase(), {
      x: MARGIN + 10,
      y: y - 8,
      size: 10.5,
      font: fontBold,
      color: palette.emerald700,
    });
    y -= 24;
  };

  // ── Page 1 ────────────────────────────────────────────────────────────
  addPage(true);

  drawText(`Prepared for: ${data.candidateName}`, { size: 9.5, color: palette.slate600 });
  const startLabel = `Start Date: ${formatLongDate(data.startDate)}`;
  drawText(startLabel, {
    x: PAGE_WIDTH - MARGIN - fontRegular.widthOfTextAtSize(startLabel, 9.5),
    size: 9.5,
    color: palette.slate600,
  });
  y -= 22;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: palette.slate200 });
  y -= 26;

  // ── Intro ────────────────────────────────────────────────────────────
  drawText(`Hi ${data.candidateName},`, { size: 12.5, font: fontBold });
  y -= 22;
  drawParagraph(
    `Your first day as ${data.jobTitle} at ${data.companyName} is coming up. Keep this sheet handy — it has everything you need for Day 1 in one place.`,
  );
  y -= 12;

  // ── Logistics table — same bordered-row pattern as the offer letter ──
  sectionHeading("Day 1 Logistics");

  const rows: [string, string][] = [["Start Date", formatLongDate(data.startDate)]];
  if (data.reportTime) rows.push(["Report Time", data.reportTime]);
  if (data.location) rows.push(["Location", data.location]);
  if (data.videoCallUrl) rows.push(["Video Call", data.videoCallUrl]);
  if (data.dressCode) rows.push(["Dress Code", data.dressCode]);

  const rowHeight = 27;
  const labelColWidth = CONTENT_WIDTH * 0.36;
  ensureSpace(rowHeight * Math.min(rows.length, 3));

  rows.forEach(([label, value], i) => {
    ensureSpace(rowHeight);
    const rowTop = y;
    const zebra = i % 2 === 1;
    if (zebra) {
      page.drawRectangle({ x: MARGIN, y: rowTop - rowHeight, width: CONTENT_WIDTH, height: rowHeight, color: palette.emerald50 });
    }
    page.drawRectangle({
      x: MARGIN,
      y: rowTop - rowHeight,
      width: CONTENT_WIDTH,
      height: rowHeight,
      borderColor: palette.emerald200,
      borderWidth: 1,
    });
    page.drawText(label.toUpperCase(), {
      x: MARGIN + 12,
      y: rowTop - rowHeight / 2 - 3.5,
      size: 8.5,
      font: fontBold,
      color: palette.slate600,
    });
    // Video call URLs can be long — shrink the value font instead of
    // truncating, so the link stays fully readable/copyable off the page.
    const valueFontSize = label === "Video Call" && fontBold.widthOfTextAtSize(value, 11) > CONTENT_WIDTH - labelColWidth - 24
      ? 8.5
      : 11;
    const valueLines = wrapText(value, fontBold, valueFontSize, CONTENT_WIDTH - labelColWidth - 24);
    page.drawText(valueLines[0] ?? value, {
      x: MARGIN + labelColWidth,
      y: rowTop - rowHeight / 2 - 3.5,
      size: valueFontSize,
      font: fontBold,
      color: palette.slate900,
    });
    page.drawLine({
      start: { x: MARGIN + labelColWidth - 12, y: rowTop - rowHeight },
      end: { x: MARGIN + labelColWidth - 12, y: rowTop },
      thickness: 0.75,
      color: palette.slate200,
    });
    y = rowTop - rowHeight;
  });
  y -= 20;

  // ── Documents needed — same bullet pattern as offer letter's benefits ──
  if (data.documentsNeeded && data.documentsNeeded.length > 0) {
    sectionHeading("Come Prepared With");
    data.documentsNeeded.forEach((doc) => {
      const lines = wrapText(doc, fontRegular, 11, CONTENT_WIDTH - 18);
      ensureSpace(lines.length * 15.5);
      page.drawEllipse({ x: MARGIN + 4, y: y - 4.5, xScale: 2.4, yScale: 2.4, color: palette.emerald500 });
      lines.forEach((line) => {
        page.drawText(line, { x: MARGIN + 16, y, size: 11, font: fontRegular, color: palette.slate900 });
        y -= 15.5;
      });
    });
    y -= 10;
  }

  // ── First day agenda — numbered, since order matters here (unlike the
  //    unordered benefits list this pattern is borrowed from) ────────────
  if (data.firstDayAgenda && data.firstDayAgenda.length > 0) {
    sectionHeading("How Your First Day Will Look");
    data.firstDayAgenda.forEach((item, i) => {
      const lines = wrapText(item, fontRegular, 11, CONTENT_WIDTH - 26);
      ensureSpace(lines.length * 15.5 + 4);
      page.drawText(`${i + 1}.`, { x: MARGIN, y, size: 11, font: fontBold, color: palette.emerald600 });
      lines.forEach((line, li) => {
        page.drawText(line, { x: MARGIN + 20, y: y - li * 15.5, size: 11, font: fontRegular, color: palette.slate900 });
      });
      y -= lines.length * 15.5 + 4;
    });
    y -= 10;
  }

  // ── Contact — callout box, same visual treatment as offer letter's
  //    "Additional Notes from HR" box ───────────────────────────────────
  if (data.contactName || data.contactEmail || data.contactPhone) {
    sectionHeading("Who To Ask For");
    const contactBits = [
      data.contactEmail ? `Email: ${data.contactEmail}` : null,
      data.contactPhone ? `Phone: ${data.contactPhone}` : null,
    ].filter(Boolean) as string[];
    const contactLine = `${data.contactName ?? "Your onboarding contact"} will be expecting you when you arrive.`;
    const lines = [contactLine, ...contactBits];
    const wrapped = lines.flatMap((l) => wrapText(l, fontOblique, 10.5, CONTENT_WIDTH - 28));
    const boxHeight = wrapped.length * 15 + 20;
    ensureSpace(boxHeight);
    page.drawRectangle({ x: MARGIN, y: y - boxHeight + 15, width: CONTENT_WIDTH, height: boxHeight, color: palette.slate100 });
    page.drawRectangle({ x: MARGIN, y: y - boxHeight + 15, width: 3, height: boxHeight, color: palette.emerald500 });
    let contactY = y - 6;
    wrapped.forEach((line) => {
      page.drawText(line, { x: MARGIN + 16, y: contactY, size: 10.5, font: fontOblique, color: palette.slate600 });
      contactY -= 15;
    });
    y -= boxHeight + 10;
  }

  // ── Closing note — no legal/authorization block; this isn't a contract ─
  ensureSpace(40);
  drawParagraph(
    "Questions before your start date? Just reply to the email this sheet came with — we're happy to help.",
    { size: 9.5, font: fontOblique, color: palette.slate400, lineGap: 13 },
  );

  // ── Footer on every page ───────────────────────────────────────────────
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: MARGIN, y: MARGIN + 26 }, end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 26 }, thickness: 0.75, color: palette.slate200 });
    p.drawText(`${data.companyName} — Day 1 Info Sheet for ${data.candidateName}`, {
      x: MARGIN,
      y: MARGIN + 12,
      size: 8,
      font: fontRegular,
      color: palette.slate400,
    });
    const pageLabel = `Page ${i + 1} of ${pages.length}`;
    p.drawText(pageLabel, {
      x: PAGE_WIDTH - MARGIN - fontRegular.widthOfTextAtSize(pageLabel, 8),
      y: MARGIN + 12,
      size: 8,
      font: fontRegular,
      color: palette.slate400,
    });
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
