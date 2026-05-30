// @/components/hr/jobs/JobFormModal.tsx
// CSR — full interaktif: state form, API call, keyboard handlers
// Lazy-loaded dari JobsPageClient via dynamic import

"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Pencil,
  Loader2,
  AlertCircle,
  X,
  CalendarDays,
  Layers,
  Gift,
  FileText,
  ClipboardList,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  apiFetch,
  type Job,
  type JobForm,
} from "@/app/(role)/dashboard/hr/_components/shared";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-[#080f0b] border border-emerald-500/15 rounded-[10px] px-3 py-[10px] text-[0.85rem] text-[#e8f0ec] placeholder:text-[#2d4a38] focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/8 transition-all";

function parseReqToArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/\\n|\n/)
    .map((s) => s.trim().replace(/^[-•*–]\s*/, ""))
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// TAG INPUT
// ─────────────────────────────────────────────────────────────────────────────
function TagInput({
  value,
  onChange,
  placeholder,
  chipColor = "emerald",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  chipColor?: "emerald" | "green" | "blue";
}) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.replace(",", "").trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && value.length)
      onChange(value.slice(0, -1));
  };

  const chipCls =
    chipColor === "green"
      ? "bg-green-500/10 text-green-400 border border-green-500/20"
      : chipColor === "blue"
        ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

  return (
    <div
      className="flex flex-wrap gap-[6px] bg-[#080f0b] border border-emerald-500/15 rounded-[10px] px-3 py-2 cursor-text focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/8 transition-all min-h-[42px]"
      onClick={(e) =>
        (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()
      }>
      {value.map((tag) => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 pl-[9px] pr-[6px] py-[3px] rounded-[6px] text-[11px] font-medium ${chipCls}`}>
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="flex items-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label={`hapus ${tag}`}>
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input.trim() && addTag(input)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[160px] bg-transparent outline-none text-[0.83rem] text-[#e8f0ec] placeholder:text-[#2d4a38]"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD & SECTION — form building blocks
// ─────────────────────────────────────────────────────────────────────────────
function Field({
  label,
  children,
  error,
  hint,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="flex items-center gap-[6px] text-[0.7rem] font-semibold text-[#5a8070] tracking-[0.08em] uppercase">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
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
// JOB FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────
type FormState = Omit<JobForm, "skills" | "benefits" | "requirements">;

interface JobFormModalProps {
  token: string;
  editJob: Job | null;
  onDone: () => void;
  onClose: () => void;
}

export function JobFormModal({
  token,
  editJob,
  onDone,
  onClose,
}: JobFormModalProps) {
  const [form, setForm] = useState<FormState>(() =>
    editJob
      ? {
          title: editJob.title,
          description: editJob.description || "",
          salary: editJob.salary || "",
          location: editJob.location || "",
          type: editJob.type || "Full-time",
          deadline: editJob.deadline?.split("T")[0] || "",
        }
      : {
          title: "",
          description: "",
          salary: "",
          location: "",
          type: "Full-time",
          deadline: "",
        },
  );
  const [requirements, setRequirements] = useState<string[]>(
    parseReqToArray(editJob?.requirements),
  );
  const [skills, setSkills] = useState<string[]>(editJob?.skills ?? []);
  const [benefits, setBenefits] = useState<string[]>(editJob?.benefits ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Judul lowongan wajib diisi");
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        requirements: requirements.join("\n"),
        skills,
        benefits,
        deadline: form.deadline || null,
      };
      if (editJob) {
        await apiFetch(`/api/jobs/${editJob.id}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/jobs/create", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      onDone();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[600px] max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent flex-shrink-0" />

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              {editJob ? <Pencil size={15} /> : <Sparkles size={15} />}
            </div>
            <div>
              <h2 className="font-bold text-[0.95rem] text-[#e8f0ec] leading-none">
                {editJob ? "Edit Lowongan" : "Buat Lowongan Baru"}
              </h2>
              <p className="text-[0.72rem] text-[#4d7060] mt-[3px]">
                {editJob
                  ? "Perbarui detail lowongan"
                  : "Isi detail untuk mempublikasikan"}
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

        {/* ── Modal Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <Section label="Informasi Utama" icon={<Briefcase size={12} />} />

          <Field label="Judul Lowongan" icon={<Briefcase size={10} />}>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="cth. Frontend Developer, Data Analyst..."
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Lokasi" icon={<MapPin size={10} />}>
              <input
                value={form.location}
                onChange={set("location")}
                placeholder="Jakarta / Remote"
                className={inputCls}
              />
            </Field>
            <Field label="Tipe Pekerjaan" icon={<Layers size={10} />}>
              <div className="relative">
                <select
                  title="Pilih Tipe Pekerjaan"
                  value={form.type}
                  onChange={set("type")}
                  className={`${inputCls} appearance-none cursor-pointer pr-8`}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d7060] pointer-events-none"
                />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Rentang Gaji" icon={<FileText size={10} />}>
              <input
                value={form.salary}
                onChange={set("salary")}
                placeholder="cth. Rp 8–15 jt/bln"
                className={inputCls}
              />
            </Field>
            <Field label="Deadline" icon={<CalendarDays size={10} />}>
              <input
                title="date"
                type="date"
                value={form.deadline}
                onChange={set("deadline")}
                className={inputCls}
              />
            </Field>
          </div>

          <Section
            label="Deskripsi & Kualifikasi"
            icon={<FileText size={12} />}
          />

          <Field
            label="Deskripsi Pekerjaan"
            icon={<FileText size={10} />}
            hint="Jelaskan tanggung jawab dan gambaran posisi">
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Jelaskan tanggung jawab dan gambaran posisi..."
              className={`${inputCls} resize-y min-h-[90px]`}
            />
          </Field>

          <Field
            label="Kualifikasi & Persyaratan"
            icon={<ClipboardList size={10} />}
            hint="Tekan Enter untuk menambah setiap kualifikasi">
            <TagInput
              value={requirements}
              onChange={setRequirements}
              placeholder="cth. Minimal S1, Pengalaman 2+ tahun React..."
              chipColor="blue"
            />
          </Field>

          <Section label="Skills & Benefit" icon={<Gift size={12} />} />

          <Field
            label="Skills"
            icon={<Layers size={10} />}
            hint="Tekan Enter atau koma untuk menambah">
            <TagInput
              value={skills}
              onChange={setSkills}
              placeholder="cth. React, TypeScript, Node.js..."
              chipColor="emerald"
            />
          </Field>

          <Field
            label="Benefit & Fasilitas"
            icon={<Gift size={10} />}
            hint="Tekan Enter atau koma untuk menambah">
            <TagInput
              value={benefits}
              onChange={setBenefits}
              placeholder="cth. Remote-friendly, BPJS, Laptop..."
              chipColor="green"
            />
          </Field>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-[0.8rem] bg-red-500/8 border border-red-500/20 rounded-[9px] px-3 py-2">
              <AlertCircle size={13} className="flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex gap-2 px-6 py-4 border-t border-emerald-500/10 bg-[#080f0b] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-[10px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:border-emerald-500/30 hover:text-[#e8f0ec] transition-all cursor-pointer">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-[10px] rounded-[10px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.82rem] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Menyimpan...
              </>
            ) : editJob ? (
              <>
                <Pencil size={14} />
                Simpan Perubahan
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Publikasikan Lowongan
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
