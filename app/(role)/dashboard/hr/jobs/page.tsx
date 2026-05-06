"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Briefcase,
  MapPin,
  Clock,
  Pencil,
  Trash2,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  apiFetch,
  getColor,
  inputCls,
  Job,
  JobForm,
  EMPTY_FORM,
} from "../_components/shared";
import { useDashboard } from "@/app/(role)/layout";


// ── Job Form Modal ────────────────────────────────────────────────────────────
function JobFormModal({
  token,
  editJob,
  onDone,
  onClose,
}: {
  token: string;
  editJob: Job | null;
  onDone: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<JobForm>(
    editJob
      ? {
          title: editJob.title,
          description: editJob.description || "",
          requirements: editJob.requirements || "",
          salary: editJob.salary || "",
          location: editJob.location || "",
          type: editJob.type || "Full-time",
          skills: (editJob.skills || []).join(", "),
          benefits: (editJob.benefits || []).join(", "),
          deadline: editJob.deadline?.split("T")[0] || "",
        }
      : EMPTY_FORM,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set =
    (key: keyof JobForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Judul lowongan wajib diisi");
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: form.benefits
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        className="bg-[#0f1612] border border-emerald-500/20 rounded-[20px] w-full max-w-[640px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-emerald-500/15">
          <div>
            <h2 className="font-syne font-extrabold text-[1.2rem]">
              {editJob ? "Edit Lowongan" : "Buat Lowongan Baru"}
            </h2>
            <p className="text-[#7a9585] text-[0.78rem] mt-1">
              {editJob
                ? "Perbarui detail lowongan pekerjaan"
                : "Isi detail lowongan yang ingin dipublikasikan"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-[8px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <div className="px-8 py-6 flex flex-col gap-4">
          <Field label="Judul Lowongan *">
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="Frontend Developer"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Lokasi">
              <input
                value={form.location}
                onChange={set("location")}
                placeholder="Jakarta / Remote"
                className={inputCls}
              />
            </Field>
            <Field label="Tipe Pekerjaan">
              <select
                value={form.type}
                onChange={set("type")}
                className={`${inputCls} appearance-none cursor-pointer`}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Gaji">
              <input
                value={form.salary}
                onChange={set("salary")}
                placeholder="Rp 8–15 jt/bln"
                className={inputCls}
              />
            </Field>
            <Field label="Deadline">
              <input
                type="date"
                value={form.deadline}
                onChange={set("deadline")}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Deskripsi Pekerjaan">
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={4}
              placeholder="Deskripsikan tanggung jawab dan posisi ini..."
              className={`${inputCls} resize-y min-h-[100px]`}
            />
          </Field>
          <Field label="Kualifikasi & Persyaratan">
            <textarea
              value={form.requirements}
              onChange={set("requirements")}
              rows={4}
              placeholder="Tulis setiap persyaratan di baris baru..."
              className={`${inputCls} resize-y min-h-[100px]`}
            />
          </Field>
          <Field label="Skills (pisahkan dengan koma)">
            <input
              value={form.skills}
              onChange={set("skills")}
              placeholder="React, TypeScript, Next.js"
              className={inputCls}
            />
          </Field>
          <Field label="Benefit (pisahkan dengan koma)">
            <input
              value={form.benefits}
              onChange={set("benefits")}
              placeholder="Remote-friendly, Laptop disediakan"
              className={inputCls}
            />
          </Field>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent rounded-[10px] py-[11px]">
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[10px] py-[11px]">
              {loading && <Loader2 size={15} className="animate-spin mr-2" />}
              {loading
                ? "Menyimpan..."
                : editJob
                  ? "Simpan Perubahan"
                  : "Publikasikan Lowongan"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const { token } = useDashboard();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    if (!token) return;
    try {
      const data = await apiFetch("/api/jobs/my", token);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tutup lowongan ini?")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/api/jobs/${id}`, token, { method: "DELETE" });
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, is_active: false } : j)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={24} className="text-emerald-400 animate-spin" />
        <span className="text-[#7a9585] text-[0.85rem] mt-2">
          Memuat Lowongan...
        </span>
      </div>
    );

  return (
    <>
      {showModal && (
        <JobFormModal
          token={token}
          editJob={editJob}
          onDone={() => {
            setShowModal(false);
            setEditJob(null);
            fetchJobs();
          }}
          onClose={() => {
            setShowModal(false);
            setEditJob(null);
          }}
        />
      )}

      <FadeIn>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-bold text-[1rem]">Kelola Lowongan</div>
            <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
              {jobs.length} lowongan · {jobs.filter((j) => j.is_active).length}{" "}
              aktif
            </div>
          </div>
          <Button
            onClick={() => {
              setEditJob(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-[7px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.85rem] px-[18px] py-[9px] rounded-[9px]">
            <Plus size={14} /> Buat Lowongan
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-[#0f1612] border border-dashed border-emerald-500/20 rounded-[14px] py-16 text-center">
            <div className="text-[2.5rem] mb-3 opacity-30">📋</div>
            <div className="font-syne font-bold text-[1rem] mb-2">
              Belum ada lowongan
            </div>
            <p className="text-[#7a9585] text-[0.82rem] mb-5">
              Buat lowongan pertama kamu untuk mulai menerima pelamar.
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-[10px] rounded-[9px] text-[0.85rem]">
              <Plus size={14} /> Buat Lowongan Pertama
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job, i) => {
              const color = getColor(i);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`bg-[#0f1612] border rounded-[14px] p-5 flex items-start gap-4 transition-all
                    ${job.is_active ? "border-emerald-500/15 hover:border-emerald-500/30" : "border-white/[0.05] opacity-50"}`}>
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                    style={{ background: `${color}18`, color }}>
                    <Briefcase size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-syne font-bold text-[0.95rem]">
                        {job.title}
                      </span>
                      <span
                        className={`px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold ${job.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/[0.04] text-[#7a9585] border border-white/[0.08]"}`}>
                        {job.is_active ? "Aktif" : "Ditutup"}
                      </span>
                      <span
                        className="px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold"
                        style={{
                          background: `${color}15`,
                          color,
                          border: `1px solid ${color}30`,
                        }}>
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-[12px] text-[0.75rem] text-[#7a9585]">
                      {job.location && (
                        <span className="flex items-center gap-[4px]">
                          <MapPin size={11} /> {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-[4px]">
                          💰 {job.salary}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-[4px]">
                          <Clock size={11} /> Deadline:{" "}
                          {new Date(job.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    {(job.skills || []).length > 0 && (
                      <div className="flex flex-wrap gap-[5px] mt-2">
                        {job.skills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="bg-white/[0.04] border border-white/[0.07] text-[#e8f0ec] px-[7px] py-[2px] rounded-[4px] text-[0.68rem] font-mono">
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[#7a9585] text-[0.68rem] py-[2px]">
                            +{job.skills.length - 4} lagi
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-[6px] flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditJob(job);
                        setShowModal(true);
                      }}
                      className="w-8 h-8 rounded-[7px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] flex items-center justify-center cursor-pointer hover:border-emerald-500/35 hover:text-emerald-400 transition-all">
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id || !job.is_active}
                      className="w-8 h-8 rounded-[7px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] flex items-center justify-center cursor-pointer hover:border-red-500/30 hover:text-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      {deletingId === job.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </FadeIn>
    </>
  );
}
