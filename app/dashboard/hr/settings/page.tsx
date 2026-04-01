"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  User,
  Building2,
  Bell,
  Shield,
  LogOut,
  Check,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "../layout";
import { apiFetch } from "../_components/shared";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

const inputCls =
  "w-full bg-[#141f19] border border-emerald-500/15 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-emerald-500/40 transition-colors";

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-6 mb-4">
      <div className="flex items-center gap-[8px] mb-5">
        <div className="w-7 h-7 rounded-[7px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Icon size={14} />
        </div>
        <span className="font-bold text-[0.9rem]">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-[0.72rem] font-semibold text-[#7a9585] mb-[6px] block tracking-[0.06em] uppercase">
        {label}
      </label>
      {children}
      {hint && <p className="text-[0.7rem] text-[#7a9585] mt-[5px]">{hint}</p>}
    </div>
  );
}

function SaveButton({
  loading,
  saved,
  onClick,
}: {
  loading: boolean;
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={`px-6 py-[10px] rounded-[10px] font-bold text-[0.88rem] transition-all
        ${saved ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"}`}>
      {loading ? (
        <Loader2 size={15} className="animate-spin mr-2" />
      ) : saved ? (
        <Check size={15} className="mr-2" />
      ) : null}
      {loading ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}
    </Button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, token, company, setCompany } = useDashboard();

  // Profile
  const [profileForm, setProfileForm] = useState({
    full_name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Company
  const [companyForm, setCompanyForm] = useState({
    name: company?.name || "",
    description: company?.description || "",
    company_size: company?.company_size || "",
  });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companySaved, setCompanySaved] = useState(false);
  const [companyError, setCompanyError] = useState("");

  // Password
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Notif preferences (local only — bisa disimpan ke DB kalau butuh)
  const [notifPref, setNotifPref] = useState({
    new_application: true,
    interview_reminder: true,
    shortlisted: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setProfileLoading(true);
    try {
      await supabase.auth.updateUser({
        data: { full_name: profileForm.full_name },
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const saveCompany = async () => {
    if (!companyForm.name.trim())
      return setCompanyError("Nama perusahaan wajib diisi");
    setCompanyLoading(true);
    setCompanyError("");
    try {
      const data = await apiFetch("/api/companies/update", token, {
        method: "PUT",
        body: JSON.stringify(companyForm),
      });
      setCompany(data);
      setCompanySaved(true);
      setTimeout(() => setCompanySaved(false), 2500);
    } catch (err: any) {
      setCompanyError(err.message);
    } finally {
      setCompanyLoading(false);
    }
  };

  const savePassword = async () => {
    setPasswordError("");
    if (!passwordForm.new) return setPasswordError("Password baru wajib diisi");
    if (passwordForm.new.length < 6)
      return setPasswordError("Password minimal 6 karakter");
    if (passwordForm.new !== passwordForm.confirm)
      return setPasswordError("Konfirmasi password tidak cocok");

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new,
      });
      if (error) throw new Error(error.message);
      setPasswordSaved(true);
      setPasswordForm({ current: "", new: "", confirm: "" });
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const saveNotif = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0
        ${checked ? "bg-emerald-500" : "bg-white/10"}`}>
      <div
        className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200
        ${checked ? "left-[22px]" : "left-[2px]"}`}
      />
    </button>
  );

  return (
    <div className="max-w-[640px] flex-col justify-center align-center w-full mx-auto">
      {/* Profil */}
      <FadeIn>
        <SectionCard title="Profil Akun" icon={User}>
          <div className="flex flex-col gap-4 mb-5">
            <Field label="Nama Lengkap">
              <input
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, full_name: e.target.value }))
                }
                placeholder="Nama lengkap kamu"
                className={inputCls}
              />
            </Field>
            <Field label="Email" hint="Email tidak dapat diubah.">
              <input
                value={profileForm.email}
                disabled
                className={`${inputCls} opacity-50 cursor-not-allowed`}
              />
            </Field>
          </div>
          <SaveButton
            loading={profileLoading}
            saved={profileSaved}
            onClick={saveProfile}
          />
        </SectionCard>
      </FadeIn>

      {/* Perusahaan */}
      <FadeIn delay={0.05}>
        <SectionCard title="Profil Perusahaan" icon={Building2}>
          <div className="flex flex-col gap-4 mb-5">
            <Field label="Nama Perusahaan *">
              <input
                value={companyForm.name}
                onChange={(e) =>
                  setCompanyForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="PT Teknologi Indonesia"
                className={inputCls}
              />
            </Field>
            <Field label="Ukuran Perusahaan">
              <select
                value={companyForm.company_size}
                onChange={(e) =>
                  setCompanyForm((p) => ({
                    ...p,
                    company_size: e.target.value,
                  }))
                }
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
                value={companyForm.description}
                onChange={(e) =>
                  setCompanyForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                placeholder="Ceritakan tentang perusahaan kamu..."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
          {companyError && (
            <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2 mb-4">
              <AlertCircle size={13} /> {companyError}
            </div>
          )}
          <SaveButton
            loading={companyLoading}
            saved={companySaved}
            onClick={saveCompany}
          />
        </SectionCard>
      </FadeIn>

      {/* Password */}
      <FadeIn delay={0.08}>
        <SectionCard title="Keamanan" icon={Shield}>
          <div className="flex flex-col gap-4 mb-5">
            {[
              {
                key: "new",
                label: "Password Baru",
                placeholder: "Minimal 6 karakter",
              },
              {
                key: "confirm",
                label: "Konfirmasi Password Baru",
                placeholder: "Ulangi password baru",
              },
            ].map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <div className="relative">
                  <input
                    type={
                      showPass[key as keyof typeof showPass]
                        ? "text"
                        : "password"
                    }
                    value={passwordForm[key as keyof typeof passwordForm]}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    className={`${inputCls} pr-11`}
                  />
                  <button
                    onClick={() =>
                      setShowPass((p) => ({
                        ...p,
                        [key]: !p[key as keyof typeof p],
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer">
                    {showPass[key as keyof typeof showPass] ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </Field>
            ))}
          </div>
          {passwordError && (
            <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2 mb-4">
              <AlertCircle size={13} /> {passwordError}
            </div>
          )}
          <SaveButton
            loading={passwordLoading}
            saved={passwordSaved}
            onClick={savePassword}
          />
        </SectionCard>
      </FadeIn>

      {/* Notifikasi */}
      <FadeIn delay={0.1}>
        <SectionCard title="Preferensi Notifikasi" icon={Bell}>
          <div className="flex flex-col gap-0 mb-5">
            {[
              {
                key: "new_application",
                label: "Lamaran Baru",
                desc: "Notifikasi saat ada kandidat baru melamar",
              },
              {
                key: "interview_reminder",
                label: "Pengingat Interview",
                desc: "Notifikasi sebelum jadwal interview",
              },
              {
                key: "shortlisted",
                label: "Update Shortlist",
                desc: "Notifikasi saat kamu mengubah status kandidat",
              },
            ].map(({ key, label, desc }, i, arr) => (
              <div
                key={key}
                className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
                <div>
                  <div className="text-[0.85rem] font-medium">{label}</div>
                  <div className="text-[0.75rem] text-[#7a9585] mt-[2px]">
                    {desc}
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifPref[key as keyof typeof notifPref]}
                  onChange={() =>
                    setNotifPref((p) => ({
                      ...p,
                      [key]: !p[key as keyof typeof p],
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <Button
            onClick={saveNotif}
            className={`px-6 py-[10px] rounded-[10px] font-bold text-[0.88rem] transition-all
              ${notifSaved ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-emerald-500 hover:bg-emerald-400 text-black"}`}>
            {notifSaved ? (
              <>
                <Check size={15} className="mr-2" /> Tersimpan!
              </>
            ) : (
              "Simpan Preferensi"
            )}
          </Button>
        </SectionCard>
      </FadeIn>

      {/* Danger zone */}
      <FadeIn delay={0.12}>
        <div className="bg-[#0f1612] border border-red-500/15 rounded-[14px] p-6">
          <div className="flex items-center gap-[8px] mb-4">
            <div className="w-7 h-7 rounded-[7px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <LogOut size={14} />
            </div>
            <span className="font-bold text-[0.9rem] text-red-400">
              Keluar Akun
            </span>
          </div>
          <p className="text-[#7a9585] text-[0.82rem] mb-4">
            Kamu akan keluar dari semua sesi yang aktif.
          </p>
          <Button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            variant="outline"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-[9px] bg-transparent px-5 py-[9px] text-[0.82rem]">
            Keluar dari Akun
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
