"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Loader2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Link2,
  FileText,
} from "lucide-react";
import { Interview } from "@/types/hr/interviews";
import { InterviewField } from "./InterviewField";
import { InterviewSection } from "./InterviewSection";
import { InterviewModalShell } from "./InterviewModalShell";
import { InterviewTypeToggle } from "./InterviewTypeToggle";
import { formatDate, formatTime } from "@/lib/helpers/hr/interviews";
import { inputCls, inputErrorCls } from "@/components/input";
import { useInterviewReschedule } from "@/hooks/dashboard/hr/useInterviewReschedule";

export function InterviewRescheduleModal({
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
  const { form, errors, loading, set, setType, handleSubmit } =
    useInterviewReschedule({ interview, token, onDone });

  return (
    <InterviewModalShell
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

      <InterviewSection label="Jadwal Baru" icon={<Calendar size={12} />} />

      <div className="grid grid-cols-2 gap-3">
        <InterviewField
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
        </InterviewField>
        <InterviewField
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
        </InterviewField>
      </div>

      <InterviewField label="Tipe Interview" icon={<Video size={11} />}>
        <InterviewTypeToggle value={form.type} onChange={setType} />
      </InterviewField>

      <InterviewField
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
      </InterviewField>

      <InterviewField
        label="Catatan"
        icon={<FileText size={11} />}
        hint="Opsional">
        <textarea
          value={form.notes}
          onChange={set("notes")}
          rows={3}
          placeholder="Catatan untuk interview baru..."
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
          disabled={loading}
          className="flex-1 py-[10px] rounded-[10px] bg-cyan-500 hover:bg-cyan-400 text-black text-[0.82rem] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Menyimpan..." : "Jadwalkan Ulang"}
        </button>
      </div>
    </InterviewModalShell>
  );
}
