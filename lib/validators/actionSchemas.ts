import { z } from "zod";

// Skema Zod untuk validasi input Server Actions di actions/*.ts.
//
// KENAPA INI PERLU: Server Actions Next.js pada dasarnya adalah endpoint
// HTTP juga (Next.js generate route POST tersembunyi untuk tiap action) --
// bisa dipanggil langsung tanpa lewat form UI kalau seseorang tahu/menebak
// action ID-nya. Backend Express sudah divalidasi pakai Zod; Server Actions
// ini sebelumnya TIDAK, jadi ini nutup gap itu.

export const sendOfferInputSchema = z.object({
  applicationId: z.string().uuid("applicationId harus UUID valid"),
  candidateName: z.string().trim().min(1, "candidateName wajib diisi").max(200),
  candidateEmail: z.string().trim().email("candidateEmail tidak valid"),
  jobTitle: z.string().trim().max(200), // boleh string kosong -- ada fallback "this position" di offerActions.ts
  companyName: z.string().trim().max(200), // boleh string kosong -- ada fallback "the company" di offerActions.ts
  salary: z.string().trim().max(100),
  startDate: z.string().trim().max(100),
  notes: z.string().trim().max(2000).optional(),
  expiryDays: z.number().int().min(1).max(90).optional(),
  workingHours: z.string().trim().max(100).optional(),
  contractType: z.string().trim().max(100).optional(),
  reportingManager: z.string().trim().max(200).optional(),
  benefits: z.array(z.string().trim().max(200)).max(50).optional(),
});

export const sendRejectionInputSchema = z.object({
  applicationId: z.string().uuid("applicationId harus UUID valid"),
  candidateName: z.string().trim().min(1, "candidateName wajib diisi").max(200),
  candidateEmail: z.string().trim().email("candidateEmail tidak valid"),
  jobTitle: z.string().trim().max(200),
  companyName: z.string().trim().max(200),
  feedback: z.string().trim().max(3000).optional(),
});

export const sendOnboardingInputSchema = z.object({
  applicationId: z.string().uuid("applicationId harus UUID valid"),
  candidateName: z.string().trim().min(1, "candidateName wajib diisi").max(200),
  candidateEmail: z.string().trim().email("candidateEmail tidak valid"),
  jobTitle: z.string().trim().max(200),
  companyName: z.string().trim().max(200),
  startDate: z.string().trim().max(100),
  reportTime: z.string().trim().max(100).optional(),
  location: z.string().trim().max(300).optional(),
  // Kolom video-call boleh kosong ("") dari form -- z.literal("") mengizinkan itu,
  // tapi kalau diisi harus URL yang valid.
  videoCallUrl: z.union([z.literal(""), z.string().trim().url("videoCallUrl harus URL valid")]).optional(),
  contactName: z.string().trim().max(200).optional(),
  contactEmail: z.union([z.literal(""), z.string().trim().email()]).optional(),
  contactPhone: z.string().trim().max(50).optional(),
  documentsNeeded: z.array(z.string().trim().max(200)).max(50).optional(),
  dressCode: z.string().trim().max(200).optional(),
  firstDayAgenda: z.array(z.string().trim().max(300)).max(50).optional(),
  additionalNotes: z.string().trim().max(2000).optional(),
});

export const respondToOfferInputSchema = z.object({
  applicationId: z.string().uuid("applicationId harus UUID valid"),
  token: z.string().min(1, "token wajib diisi"),
  offerStatus: z.enum(["accepted", "declined"]),
});

/** Format pesan error Zod jadi 1 string ringkas, dipakai seragam di semua action. */
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(", ");
}
