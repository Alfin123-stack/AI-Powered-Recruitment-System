import { useState } from "react";
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
      setError(err instanceof Error ? err.message : "An error occurred");
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
