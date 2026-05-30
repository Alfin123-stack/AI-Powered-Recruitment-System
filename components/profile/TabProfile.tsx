"use client";

// components/profile/TabProfile.tsx
// ─────────────────────────────────────────────
// RENDERING STRATEGY: CSR
//
// Kenapa CSR?
// - Form state (profileForm) berubah setiap user ketik
// - Event handlers: onChange, onSubmit
// - supabase.auth.updateUser() hanya bisa di client
//   (perlu browser session, bukan server session)
//
// Data awal (full_name, phone, dll) sudah ada di
// user.user_metadata yang di-pass dari server — tidak
// perlu fetch lagi di client.
// ─────────────────────────────────────────────

import { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Field, SaveBtn, ErrorBanner, inputCls } from "./ui";
import type { ToastType } from "./Toast";

type UserMetadata = {
  full_name?: string;
  phone?: string;
  location?: string;
  job_title?: string;
  bio?: string;
  [key: string]: string | undefined;
};

type ProfileForm = {
  full_name: string;
  phone: string;
  location: string;
  job_title: string;
  bio: string;
};

interface TabProfileProps {
  user: {
    id: string;
    email: string;
    user_metadata: UserMetadata;
  };
  token: string;
  addToast: (type: ToastType, message: string) => void;
}

export function TabProfile({ user, token, addToast }: TabProfileProps) {
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    full_name: user.user_metadata?.full_name ?? "",
    phone: user.user_metadata?.phone ?? "",
    location: user.user_metadata?.location ?? "",
    job_title: user.user_metadata?.job_title ?? "",
    bio: user.user_metadata?.bio ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { ...profileForm },
      });
      if (updateError) throw updateError;
      setSaved(true);
      addToast("success", "Profil berhasil disimpan!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan profil.";
      setError(message);
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const set =
    (key: keyof ProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setProfileForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
          Informasi Profil
        </h2>
        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
          Update data pribadi dan informasi profesionalmu
        </p>
      </div>

      <ErrorBanner msg={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Field label="Nama Lengkap">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <User size={14} />
            </span>
            <input
              value={profileForm.full_name}
              onChange={set("full_name")}
              placeholder="Nama lengkap kamu"
              title="Masukkan nama lengkap kamu"
              aria-label="Nama lengkap"
              className={`${inputCls} pl-9`}
            />
          </div>
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

        <Field label="Nomor HP">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <Phone size={14} />
            </span>
            <input
              value={profileForm.phone}
              onChange={set("phone")}
              placeholder="+62 812 3456 7890"
              title="Masukkan nomor HP kamu"
              aria-label="Nomor HP"
              className={`${inputCls} pl-9`}
            />
          </div>
        </Field>

        <Field label="Lokasi">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
              <MapPin size={14} />
            </span>
            <input
              value={profileForm.location}
              onChange={set("location")}
              placeholder="Jakarta, Indonesia"
              title="Masukkan lokasi kamu"
              aria-label="Lokasi"
              className={`${inputCls} pl-9`}
            />
          </div>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Posisi / Jabatan">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
                <Briefcase size={14} />
              </span>
              <input
                value={profileForm.job_title}
                onChange={set("job_title")}
                placeholder="Frontend Developer"
                title="Masukkan posisi atau jabatan kamu"
                aria-label="Posisi atau jabatan"
                className={`${inputCls} pl-9`}
              />
            </div>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Bio">
            <textarea
              value={profileForm.bio}
              onChange={set("bio")}
              rows={4}
              placeholder="Ceritakan sedikit tentang dirimu..."
              title="Masukkan bio singkat tentang dirimu"
              aria-label="Bio"
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveBtn loading={loading} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}
