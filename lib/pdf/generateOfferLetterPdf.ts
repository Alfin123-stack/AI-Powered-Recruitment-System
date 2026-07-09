// lib/pdf/generateOfferLetterPdf.ts
//
// Generates the FORMAL offer letter as a PDF Buffer, to be sent as an email
// attachment alongside the short/scannable HTML email (buildOfferEmailHtml).
// This is where full contract-style detail belongs — the email body stays
// short per best practice, this PDF carries the complete terms.
//
// Uses `pdf-lib` (pure JS, no headless Chrome/puppeteer needed — works fine
// in serverless/Next.js server actions). Install with:
//   npm install pdf-lib
//
// Design notes (v2):
// - Color palette matches the app's own theme (Tailwind emerald), so the
//   PDF doesn't look like a generic template dropped into a green product.
// - Layout follows common offer-letter conventions: letterhead band →
//   date/reference row → salutation → intro → bordered "position details"
//   table → benefits → HR notes callout → contingency/legal notice →
//   authorization block → footer with confidentiality line + page number.
// - Auto-pagination: the old version drew everything on a single fixed
//   page with no overflow handling — long notes/benefits lists could run
//   off the bottom of the page and simply get clipped. This version tracks
//   remaining vertical space and starts a new (lighter) letterhead page
//   whenever a section wouldn't fit.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export interface OfferLetterPdfData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  salary?: string;
  startDate?: string;
  notes?: string;
  expiresAt: string; // ISO date string
  // Optional extra terms — safe to omit, lines are simply skipped if absent
  workingHours?: string;
  contractType?: string;
  reportingManager?: string;
  benefits?: string[];
  issuedDate?: string; // defaults to "today" if omitted
}

