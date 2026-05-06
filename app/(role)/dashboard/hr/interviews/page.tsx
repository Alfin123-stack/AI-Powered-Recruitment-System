"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Building2,
  Plus,
  Check,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarClock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "../layout";
import { apiFetch, FadeIn, getColor, getInitials } from "../_components/shared";

type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: "online" | "onsite";
  location: string | null;
  notes: string | null;
  status: "scheduled" | "done" | "cancelled";
  created_at: string;
  candidate_name: string;
  job_title: string;
};

type ShortlistedCandidate = {
  application_id: string;
  candidate_id: string;
  candidate_name: string;
  job_title: string;
};

type AnyInputEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const statusConfig: {
  [key: string]: { label: string; color: string; bg: string; Icon: any };
} = {
  scheduled: {
    label: "Terjadwal",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    Icon: CalendarClock,
  },
  done: {
    label: "Selesai",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Dibatalkan",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    Icon: XCircle,
  },
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

const isTomorrow = (d: string) => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return new Date(d).toDateString() === t.toDateString();
};

const getDayLabel = (d: string) => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return formatDate(d);
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f1612] border border-emerald-500/20 rounded-[18px] w-full max-w-[380px] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{
              background: isDone
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
              color: isDone ? "#10b981" : "#ef4444",
            }}>
            {isDone ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          </div>
          <div>
            <div className="font-syne font-bold text-[0.95rem]">
              {isDone ? "Tandai Interview Selesai?" : "Batalkan Interview?"}
            </div>
            <div className="text-[0.75rem] text-[#7a9585] mt-[2px]">
              {candidateName}
            </div>
          </div>
        </div>

        <p className="text-[0.82rem] text-[#7a9585] leading-[1.6] mb-5">
          {isDone
            ? "Interview akan ditandai sebagai selesai. Aksi ini tidak dapat dibatalkan."
            : "Interview akan dibatalkan. Kamu masih bisa menjadwalkan ulang setelahnya."}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-[10px] rounded-[10px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] text-[0.85rem] font-medium cursor-pointer hover:text-[#e8f0ec] hover:border-emerald-500/30 transition-all disabled:opacity-40">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-[10px] rounded-[10px] text-[0.85rem] font-bold cursor-pointer transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            style={{
              background: isDone
                ? "rgba(16,185,129,0.15)"
                : "rgba(239,68,68,0.15)",
              border: `1px solid ${isDone ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: isDone ? "#10b981" : "#ef4444",
            }}>
            {loading && <Loader2 size={13} className="animate-spin" />}
            {isDone ? "Ya, Selesai" : "Ya, Batalkan"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Reschedule Modal ──────────────────────────────────────────────────────────
function RescheduleModal({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string) => (e: AnyInputEvent) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.date || !form.time)
      return setError("Tanggal dan jam wajib diisi");
    setLoading(true);
    setError("");
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[#141f19] border border-emerald-500/15 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-emerald-500/40 transition-colors";

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="text-[0.72rem] font-semibold text-[#7a9585] mb-[6px] block tracking-[0.06em] uppercase">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f1612] border border-emerald-500/20 rounded-[20px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-emerald-500/15">
          <div>
            <div className="flex items-center gap-2">
              <RefreshCw size={15} className="text-cyan-400" />
              <h2 className="font-syne font-extrabold text-[1.05rem]">
                Jadwalkan Ulang
              </h2>
            </div>
            <p className="text-[#7a9585] text-[0.78rem] mt-[3px]">
              {interview.candidate_name} · {interview.job_title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] cursor-pointer transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="px-7 py-6 flex flex-col gap-4">
          {/* Info jadwal lama */}
          <div className="bg-red-500/[0.05] border border-red-500/15 rounded-[10px] px-4 py-3">
            <div className="text-[0.7rem] font-bold text-red-400/70 tracking-[0.08em] uppercase mb-1">
              Jadwal Dibatalkan
            </div>
            <div className="text-[0.82rem] text-[#7a9585]">
              {formatDate(interview.scheduled_at)} ·{" "}
              {formatTime(interview.scheduled_at)} WIB
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal Baru *">
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                min={new Date().toISOString().split("T")[0]}
                className={inputCls}
              />
            </Field>
            <Field label="Jam Baru *">
              <input
                type="time"
                value={form.time}
                onChange={set("time")}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Tipe Interview">
            <div className="flex gap-3">
              {[
                { val: "online", label: "Online", Icon: Video },
                { val: "onsite", label: "Onsite", Icon: Building2 },
              ].map(({ val, label, Icon }) => (
                <button
                  key={val}
                  onClick={() =>
                    setForm((p) => ({ ...p, type: val as "online" | "onsite" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-[10px] rounded-[10px] border text-[0.85rem] font-medium cursor-pointer transition-all ${
                    form.type === val
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-[#141f19] border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/25 hover:text-[#e8f0ec]"
                  }`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label={
              form.type === "online"
                ? "Link Meeting (Zoom/Gmeet)"
                : "Alamat / Ruangan"
            }>
            <input
              value={form.location}
              onChange={set("location")}
              placeholder={
                form.type === "online"
                  ? "https://meet.google.com/..."
                  : "Ruang Rapat Lt. 3"
              }
              className={inputCls}
            />
          </Field>

          <Field label="Catatan (opsional)">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              placeholder="Catatan untuk interview baru..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent rounded-[10px]">
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-[10px]">
              {loading && <Loader2 size={14} className="animate-spin mr-2" />}
              {loading ? "Menyimpan..." : "Jadwalkan Ulang"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Schedule Modal (buat baru) ────────────────────────────────────────────────
function ScheduleModal({
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string) => (e: AnyInputEvent) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.application_id) return setError("Pilih kandidat terlebih dahulu");
    if (!form.date || !form.time)
      return setError("Tanggal dan jam wajib diisi");
    setLoading(true);
    setError("");
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
        }),
      });
      onDone();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[#141f19] border border-emerald-500/15 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-emerald-500/40 transition-colors";

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="text-[0.72rem] font-semibold text-[#7a9585] mb-[6px] block tracking-[0.06em] uppercase">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0f1612] border border-emerald-500/20 rounded-[20px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-emerald-500/15">
          <div>
            <h2 className="font-syne font-extrabold text-[1.1rem]">
              Jadwalkan Interview
            </h2>
            <p className="text-[#7a9585] text-[0.78rem] mt-[3px]">
              {candidates.length > 0
                ? `${candidates.length} kandidat tersedia`
                : "Semua kandidat sudah terjadwal"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] cursor-pointer transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="px-7 py-6 flex flex-col gap-4">
          <Field label="Kandidat *">
            <select
              value={form.application_id}
              onChange={set("application_id")}
              className={`${inputCls} appearance-none cursor-pointer`}>
              <option value="">Pilih kandidat shortlisted...</option>
              {candidates.map((c) => (
                <option key={c.application_id} value={c.application_id}>
                  {c.candidate_name} — {c.job_title}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal *">
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                min={new Date().toISOString().split("T")[0]}
                className={inputCls}
              />
            </Field>
            <Field label="Jam *">
              <input
                type="time"
                value={form.time}
                onChange={set("time")}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Tipe Interview">
            <div className="flex gap-3">
              {[
                { val: "online", label: "Online", Icon: Video },
                { val: "onsite", label: "Onsite", Icon: Building2 },
              ].map(({ val, label, Icon }) => (
                <button
                  key={val}
                  onClick={() => setForm((p) => ({ ...p, type: val }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-[10px] rounded-[10px] border text-[0.85rem] font-medium cursor-pointer transition-all ${
                    form.type === val
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-[#141f19] border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/25 hover:text-[#e8f0ec]"
                  }`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label={
              form.type === "online"
                ? "Link Meeting (Zoom/Gmeet)"
                : "Alamat / Ruangan"
            }>
            <input
              value={form.location}
              onChange={set("location")}
              placeholder={
                form.type === "online"
                  ? "https://meet.google.com/..."
                  : "Ruang Rapat Lt. 3, Gedung A"
              }
              className={inputCls}
            />
          </Field>

          <Field label="Catatan (opsional)">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              placeholder="Persiapan yang perlu dibawa, topik yang akan dibahas, dll..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent rounded-[10px]">
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || candidates.length === 0}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px] disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin mr-2" />}
              {loading ? "Menyimpan..." : "Jadwalkan Interview"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Interview Card ────────────────────────────────────────────────────────────
function InterviewCard({
  interview,
  token,
  onUpdate,
  index,
}: {
  interview: Interview;
  token: string;
  onUpdate: () => void;
  index: number;
}) {
  const [confirm, setConfirm] = useState<"done" | "cancelled" | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const st = statusConfig[interview.status];
  const color = getColor(index);

  const updateStatus = async (status: "done" | "cancelled") => {
    setConfirmLoading(true);
    try {
      await apiFetch(`/api/interviews/${interview.id}`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            type={confirm}
            candidateName={interview.candidate_name}
            onConfirm={() => updateStatus(confirm)}
            onCancel={() => setConfirm(null)}
            loading={confirmLoading}
          />
        )}
        {showReschedule && (
          <RescheduleModal
            interview={interview}
            token={token}
            onDone={() => {
              setShowReschedule(false);
              onUpdate();
            }}
            onClose={() => setShowReschedule(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`bg-[#0f1612] border rounded-[14px] p-5 transition-all ${
          interview.status === "cancelled"
            ? "border-red-500/10"
            : interview.status === "done"
              ? "border-emerald-500/10"
              : "border-emerald-500/15 hover:border-emerald-500/25"
        }`}>
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center font-extrabold text-[0.82rem] flex-shrink-0"
            style={{ background: `${color}18`, color }}>
            {getInitials(interview.candidate_name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-syne font-bold text-[0.95rem]">
                {interview.candidate_name}
              </span>
              <span
                className="px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold"
                style={{
                  background: st.bg,
                  color: st.color,
                  border: `1px solid ${st.color}30`,
                }}>
                {st.label}
              </span>
              {isToday(interview.scheduled_at) &&
                interview.status === "scheduled" && (
                  <span className="px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                    Hari ini!
                  </span>
                )}
            </div>

            <div className="text-[0.75rem] text-[#7a9585] mb-3">
              {interview.job_title}
            </div>

            <div className="flex flex-wrap gap-3 text-[0.75rem] text-[#7a9585]">
              <span className="flex items-center gap-[5px]">
                <Calendar size={12} /> {getDayLabel(interview.scheduled_at)}
              </span>
              <span className="flex items-center gap-[5px]">
                <Clock size={12} /> {formatTime(interview.scheduled_at)} WIB
              </span>
              <span className="flex items-center gap-[5px]">
                {interview.type === "online" ? (
                  <Video size={12} />
                ) : (
                  <Building2 size={12} />
                )}
                {interview.type === "online" ? "Online" : "Onsite"}
              </span>
              {interview.location && (
                <span className="flex items-center gap-[5px]">
                  <MapPin size={12} />
                  {interview.type === "online" ? (
                    <a
                      href={interview.location}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors no-underline">
                      Buka Link
                    </a>
                  ) : (
                    interview.location
                  )}
                </span>
              )}
            </div>

            {interview.notes && (
              <div className="mt-2 bg-[#141f19] border border-emerald-500/10 rounded-[8px] px-3 py-2 text-[0.75rem] text-[#7a9585]">
                📝 {interview.notes}
              </div>
            )}

            {/* Tombol Jadwalkan Ulang — hanya muncul di cancelled */}
            {interview.status === "cancelled" && (
              <button
                onClick={() => setShowReschedule(true)}
                className="mt-3 flex items-center gap-[6px] px-3 py-[7px] rounded-[8px] bg-cyan-500/[0.08] border border-cyan-500/20 text-cyan-400 text-[0.78rem] font-semibold cursor-pointer hover:bg-cyan-500/15 hover:border-cyan-500/35 transition-all">
                <RefreshCw size={12} /> Jadwalkan Ulang
              </button>
            )}
          </div>

          {/* Action buttons — hanya scheduled */}
          {interview.status === "scheduled" && (
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => setConfirm("done")}
                title="Tandai selesai"
                className="w-8 h-8 rounded-[7px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-all">
                <Check size={13} />
              </button>
              <button
                onClick={() => setConfirm("cancelled")}
                title="Batalkan interview"
                className="w-8 h-8 rounded-[7px] bg-red-500/[0.07] border border-red-500/20 text-red-400 flex items-center justify-center cursor-pointer hover:bg-red-500/15 transition-all">
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InterviewsPage() {
  const { token } = useDashboard();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [shortlisted, setShortlisted] = useState<ShortlistedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "done" | "cancelled"
  >("all");

  const fetchData = async () => {
    if (!token) return;
    try {
      const [ivData, slData] = await Promise.all([
        apiFetch("/api/interviews", token),
        apiFetch("/api/interviews/shortlisted", token),
      ]);
      setInterviews(Array.isArray(ivData) ? ivData : []);
      setShortlisted(Array.isArray(slData) ? slData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const filtered = interviews.filter(
    (iv) => filter === "all" || iv.status === filter,
  );

  const grouped = filtered.reduce(
    (acc, iv) => {
      const key = getDayLabel(iv.scheduled_at);
      if (!acc[key]) acc[key] = [];
      acc[key].push(iv);
      return acc;
    },
    {} as Record<string, Interview[]>,
  );

  const scheduled = interviews.filter((iv) => iv.status === "scheduled").length;
  const done = interviews.filter((iv) => iv.status === "done").length;
  const todayCount = interviews.filter(
    (iv) => isToday(iv.scheduled_at) && iv.status === "scheduled",
  ).length;

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-emerald-400 animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Memuat jadwal interview...
          </span>
        </div>
      </div>
    );

  return (
    <>
      {showModal && (
        <ScheduleModal
          token={token}
          candidates={shortlisted}
          onDone={() => {
            setShowModal(false);
            fetchData();
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      <div>
        <FadeIn>
          <div className="grid grid-cols-4 gap-[14px] mb-6">
            {[
              {
                label: "Total Interview",
                num: interviews.length,
                col: "#10b981",
                bg: "rgba(16,185,129,0.12)",
              },
              {
                label: "Hari Ini",
                num: todayCount,
                col: "#f59e0b",
                bg: "rgba(245,158,11,0.12)",
              },
              {
                label: "Terjadwal",
                num: scheduled,
                col: "#06b6d4",
                bg: "rgba(6,182,212,0.12)",
              },
              {
                label: "Selesai",
                num: done,
                col: "#8b5cf6",
                bg: "rgba(139,92,246,0.12)",
              },
            ].map(({ label, num, col, bg }, i) => (
              <div
                key={i}
                className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 transition-all hover:border-emerald-500/35 hover:-translate-y-[2px]">
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center mb-[14px]"
                  style={{ background: bg, color: col }}>
                  <Calendar size={16} />
                </div>
                <div
                  className="font-extrabold text-[2rem] leading-none mb-1"
                  style={{ color: col }}>
                  {num}
                </div>
                <div className="text-[0.75rem] text-[#7a9585]">{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div>
              <div className="font-bold text-[1rem]">Jadwal Interview</div>
              <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
                {shortlisted.length > 0
                  ? `${shortlisted.length} kandidat tersedia untuk dijadwalkan`
                  : "Tidak ada kandidat yang bisa dijadwalkan saat ini"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-[#0f1612] border border-emerald-500/15 rounded-[10px] p-1">
                {(["all", "scheduled", "done", "cancelled"] as const).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-[6px] rounded-[7px] text-[0.78rem] font-medium cursor-pointer transition-all whitespace-nowrap ${
                        filter === f
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                          : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                      }`}>
                      {f === "all"
                        ? "Semua"
                        : f === "scheduled"
                          ? "Terjadwal"
                          : f === "done"
                            ? "Selesai"
                            : "Dibatalkan"}
                    </button>
                  ),
                )}
              </div>
              <Button
                onClick={() => setShowModal(true)}
                disabled={shortlisted.length === 0}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.85rem] px-4 py-[9px] rounded-[9px] disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus size={14} /> Jadwalkan Interview
              </Button>
            </div>
          </div>
        </FadeIn>

        {shortlisted.length > 0 && filter === "all" && (
          <FadeIn delay={0.07}>
            <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-[14px] p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[0.82rem] font-semibold text-amber-400">
                  {shortlisted.length} kandidat siap dijadwalkan
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {shortlisted.map((c, i) => (
                  <div
                    key={c.application_id}
                    className="flex items-center gap-2 bg-[#0f1612] border border-emerald-500/15 rounded-[8px] px-3 py-[7px]">
                    <div
                      className="w-6 h-6 rounded-[5px] flex items-center justify-center font-extrabold text-[0.65rem] flex-shrink-0"
                      style={{
                        background: `${getColor(i)}18`,
                        color: getColor(i),
                      }}>
                      {getInitials(c.candidate_name)}
                    </div>
                    <div>
                      <div className="text-[0.78rem] font-semibold">
                        {c.candidate_name}
                      </div>
                      <div className="text-[0.65rem] text-[#7a9585]">
                        {c.job_title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {filtered.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-20 text-[#7a9585]">
              <div className="text-[3rem] mb-3 opacity-20">📅</div>
              <div className="font-syne font-bold text-[1rem] mb-2">
                {filter === "all"
                  ? "Belum ada jadwal interview"
                  : `Tidak ada interview ${filter === "scheduled" ? "terjadwal" : filter === "done" ? "selesai" : "dibatalkan"}`}
              </div>
              {filter === "all" && shortlisted.length > 0 && (
                <p className="text-[0.82rem]">
                  Klik tombol di atas untuk menjadwalkan interview.
                </p>
              )}
            </div>
          </FadeIn>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(grouped).map(([dateLabel, items]) => (
              <FadeIn key={dateLabel} delay={0.1}>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`px-3 py-[5px] rounded-[7px] text-[0.75rem] font-bold ${
                        dateLabel === "Hari Ini"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                          : dateLabel === "Besok"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                            : "bg-white/[0.04] text-[#7a9585] border border-white/[0.08]"
                      }`}>
                      {dateLabel}
                    </div>
                    <div className="flex-1 h-px bg-emerald-500/10" />
                    <span className="text-[0.72rem] text-[#7a9585]">
                      {items.length} interview
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <AnimatePresence>
                      {items.map((iv, i) => (
                        <InterviewCard
                          key={iv.id}
                          interview={iv}
                          token={token}
                          onUpdate={fetchData}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
