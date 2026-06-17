import { useState } from "react";
import { Interview, AnyInputEvent, InterviewType } from "@/types/hr/interviews";
import { apiFetch } from "@/lib/api";

function padTwo(n: number) {
  return String(n).padStart(2, "0");
}

export function useInterviewReschedule({
  interview,
  token,
  onDone,
}: {
  interview: Interview;
  token: string;
  onDone: () => void;
}) {
  const existing = new Date(interview.scheduled_at);

  const [form, setForm] = useState({
    date: `${existing.getFullYear()}-${padTwo(existing.getMonth() + 1)}-${padTwo(existing.getDate())}`,
    time: `${padTwo(existing.getHours())}:${padTwo(existing.getMinutes())}`,
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

  const setType = (val: InterviewType) => setForm((p) => ({ ...p, type: val }));

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
      setErrors({
        submit: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, set, setType, handleSubmit };
}