// ── Palette — Tailwind emerald + slate, matching the app's own theme ───────
const palette = {
  emerald50: rgb(0.925, 0.992, 0.961),
  emerald100: rgb(0.820, 0.980, 0.898),
  emerald200: rgb(0.655, 0.949, 0.827),
  emerald500: rgb(0.063, 0.725, 0.506),
  emerald600: rgb(0.020, 0.588, 0.412),
  emerald700: rgb(0.016, 0.471, 0.341),
  emerald900: rgb(0.024, 0.306, 0.231),
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
const FOOTER_RESERVE = 54; // vertical space kept clear above the footer

function formatSalaryForPdf(salary?: string): string {
  if (!salary) return "To be discussed";
  const trimmed = salary.trim();

  if (/^\d+$/.test(trimmed)) {
    return `Rp ${Number(trimmed).toLocaleString("id-ID")}`;
  }
  const range = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
  if (range) {
    const [, min, max] = range;
    return `Rp ${Number(min).toLocaleString("id-ID")} - Rp ${Number(max).toLocaleString("id-ID")}`;
  }
  return trimmed;
}

function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
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

export async function generateOfferLetterPdf(data: OfferLetterPdfData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // ── Mutable "cursor" state — current page + vertical position ───────────
  // pdf-lib has no built-in flow layout, so we track this by hand and spin
  // up a new page whenever the next block wouldn't fit above the footer.
  // FIX: "Variable 'page' is used before being assigned" — TypeScript's
  // control-flow analysis can't see that `addPage()` (called right below,
  // synchronously, before any read of `page`) always assigns it first; the
  // assignment happens inside a closure, which TS doesn't trace through.
  // A definite assignment assertion (`!`) tells TS "trust me, this is set
  // before use" instead of widening the type to `PDFPage | undefined`
  // everywhere and forcing null checks on every single `page.draw...` call.
  let page!: PDFPage;
  let y = 0;
  const pages: PDFPage[] = [];

  const drawLetterhead = (isFirstPage: boolean) => {
    // Full letterhead band on page 1; a slimmer "continued" band on any
    // overflow pages, so long offers don't repeat the whole header block.
    const bandHeight = isFirstPage ? 118 : 56;
    page.drawRectangle({ x: 0, y: PAGE_HEIGHT - bandHeight, width: PAGE_WIDTH, height: bandHeight, color: palette.emerald700 });
    // Subtle accent shape for visual interest, kept inside the band so it
    // never collides with body text.
    page.drawEllipse({
      x: PAGE_WIDTH - 60,
      y: PAGE_HEIGHT - bandHeight + 18,
      xScale: 90,
      yScale: 90,
      color: palette.emerald600,
      opacity: 0.35,
    });
    page.drawRectangle({ x: 0, y: PAGE_HEIGHT - bandHeight, width: PAGE_WIDTH, height: bandHeight, color: palette.emerald700, opacity: 0 });

    if (isFirstPage) {
      page.drawText(data.companyName.toUpperCase(), {
        x: MARGIN,
        y: PAGE_HEIGHT - 48,
        size: 19,
        font: fontBold,
        color: palette.white,
      });
      page.drawText("OFFER OF EMPLOYMENT", {
        x: MARGIN,
        y: PAGE_HEIGHT - 70,
        size: 10.5,
        font: fontBold,
        color: palette.emerald100,
      });
      page.drawText(`For the position of ${data.jobTitle}`, {
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
      page.drawText("Offer of Employment — continued", {
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

  /** Starts a new page if the next block (of the given height) won't fit above the footer reserve. */
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
    // Small accent bar to the left of section headings — a common cue in
    // formal documents/contracts to mark a new section without needing a
    // full horizontal rule.
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

  // Reference / date row — standard on formal business letters.
  const issued = data.issuedDate ?? formatLongDate(new Date().toISOString());
  drawText(`Date Issued: ${issued}`, { size: 9.5, color: palette.slate600 });
  const deadlineLabel = `Response Deadline: ${formatLongDate(data.expiresAt)}`;
  drawText(deadlineLabel, {
    x: PAGE_WIDTH - MARGIN - fontRegular.widthOfTextAtSize(deadlineLabel, 9.5),
    size: 9.5,
    color: palette.slate600,
  });
  y -= 22;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y }, thickness: 1, color: palette.slate200 });
  y -= 26;

  // ── Salutation & intro ───────────────────────────────────────────────
  drawText(`Dear ${data.candidateName},`, { size: 12.5, font: fontBold });
  y -= 22;
  drawParagraph(
    `We are pleased to formally offer you the position of ${data.jobTitle} at ${data.companyName}. This letter outlines the key terms of your employment. Please review the details below carefully before responding.`,
  );
  y -= 12;

  // ── Position details — bordered table, not a stacked list ───────────────
  sectionHeading("Position Details");

  const rows: [string, string][] = [
    ["Position", data.jobTitle],
    ["Compensation", formatSalaryForPdf(data.salary)],
  ];
  if (data.startDate) rows.push(["Start Date", data.startDate]);
  if (data.contractType) rows.push(["Contract Type", data.contractType]);
  if (data.workingHours) rows.push(["Working Hours", data.workingHours]);
  if (data.reportingManager) rows.push(["Reporting To", data.reportingManager]);
  rows.push(["Response Deadline", formatLongDate(data.expiresAt)]);

  const rowHeight = 27;
  const labelColWidth = CONTENT_WIDTH * 0.36;
  ensureSpace(rowHeight * Math.min(rows.length, 3)); // keep the table from starting right at a page edge

  rows.forEach(([label, value], i) => {
    ensureSpace(rowHeight);
    const rowTop = y;
    const zebra = i % 2 === 1;
    if (zebra) {
      page.drawRectangle({ x: MARGIN, y: rowTop - rowHeight, width: CONTENT_WIDTH, height: rowHeight, color: palette.emerald50 });
    }
    // Border drawn per-row (not one big box around the whole table) — this
    // keeps each row self-contained on whichever page it ends up on, so a
    // table that happens to straddle a page break never produces a
    // mis-measured box spanning two different pages' coordinate systems.
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
    const valueLines = wrapText(value, fontBold, 11, CONTENT_WIDTH - labelColWidth - 24);
    page.drawText(valueLines[0] ?? value, {
      x: MARGIN + labelColWidth,
      y: rowTop - rowHeight / 2 - 3.5,
      size: 11,
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

  // ── Benefits ─────────────────────────────────────────────────────────
  if (data.benefits && data.benefits.length > 0) {
    sectionHeading("Benefits & Perks");
    data.benefits.forEach((b) => {
      const lines = wrapText(b, fontRegular, 11, CONTENT_WIDTH - 18);
      ensureSpace(lines.length * 15.5);
      page.drawEllipse({ x: MARGIN + 4, y: y - 4.5, xScale: 2.4, yScale: 2.4, color: palette.emerald500 });
      lines.forEach((line, i) => {
        page.drawText(line, { x: MARGIN + 16, y, size: 11, font: fontRegular, color: palette.slate900 });
        y -= 15.5;
      });
    });
    y -= 10;
  }

  // ── Notes from HR — callout box ──────────────────────────────────────
  if (data.notes) {
    sectionHeading("Additional Notes from HR");
    const lines = wrapText(data.notes, fontOblique, 10.5, CONTENT_WIDTH - 28);
    const boxHeight = lines.length * 15 + 20;
    ensureSpace(boxHeight);
    page.drawRectangle({ x: MARGIN, y: y - boxHeight + 15, width: CONTENT_WIDTH, height: boxHeight, color: palette.slate100 });
    page.drawRectangle({ x: MARGIN, y: y - boxHeight + 15, width: 3, height: boxHeight, color: palette.emerald500 });
    let noteY = y - 6;
    lines.forEach((line) => {
      page.drawText(line, { x: MARGIN + 16, y: noteY, size: 10.5, font: fontOblique, color: palette.slate600 });
      noteY -= 15;
    });
    y -= boxHeight + 10;
  }

  // ── Contingency / legal notice ────────────────────────────────────────
  ensureSpace(70);
  const noticeText =
    "This offer is contingent upon mutual agreement of the terms above and is valid only until the response deadline stated on this letter. Please confirm your acceptance or decline through the secure link provided in the accompanying email. This letter, together with that email, constitutes the complete offer; any additional terms will be provided separately during onboarding.";
  const noticeLines = wrapText(noticeText, fontRegular, 9.5, CONTENT_WIDTH - 28);
  const noticeBoxHeight = noticeLines.length * 14 + 18;
  ensureSpace(noticeBoxHeight);
  page.drawRectangle({
    x: MARGIN,
    y: y - noticeBoxHeight + 12,
    width: CONTENT_WIDTH,
    height: noticeBoxHeight,
    borderColor: palette.slate200,
    borderWidth: 1,
  });
  let noticeY = y - 4;
  noticeLines.forEach((line) => {
    page.drawText(line, { x: MARGIN + 14, y: noticeY, size: 9.5, font: fontRegular, color: palette.slate600 });
    noticeY -= 14;
  });
  y -= noticeBoxHeight + 28;

  // ── Authorization block ───────────────────────────────────────────────
  ensureSpace(70);
  page.drawLine({ start: { x: MARGIN, y }, end: { x: MARGIN + 200, y }, thickness: 1, color: palette.slate400 });
  y -= 16;
  drawText("Authorized on behalf of", { size: 9, color: palette.slate600 });
  y -= 16;
  drawText(data.companyName, { size: 12.5, font: fontBold });
  y -= 16;
  drawText("Human Resources Department", { size: 9.5, color: palette.slate600 });
  y -= 20;
  drawParagraph(
    "This letter was generated electronically and does not require a physical signature. Your acceptance is recorded when you respond via the secure link in the offer email.",
    { size: 8.5, font: fontOblique, color: palette.slate400, lineGap: 12 },
  );

  // ── Footer on every page — confidentiality notice + pagination ────────
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: MARGIN, y: MARGIN + 26 }, end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 26 }, thickness: 0.75, color: palette.slate200 });
    p.drawText(`${data.companyName} — Confidential offer letter for ${data.candidateName}`, {
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