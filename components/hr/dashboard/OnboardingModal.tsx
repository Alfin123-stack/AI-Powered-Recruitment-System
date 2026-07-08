"use client";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  Send,
  Loader2,
  ClipboardList,
  Mail,
  MapPin,
  Video,
  Shirt,
  ListChecks,
  User,
  StickyNote,
  CalendarDays,
} from "lucide-react";
import { useOnboardingEmail } from "@/hooks/dashboard/hr/useOnboardingEmail";
import RichTextEditor, {
  linesToListHtml,
  listHtmlToLines,
} from "@/components/hr/interviews/RichTextEditor";

// NOTE: adjust the hook import path above to wherever useOnboardingEmail.ts
// actually lives — kept consistent with useInterviewsOfferLetter's location.

interface OnboardingModalProps {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  // Optional prefill only — applications table doesn't persist a start
  // date (it was never stored when the offer was sent), so this is left
  // for HR to confirm/fill in the form below rather than assumed correct.
  initialStartDate?: string;
  onClose: () => void;
  onSent: () => void;
}

function OnboardingSection({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-emerald-400/70">{icon}</span>
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#4d7060]">{label}</span>
      <div className="flex-1 h-px bg-emerald-500/10" />
    </div>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

function fieldFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)";
}
function fieldBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
}

export default function OnboardingModal({
  applicationId,
  candidateName,
  candidateEmail,
  jobTitle,
  companyName,
  initialStartDate,
  onClose,
  onSent,
}: OnboardingModalProps) {
  const {
    startDate,
    setStartDate,
    reportTime,
    setReportTime,
    location,
    setLocation,
    videoCallUrl,
    setVideoCallUrl,
    dressCode,
    setDressCode,
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
    documentsNeededText,
    setDocumentsNeededText,
    firstDayAgendaText,
    setFirstDayAgendaText,
    additionalNotes,
    setAdditionalNotes,
    sending,
    error,
    handleSend,
  } = useOnboardingEmail({ applicationId, candidateName, candidateEmail, jobTitle, companyName, initialStartDate });

  const handleSubmit = async () => {
    const result = await handleSend();
    if (result.ok) {
      toast.success(`Onboarding email berhasil dikirim ke ${candidateName}`);
      onSent();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[500px] max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ClipboardList size={15} />
              </div>
              <div>
                <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">Send Onboarding Details</h2>
                <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
                  {candidateName} · {jobTitle}
                </p>
              </div>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="w-8 h-8 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {/* Candidate info */}
            <div
              className="rounded-[10px] px-4 py-3"
              style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)" }}>
              <div className="text-[0.68rem] text-[#4d7060] font-bold uppercase tracking-wide mb-1">Sending to</div>
              <div className="text-[0.82rem] text-[#e8f0ec] font-semibold">{candidateName}</div>
              <div className="text-[0.72rem] text-[#5a8070]">{candidateEmail}</div>
            </div>

            {/* Start Date — not stored in DB, HR confirms/fills it here */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <CalendarDays size={10} />
                </span>
                Start Date <span className="text-red-400 normal-case">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] focus:outline-none transition-all"
                style={{ ...inputStyle, colorScheme: "dark" }}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>

            <OnboardingSection label="Logistics" icon={<MapPin size={12} />} />

            {/* Report time */}
            <div className="flex flex-col gap-[5px]">
              <label className="text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                Report Time
              </label>
              <input
                type="text"
                value={reportTime}
                onChange={(e) => setReportTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                style={inputStyle}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-[5px]">
              <label className="text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                Office Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jl. Sudirman No. 123, Jakarta"
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                style={inputStyle}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>

            {/* Video call */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <Video size={10} />
                </span>
                Video Call Link (if remote)
              </label>
              <input
                type="url"
                value={videoCallUrl}
                onChange={(e) => setVideoCallUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                style={inputStyle}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>

            {/* Dress code */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <Shirt size={10} />
                </span>
                Dress Code
              </label>
              <input
                type="text"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                placeholder="e.g. Smart casual"
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                style={inputStyle}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>

            <OnboardingSection label="Contact Person" icon={<User size={12} />} />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-[5px]">
                <label className="text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Budi Santoso"
                  className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={fieldFocus}
                  onBlur={fieldBlur}
                />
              </div>
              <div className="flex flex-col gap-[5px]">
                <label className="text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">Phone</label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={fieldFocus}
                  onBlur={fieldBlur}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <Mail size={10} />
                </span>
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hr@company.com"
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.82rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none transition-all"
                style={inputStyle}
                onFocus={fieldFocus}
                onBlur={fieldBlur}
              />
            </div>

            <OnboardingSection label="Documents & Agenda" icon={<ListChecks size={12} />} />

            {/* Documents needed — diedit sebagai bullet list, tapi tetap
                disimpan & dikirim ke hook sebagai string newline-separated
                lewat serialize/deserialize, jadi useOnboardingEmail &
                backend tidak perlu diubah sama sekali. */}
            <div className="flex flex-col gap-[5px]">
              <label className="text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                Documents to Bring <span className="normal-case text-[#3d5c49]">(satu item per bullet)</span>
              </label>
              <RichTextEditor
                value={documentsNeededText}
                onChange={setDocumentsNeededText}
                placeholder="Original diploma, Bank account details, ID card copy..."
                minHeight={90}
                deserialize={linesToListHtml}
                serialize={listHtmlToLines}
              />
            </div>

            {/* First day agenda — sama seperti di atas: bullet list di UI,
                newline-separated string di data. */}
            <div className="flex flex-col gap-[5px]">
              <label className="text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                First Day Agenda <span className="normal-case text-[#3d5c49]">(satu item per bullet)</span>
              </label>
              <RichTextEditor
                value={firstDayAgendaText}
                onChange={setFirstDayAgendaText}
                placeholder="09:00 Welcome & office tour, 10:00 IT setup, 13:00 Lunch..."
                minHeight={90}
                deserialize={linesToListHtml}
                serialize={listHtmlToLines}
              />
            </div>

            {/* Additional notes — catch-all for anything not covered above */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
                <span className="opacity-60">
                  <StickyNote size={10} />
                </span>
                Additional Notes <span className="normal-case text-[#3d5c49]">(optional, free text)</span>
              </label>
              <RichTextEditor
                value={additionalNotes}
                onChange={setAdditionalNotes}
                placeholder="Anything else the candidate should know before Day 1..."
                minHeight={70}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-[0.75rem] text-red-400"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-4 border-t border-emerald-500/10 bg-[#080f0b] flex-shrink-0">
            <button
              onClick={onClose}
              disabled={sending}
              className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer disabled:opacity-40">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={sending || !startDate}
              className="flex-[2] flex items-center justify-center gap-2 py-[10px] rounded-[10px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.82rem] font-bold transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed">
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={13} />
                  Send Onboarding Email
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}