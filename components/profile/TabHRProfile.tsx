"use client";



import { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Field, SaveBtn, inputCls } from "./ui";
import type { ToastType } from "./Toast";

type UserMetadata = {
  full_name?: string;
  [key: string]: string | undefined;
};

interface TabHRProfileProps {
  user: {
    email: string;
    user_metadata: UserMetadata;
  };
  addToast: (type: ToastType, message: string) => void;
}

export function TabHRProfile({ user, addToast }: TabHRProfileProps) {
  const [fullName, setFullName] = useState(user.user_metadata?.full_name ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;
      setSaved(true);
      addToast("success", "Profil akun berhasil disimpan!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan profil.";
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">Profil Akun</h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Informasi akun HR kamu
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <Field label="Nama Lengkap">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama lengkap kamu"
            title="Masukkan nama lengkap kamu"
            aria-label="Nama lengkap"
            className={inputCls}
          />
        </Field>

        <Field label="Email" hint="Email tidak dapat diubah.">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <Mail size={14} />
            </span>
            <input
              value={user.email}
              disabled
              title="Email tidak dapat diubah"
              aria-label="Alamat email (tidak dapat diubah)"
              className={`${inputCls} pl-9 opacity-50 cursor-not-allowed`}
            />
          </div>
        </Field>
      </div>

      <SaveBtn loading={loading} saved={saved} onClick={handleSave} />
    </div>
  );
}
