import { useState } from "react";
import { toast } from "sonner";
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
      toast.error("Tanggal dan jam wajib diisi");
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
      toast.success("Interview berhasil dijadwalkan ulang");
      onDone();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrors({ submit: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, set, setType, handleSubmit };
}