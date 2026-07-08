import { useState } from "react";
import { toast } from "sonner";
import { AnyInputEvent } from "@/types/hr/interviews";
import { apiFetch } from "@/lib/api";

export function useInterviewSchedule({
  token,
  onDone,
}: {
  token: string;
  onDone: () => void;
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
      toast.error("Lengkapi kandidat, tanggal, dan jam terlebih dahulu");
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

      // TAMBAHAN: sekalian ubah status candidate jadi "interview" begitu
      // interview berhasil dijadwalkan. Fire-and-forget lewat try/catch
      // terpisah — kalau ini gagal, interview-nya sendiri sudah kepakai
      // (POST di atas sukses), jadi tidak boleh bikin seluruh submit
      // dianggap gagal / toast error ke HR. Cukup dicatat di console.
      try {
        await apiFetch(
          `/api/applications/${form.application_id}/status`,
          token,
          {
            method: "PUT",
            body: JSON.stringify({ status: "interview" }),
          },
        );
      } catch (statusErr) {
        console.error(
          "[useInterviewSchedule] gagal update status ke 'interview':",
          statusErr,
        );
      }

      toast.success("Interview berhasil dijadwalkan");
      onDone();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrors({ submit: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, set, setForm, handleSubmit };
}