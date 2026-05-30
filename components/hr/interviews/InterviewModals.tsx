"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Building2,
  Check,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarClock,
  RefreshCw,
  Link2,
  FileText,
  UserCheck,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Bell,
  User,
} from "lucide-react";
import {
  apiFetch,
  getColor,
  getInitials,
} from "@/app/(role)/dashboard/hr/_components/shared";
import {
  Interview,
  ShortlistedCandidate,
  AnyInputEvent,
  inputCls,
  inputErrorCls,
  formatDate,
  formatTime,
  formatTimeRange,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// FIELD
// ─────────────────────────────────────────────────────────────────────────────
function Field({
  label,
  children,
  error,
  hint,
  icon,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
        {required && (
          <span className="text-red-400 text-[0.75rem] leading-none">*</span>
        )}
      </label>
      <div className="relative">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-[5px] text-[0.72rem] text-red-400">
            <AlertCircle size={10} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      {!error && hint && <p className="text-[0.7rem] text-[#3d5c49]">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────────────────────
function Section({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-emerald-500/50">{icon}</span>
      <span className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-[#3d5c49]">
        {label}
      </span>
      <div className="flex-1 h-px bg-emerald-500/8" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL SHELL
// ─────────────────────────────────────────────────────────────────────────────
function ModalShell({
  title,
  subtitle,
  onClose,
  maxWidth = "max-w-[600px]",
  zIndex = "z-[100]",
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: string;
  zIndex?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]`}>
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full ${maxWidth} max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]`}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW TYPE TOGGLE
// ─────────────────────────────────────────────────────────────────────────────
function InterviewTypeToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: "online" | "onsite") => void;
}) {
  return (
    <div className="flex gap-3">
      {[
        {
          val: "online",
          label: "Online",
          Icon: Video,
          hint: "Zoom, Meet, dll.",
        },
        { val: "onsite", label: "Onsite", Icon: Building2, hint: "Tatap muka" },
      ].map(({ val, label, Icon, hint }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val as "online" | "onsite")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-[11px] border text-[0.82rem] font-medium cursor-pointer transition-all ${
            value === val
              ? "bg-emerald-500/12 border-emerald-500/40 text-emerald-400"
              : "bg-[#080f0b] border-emerald-500/12 text-[#5a8070] hover:border-emerald-500/25 hover:text-[#c5d9cc]"
          }`}>
          <Icon size={16} />
          <span>{label}</span>
          <span className="text-[0.65rem] opacity-60">{hint}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function ConfirmModal({
  type,
  candidateName,
  onConfirm,
  onCancel,
  loading,
}: {
  type: "done" | "cancelled";
  candidateName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const isDone = type === "done";
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2 }}
        className="bg-[#0a100c] border border-emerald-500/20 rounded-[20px] w-full max-w-[360px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        <div className="p-6">
          <div
            className="w-12 h-12 rounded-[13px] flex items-center justify-center mx-auto mb-4"
            style={{
              background: isDone
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
              color: isDone ? "#10b981" : "#ef4444",
              border: `1px solid ${isDone ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}>
            {isDone ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </div>
          <div className="text-center mb-5">
            <div className="font-bold text-[1rem] text-[#e8f0ec] mb-1">
              {isDone ? "Tandai Interview Selesai?" : "Batalkan Interview?"}
            </div>
            <div className="text-[0.78rem] text-[#5a8070] mb-3">
              {candidateName}
            </div>
            <p className="text-[0.8rem] text-[#6a9080] leading-[1.65]">
              {isDone
                ? "Interview akan ditandai sebagai selesai. Aksi ini tidak dapat dibatalkan."
                : "Interview akan dibatalkan. Kamu masih bisa menjadwalkan ulang setelahnya."}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-[10px] rounded-[10px] bg-[#080f0b] border border-emerald-500/15 text-[#6a9080] text-[0.83rem] font-medium cursor-pointer hover:text-[#e8f0ec] hover:border-emerald-500/30 transition-all disabled:opacity-40">
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-[10px] rounded-[10px] text-[0.83rem] font-bold cursor-pointer transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                background: isDone
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(239,68,68,0.15)",
                border: `1px solid ${isDone ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"}`,
                color: isDone ? "#10b981" : "#ef4444",
              }}>
              {loading && <Loader2 size={13} className="animate-spin" />}
              {isDone ? "Ya, Selesai" : "Ya, Batalkan"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REMINDER MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function ReminderModal({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const options = [
    { label: "15 menit sebelumnya", value: "15" },
    { label: "30 menit sebelumnya", value: "30" },
    { label: "1 jam sebelumnya", value: "60" },
    { label: "1 hari sebelumnya", value: "1440" },
  ];

  const handleSend = () => {
    if (!selected) return;
    setSent(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-[#0a100c] border border-emerald-500/20 rounded-[18px] w-full max-w-[340px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[9px] bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Bell size={14} />
              </div>
              <div>
                <div className="text-[0.85rem] font-bold text-[#e8f0ec]">
                  Set Reminder
                </div>
                <div className="text-[0.7rem] text-[#5a8070]">
                  {interview.candidate_name}
                </div>
              </div>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="w-7 h-7 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] transition-all cursor-pointer">
              <X size={12} />
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-center py-4 gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-[0.83rem] text-emerald-400 font-semibold">
                Reminder diset!
              </span>
            </div>
          ) : (
            <>
              <p className="text-[0.75rem] text-[#5a8070] mb-3">
                Ingatkan saya sebelum interview:
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className={`flex items-center gap-3 px-3 py-[9px] rounded-[9px] border text-[0.8rem] text-left cursor-pointer transition-all ${
                      selected === opt.value
                        ? "bg-amber-500/10 border-amber-500/35 text-amber-400"
                        : "bg-[#080f0b] border-emerald-500/12 text-[#6a9080] hover:border-emerald-500/25 hover:text-[#c5d9cc]"
                    }`}>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selected === opt.value
                          ? "border-amber-400 bg-amber-400"
                          : "border-[#3d5c49]"
                      }`}>
                      {selected === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSend}
                disabled={!selected}
                className="w-full py-[9px] rounded-[10px] bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-[0.82rem] font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                <Bell size={13} /> Set Reminder
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// START MEETING MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function StartMeetingModal({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  const isOnline = interview.type === "online";

  const handleJoin = () => {
    if (isOnline && interview.location) {
      window.open(interview.location, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-[#0a100c] border border-emerald-500/20 rounded-[18px] w-full max-w-[380px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[9px] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                {isOnline ? <Video size={14} /> : <Building2 size={14} />}
              </div>
              <div>
                <div className="text-[0.85rem] font-bold text-[#e8f0ec]">
                  {isOnline ? "Join Meeting" : "Mulai Interview"}
                </div>
                <div className="text-[0.7rem] text-[#5a8070]">
                  {interview.candidate_name}
                </div>
              </div>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="w-7 h-7 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] transition-all cursor-pointer">
              <X size={12} />
            </button>
          </div>

          <div className="bg-emerald-500/[0.04] border border-emerald-500/12 rounded-[11px] p-3 mb-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[0.78rem] text-[#6a9080]">
              <Clock size={12} className="text-emerald-500/50 flex-shrink-0" />
              {formatTimeRange(
                interview.scheduled_at,
                interview.duration_minutes,
              )}{" "}
              · {interview.duration_minutes ?? 60} min
            </div>
            <div className="flex items-center gap-2 text-[0.78rem] text-[#6a9080]">
              {isOnline ? (
                <Link2
                  size={12}
                  className="text-emerald-500/50 flex-shrink-0"
                />
              ) : (
                <MapPin
                  size={12}
                  className="text-emerald-500/50 flex-shrink-0"
                />
              )}
              <span className="truncate">
                {interview.location ||
                  (isOnline ? "Tidak ada link meeting" : "Tidak ada lokasi")}
              </span>
            </div>
            {interview.interviewer_name && (
              <div className="flex items-center gap-2 text-[0.78rem] text-[#6a9080]">
                <User size={12} className="text-emerald-500/50 flex-shrink-0" />
                {interview.interviewer_name}
              </div>
            )}
          </div>

          {interview.notes && (
            <div className="bg-[#080f0b] border border-emerald-500/10 rounded-[9px] px-3 py-2 mb-4">
              <div className="text-[0.65rem] font-bold text-[#3d5c49] uppercase tracking-[0.08em] mb-1">
                Catatan
              </div>
              <p className="text-[0.75rem] text-[#5a8070] leading-relaxed">
                {interview.notes}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-[9px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:text-[#e8f0ec] hover:border-emerald-500/30 transition-all cursor-pointer">
              Tutup
            </button>
            <button
              onClick={handleJoin}
              disabled={isOnline && !interview.location}
              className="flex-1 py-[9px] rounded-[10px] bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-[0.82rem] font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
              {isOnline ? (
                <>
                  <ExternalLink size={13} /> Join Meeting
                </>
              ) : (
                <>
                  <Check size={13} /> Mulai
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESCHEDULE MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function RescheduleModal({
  interview,
  token,
  onDone,
  onClose,
}: {
  interview: Interview;
  token: string;
  onDone: () => void;
  onClose: () => void;
}) {
  const existing = new Date(interview.scheduled_at);
  const pad = (n: number) => String(n).padStart(2, "0");

  const [form, setForm] = useState({
    date: `${existing.getFullYear()}-${pad(existing.getMonth() + 1)}-${pad(existing.getDate())}`,
    time: `${pad(existing.getHours())}:${pad(existing.getMinutes())}`,
    type: interview.type,
    location: interview.location || "",
    notes: interview.notes || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: AnyInputEvent) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.date) errs.date = "Tanggal wajib diisi";
    if (!form.time) errs.time = "Jam wajib diisi";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const scheduled_at = new Date(
        `${form.date}T${form.time}:00`,
      ).toISOString();
      await apiFetch(`/api/interviews/${interview.id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          status: "scheduled",
          scheduled_at,
          type: form.type,
          location: form.location || null,
          notes: form.notes || null,
        }),
      });
      onDone();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({
          submit: err.message,
        });
      } else {
        setErrors({
          submit: "Terjadi kesalahan",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title="Jadwalkan Ulang"
      subtitle={`${interview.candidate_name} · ${interview.job_title}`}
      onClose={onClose}
      maxWidth="max-w-[500px]"
      zIndex="z-[200]"
      icon={<RefreshCw size={15} />}>
      <div className="bg-red-500/[0.05] border border-red-500/15 rounded-[11px] px-4 py-3 flex items-start gap-3">
        <div className="w-8 h-8 rounded-[8px] bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-[1px]">
          <XCircle size={14} className="text-red-400" />
        </div>
        <div>
          <div className="text-[0.7rem] font-bold text-red-400/70 tracking-[0.08em] uppercase mb-[2px]">
            Jadwal Dibatalkan
          </div>
          <div className="text-[0.82rem] text-[#6a9080]">
            {formatDate(interview.scheduled_at)} ·{" "}
            {formatTime(interview.scheduled_at)} WIB
          </div>
        </div>
      </div>
      <Section label="Jadwal Baru" icon={<Calendar size={12} />} />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Tanggal Baru"
          icon={<Calendar size={11} />}
          required
          error={errors.date}>
          <input
            title="date"
            type="date"
            value={form.date}
            onChange={set("date")}
            min={new Date().toISOString().split("T")[0]}
            className={errors.date ? inputErrorCls : inputCls}
          />
        </Field>
        <Field
          label="Jam Baru"
          icon={<Clock size={11} />}
          required
          error={errors.time}>
          <input
            title="time"
            type="time"
            value={form.time}
            onChange={set("time")}
            className={errors.time ? inputErrorCls : inputCls}
          />
        </Field>
      </div>
      <Field label="Tipe Interview" icon={<Video size={11} />}>
        <InterviewTypeToggle
          value={form.type}
          onChange={(val) => setForm((p) => ({ ...p, type: val }))}
        />
      </Field>
      <Field
        label={form.type === "online" ? "Link Meeting" : "Alamat / Ruangan"}
        icon={
          form.type === "online" ? <Link2 size={11} /> : <MapPin size={11} />
        }
        hint={
          form.type === "online"
            ? "Zoom, Google Meet, Microsoft Teams, dll."
            : undefined
        }>
        <input
          value={form.location}
          onChange={set("location")}
          placeholder={
            form.type === "online"
              ? "https://meet.google.com/xxx-xxxx-xxx"
              : "Ruang Rapat Lt. 3"
          }
          className={inputCls}
        />
      </Field>
      <Field label="Catatan" icon={<FileText size={11} />} hint="Opsional">
        <textarea
          value={form.notes}
          onChange={set("notes")}
          rows={3}
          placeholder="Catatan untuk interview baru..."
          className={`${inputCls} resize-none`}
        />
      </Field>
      {errors._global && (
        <div className="flex items-center gap-2 text-red-400 text-[0.8rem] bg-red-500/8 border border-red-500/20 rounded-[9px] px-3 py-2">
          <AlertCircle size={13} className="flex-shrink-0" /> {errors._global}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onClose}
          className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer">
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-[10px] rounded-[10px] bg-cyan-500 hover:bg-cyan-400 text-black text-[0.82rem] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Menyimpan..." : "Jadwalkan Ulang"}
        </button>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function ScheduleModal({
  token,
  candidates,
  onDone,
  onClose,
}: {
  token: string;
  candidates: ShortlistedCandidate[];
  onDone: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    application_id: "",
    date: "",
    time: "",
    type: "online",
    location: "",
    notes: "",
    round: "First Interview",
    duration: "60",
    interviewer: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: AnyInputEvent) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.application_id)
      errs.application_id = "Pilih kandidat terlebih dahulu";
    if (!form.date) errs.date = "Tanggal wajib diisi";
    if (!form.time) errs.time = "Jam wajib diisi";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const scheduled_at = new Date(
        `${form.date}T${form.time}:00`,
      ).toISOString();
      await apiFetch("/api/interviews", token, {
        method: "POST",
        body: JSON.stringify({
          application_id: form.application_id,
          scheduled_at,
          type: form.type,
          location: form.location || null,
          notes: form.notes || null,
          round: form.round,
          duration_minutes: parseInt(form.duration),
          interviewer_name: form.interviewer || null,
        }),
      });
      onDone();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({
          submit: err.message,
        });
      } else {
        setErrors({
          submit: "Terjadi kesalahan",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const byJob = candidates.reduce<Record<string, ShortlistedCandidate[]>>(
    (acc, c) => {
      if (!acc[c.job_title]) acc[c.job_title] = [];
      acc[c.job_title].push(c);
      return acc;
    },
    {},
  );

  return (
    <ModalShell
      title="Create Interview"
      subtitle={
        candidates.length > 0
          ? `${candidates.length} kandidat shortlisted tersedia`
          : "Semua kandidat sudah terjadwal"
      }
      onClose={onClose}
      maxWidth="max-w-[520px]"
      icon={<Sparkles size={15} />}>
      <Section label="Pilih Kandidat" icon={<UserCheck size={12} />} />
      <Field
        label="Kandidat"
        icon={<UserCheck size={11} />}
        required
        error={errors.application_id}>
        <div className="relative">
          <select
            title="Pilih Kandidat"
            value={form.application_id}
            onChange={set("application_id")}
            className={`${errors.application_id ? inputErrorCls : inputCls} appearance-none cursor-pointer pr-8`}>
            <option value="">Pilih kandidat shortlisted...</option>
            {Object.entries(byJob).map(([jobTitle, cands]) => (
              <optgroup key={jobTitle} label={`── ${jobTitle}`}>
                {cands.map((c) => (
                  <option key={c.application_id} value={c.application_id}>
                    {c.candidate_name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d7060] pointer-events-none"
          />
        </div>
      </Field>
      {candidates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {candidates.slice(0, 6).map((c, i) => (
            <button
              key={c.application_id}
              type="button"
              onClick={() =>
                setForm((p) => ({ ...p, application_id: c.application_id }))
              }
              className={`flex items-center gap-[6px] px-[9px] py-[5px] rounded-[7px] text-[11px] font-medium cursor-pointer transition-all ${
                form.application_id === c.application_id
                  ? "bg-emerald-500/15 border border-emerald-500/35 text-emerald-400"
                  : "bg-[#080f0b] border border-emerald-500/12 text-[#5a8070] hover:border-emerald-500/25 hover:text-[#a8c5b2]"
              }`}>
              <div
                className="w-5 h-5 rounded-[4px] flex items-center justify-center text-[9px] font-extrabold flex-shrink-0"
                style={{ background: `${getColor(i)}18`, color: getColor(i) }}>
                {getInitials(c.candidate_name)}
              </div>
              <span className="truncate max-w-[90px]">{c.candidate_name}</span>
            </button>
          ))}
          {candidates.length > 6 && (
            <span className="px-[9px] py-[5px] text-[11px] text-[#5a8070]">
              +{candidates.length - 6} lagi
            </span>
          )}
        </div>
      )}
      <Section label="Detail Interview" icon={<CalendarClock size={12} />} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Round" icon={<Sparkles size={11} />}>
          <select
            title="Pilih Round Interview"
            value={form.round}
            onChange={set("round")}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option>First Interview</option>
            <option>Second Interview</option>
            <option>Final Interview</option>
          </select>
        </Field>
        <Field label="Durasi" icon={<Clock size={11} />}>
          <select
            title="duration"
            value={form.duration}
            onChange={set("duration")}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="30">30 menit</option>
            <option value="60">1 jam</option>
            <option value="90">1.5 jam</option>
            <option value="120">2 jam</option>
          </select>
        </Field>
      </div>
      <Section label="Waktu & Tempat" icon={<Calendar size={12} />} />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Tanggal"
          icon={<Calendar size={11} />}
          required
          error={errors.date}>
          <input
            title="date"
            type="date"
            value={form.date}
            onChange={set("date")}
            min={new Date().toISOString().split("T")[0]}
            className={errors.date ? inputErrorCls : inputCls}
          />
        </Field>
        <Field
          label="Jam"
          icon={<Clock size={11} />}
          required
          error={errors.time}>
          <input
            title="time"
            type="time"
            value={form.time}
            onChange={set("time")}
            className={errors.time ? inputErrorCls : inputCls}
          />
        </Field>
      </div>
      <Field label="Tipe Interview" icon={<Video size={11} />}>
        <InterviewTypeToggle
          value={form.type}
          onChange={(val) => setForm((p) => ({ ...p, type: val }))}
        />
      </Field>
      <Field
        label={form.type === "online" ? "Link Meeting" : "Alamat / Ruangan"}
        icon={
          form.type === "online" ? <Link2 size={11} /> : <MapPin size={11} />
        }
        hint={
          form.type === "online"
            ? "Zoom, Google Meet, Microsoft Teams, dll."
            : "Lantai, gedung, atau ruangan spesifik"
        }>
        <input
          value={form.location}
          onChange={set("location")}
          placeholder={
            form.type === "online"
              ? "https://meet.google.com/xxx-xxxx-xxx"
              : "Ruang Rapat Lt. 3, Gedung A"
          }
          className={inputCls}
        />
      </Field>
      <Field
        label="Interviewer"
        icon={<User size={11} />}
        hint="Opsional — nama interviewer yang bertugas">
        <input
          value={form.interviewer}
          onChange={set("interviewer")}
          placeholder="Nama interviewer..."
          className={inputCls}
        />
      </Field>
      <Section label="Catatan" icon={<FileText size={12} />} />
      <Field
        label="Catatan"
        icon={<FileText size={11} />}
        hint="Opsional — persiapan, topik, dan hal yang perlu dibawa">
        <textarea
          value={form.notes}
          onChange={set("notes")}
          rows={3}
          placeholder="Persiapan yang perlu dibawa, topik yang akan dibahas, dll..."
          className={`${inputCls} resize-none`}
        />
      </Field>
      {errors._global && (
        <div className="flex items-center gap-2 text-red-400 text-[0.8rem] bg-red-500/8 border border-red-500/20 rounded-[9px] px-3 py-2">
          <AlertCircle size={13} className="flex-shrink-0" /> {errors._global}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onClose}
          className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer">
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || candidates.length === 0}
          className="flex-1 py-[10px] rounded-[10px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.82rem] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Menyimpan..." : "Create Interview"}
        </button>
      </div>
    </ModalShell>
  );
}
