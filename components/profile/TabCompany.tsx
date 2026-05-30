"use client";

// components/profile/TabCompany.tsx
// ─────────────────────────────────────────────
// RENDERING STRATEGY: CSR
//
// Form profil perusahaan untuk HR.
//
// initialCompany sudah di-fetch di server (page.tsx)
// dan di-pass sebagai props — tidak ada fetch di client.
// Update tetap di client karena butuh token dari
// browser session (Authorization header).
//
// API: PUT /api/companies/update (backend Express/Flask)
// ─────────────────────────────────────────────

import { useState } from "react";
import { Field, SaveBtn, ErrorBanner, inputCls } from "./ui";
import type { ToastType } from "./Toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TabCompanyProps {
  token: string;
  initialCompany: {
    name: string;
    description: string;
    company_size: string;
  } | null;
  addToast: (type: ToastType, message: string) => void;
}

export function TabCompany({
  token,
  initialCompany,
  addToast,
}: TabCompanyProps) {
  // Initial value dari server props — tanpa fetch di client
  const [form, setForm] = useState({
    name: initialCompany?.name || "",
    description: initialCompany?.description || "",
    company_size: initialCompany?.company_size || "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Nama perusahaan wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/companies/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      addToast("success", "Profil perusahaan berhasil disimpan!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan profil perusahaan.";
      setError(message);
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
          Profil Perusahaan
        </h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Informasi perusahaan yang tampil ke kandidat
        </p>
      </div>

      <ErrorBanner msg={error} />

      <div className="flex flex-col gap-4 mb-6">
        <Field label="Nama Perusahaan *">
          <input
            value={form.name}
            onChange={set("name")}
            placeholder="PT Teknologi Indonesia"
            className={inputCls}
          />
        </Field>

        <Field label="Ukuran Perusahaan">
          <select
            title="select"
            value={form.company_size}
            onChange={set("company_size")}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="">Pilih ukuran...</option>
            <option value="1-10 karyawan">1–10 karyawan</option>
            <option value="11-50 karyawan">11–50 karyawan</option>
            <option value="51-200 karyawan">51–200 karyawan</option>
            <option value="201-500 karyawan">201–500 karyawan</option>
            <option value="500+ karyawan">500+ karyawan</option>
          </select>
        </Field>

        <Field label="Deskripsi Singkat">
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={4}
            placeholder="Ceritakan tentang perusahaan kamu..."
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      <SaveBtn loading={loading} saved={saved} onClick={handleSave} />
    </div>
  );
}
