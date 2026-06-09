// @/components/hr/jobs/JobsFormModal.tsx
// CSR — fully interactive: form state, API calls, keyboard handlers
// Lazy-loaded from JobsPageClient via dynamic import

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  apiFetch,
  type Job,
} from "@/app/(role)/dashboard/hr/_components/shared";
import { JobsFormHeader } from "./JobsFormHeader";
import { JobsFormBody, type FormState } from "./JobsFormBody";
import { JobsFormFooter } from "./JobsFormFooter";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function parseReqToArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/\\n|\n/)
    .map((s) => s.trim().replace(/^[-•*–]\s*/, ""))
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface JobsFormModalProps {
  token: string;
  editJob: Job | null;
  onDone: () => void;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function JobsFormModal({
  token,
  editJob,
  onDone,
  onClose,
}: JobsFormModalProps) {
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

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Job title is required");
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
        setError("An error occurred");
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

        <JobsFormHeader isEdit={!!editJob} onClose={onClose} />

        <JobsFormBody
          form={form}
          setForm={setForm}
          requirements={requirements}
          setRequirements={setRequirements}
          skills={skills}
          setSkills={setSkills}
          benefits={benefits}
          setBenefits={setBenefits}
          error={error}
        />

        <JobsFormFooter
          isEdit={!!editJob}
          loading={loading}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
}
