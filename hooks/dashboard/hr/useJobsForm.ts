import { useState } from "react";
import { toast } from "sonner";
import { Job } from "@/types/hr/dashboard";
import { apiFetch } from "@/lib/api";
import type { FormState } from "@/components/hr/jobs/JobsFormBody";

function parseReqToArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/\\n|\n/)
    .map((s) => s.trim().replace(/^[-•*–]\s*/, ""))
    .filter(Boolean);
}

export function useJobsForm({
  token,
  editJob,
  onDone,
}: {
  token: string;
  editJob: Job | null;
  onDone: () => void;
}) {
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
    if (!form.title.trim()) {
      setError("Job title is required");
      toast.error("Job title is required");
      return;
    }
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
        toast.success(`Job "${form.title}" berhasil diperbarui`);
      } else {
        await apiFetch("/api/jobs/create", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success(`Job "${form.title}" berhasil dibuat`);
      }
      onDone();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    requirements,
    setRequirements,
    skills,
    setSkills,
    benefits,
    setBenefits,
    loading,
    error,
    handleSubmit,
  };
}