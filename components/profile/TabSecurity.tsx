"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SaveBtn, PasswordInput } from "./ui";
import type { ToastType } from "./Toast";

interface TabSecurityProps {
  addToast: (type: ToastType, message: string) => void;
}

export function TabSecurity({ addToast }: TabSecurityProps) {
  const [form, setForm] = useState({ new: "", confirm: "" });
  const [errors, setErrors] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clear error on typing
  const handleChange = (field: "new" | "confirm", value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = (): boolean => {
    const errs = { new: "", confirm: "" };
    let valid = true;

    if (!form.new) {
      errs.new = "Password baru wajib diisi";
      valid = false;
    } else if (form.new.length < 6) {
      errs.new = "Password minimal 6 karakter";
      valid = false;
    }

    if (!form.confirm) {
      errs.confirm = "Konfirmasi password wajib diisi";
      valid = false;
    } else if (form.confirm !== form.new) {
      errs.confirm = "Password tidak cocok";
      valid = false;
    }

    setErrors(errs);
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: form.new,
      });
      if (error) throw error;
      setSaved(true);
      setForm({ new: "", confirm: "" });
      setErrors({ new: "", confirm: "" });
      addToast("success", "Password berhasil diubah!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setErrors((p) => ({
        ...p,
        new: err.message || "Gagal mengubah password.",
      }));
      addToast("error", err.message || "Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
          Keamanan Akun
        </h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Kelola password dan keamanan akunmu
        </p>
      </div>

      <div className="rounded-[12px] border border-emerald-500/10 p-5 mb-5 bg-emerald-500/[0.02]">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={15} className="text-emerald-400" />
          <h3 className="text-[0.9rem] font-semibold text-[#c5d8cc]">
            Ubah Password
          </h3>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <PasswordInput
            label="Password Baru"
            value={form.new}
            onChange={(v) => handleChange("new", v)}
            placeholder="Minimal 6 karakter"
            error={errors.new}
          />
          <PasswordInput
            label="Konfirmasi Password Baru"
            value={form.confirm}
            onChange={(v) => handleChange("confirm", v)}
            placeholder="Ulangi password baru"
            error={errors.confirm}
          />
        </div>

        <div className="flex justify-end">
          <SaveBtn
            loading={loading}
            saved={saved}
            onClick={handleSave}
            label="Ubah Password"
          />
        </div>
      </div>
    </div>
  );
}
