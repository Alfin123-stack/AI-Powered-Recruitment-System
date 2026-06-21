"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Loader2,
  AlertCircle,
  CalendarClock,
  Link2,
  FileText,
  UserCheck,
  Sparkles,
  ChevronDown,
  User,
} from "lucide-react";
import { AnyInputEvent, ShortlistedCandidate } from "@/types/hr/interviews";
import { InterviewField } from "./InterviewField";
import { InterviewSection } from "./InterviewSection";
import { InterviewModalShell } from "./InterviewModalShell";
import { InterviewTypeToggle } from "./InterviewTypeToggle";

import { getColor, getInitials } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { inputCls, inputErrorCls } from "@/components/input";

export function InterviewScheduleModal({
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
        setErrors({ submit: err.message });
      } else {
        setErrors({ submit: "Terjadi kesalahan" });
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
    <InterviewModalShell
      title="Create Interview"
      subtitle={
        candidates.length > 0
          ? `${candidates.length} kandidat shortlisted tersedia`
          : "Semua kandidat sudah terjadwal"
      }
      onClose={onClose}
      maxWidth="max-w-[520px]"
      icon={<Sparkles size={15} />}>
      <InterviewSection label="Pilih Kandidat" icon={<UserCheck size={12} />} />

      <InterviewField
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
      </InterviewField>

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

      <InterviewSection
        label="Detail Interview"
        icon={<CalendarClock size={12} />}
      />

      <div className="grid grid-cols-2 gap-3">
        <InterviewField label="Round" icon={<Sparkles size={11} />}>
          <select
            title="Pilih Round Interview"
            value={form.round}
            onChange={set("round")}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option>First Interview</option>
            <option>Second Interview</option>
            <option>Final Interview</option>
          </select>
        </InterviewField>
        <InterviewField label="Durasi" icon={<Clock size={11} />}>
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
        </InterviewField>
      </div>

      <InterviewSection label="Waktu & Tempat" icon={<Calendar size={12} />} />

      <div className="grid grid-cols-2 gap-3">
        <InterviewField
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
        </InterviewField>
        <InterviewField
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
        </InterviewField>
      </div>

      <InterviewField label="Tipe Interview" icon={<Video size={11} />}>
        <InterviewTypeToggle
          value={form.type}
          onChange={(val) => setForm((p) => ({ ...p, type: val }))}
        />
      </InterviewField>

      <InterviewField
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
      </InterviewField>

      <InterviewField
        label="Interviewer"
        icon={<User size={11} />}
        hint="Opsional — nama interviewer yang bertugas">
        <input
          value={form.interviewer}
          onChange={set("interviewer")}
          placeholder="Nama interviewer..."
          className={inputCls}
        />
      </InterviewField>

      <InterviewSection label="Catatan" icon={<FileText size={12} />} />

      <InterviewField
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
      </InterviewField>

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
    </InterviewModalShell>
  );
}
