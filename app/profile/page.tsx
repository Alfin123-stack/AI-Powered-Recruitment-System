// app/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Save,
  LogOut,
  Shield,
  Bell,
  ChevronRight,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  Star,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "profile" | "security" | "notifications";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    job_title: "",
    bio: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifSettings, setNotifSettings] = useState({
    job_alerts: true,
    application_updates: true,
    ai_insights: false,
    weekly_digest: true,
  });

  // ── Auth & load user ──
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user ?? null;
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);
      setForm({
        full_name: u.user_metadata?.full_name || "",
        email: u.email || "",
        phone: u.user_metadata?.phone || "",
        location: u.user_metadata?.location || "",
        job_title: u.user_metadata?.job_title || "",
        bio: u.user_metadata?.bio || "",
      });
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      // Upload avatar jika ada
      let avatar_url = user.user_metadata?.avatar_url;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `avatars/${user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(path);
          avatar_url = urlData.publicUrl;
        }
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: form.full_name,
          phone: form.phone,
          location: form.location,
          job_title: form.job_title,
          bio: form.bio,
          avatar_url,
        },
      });

      if (updateError) throw updateError;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    if (passwords.new !== passwords.confirm) {
      setError("Password baru tidak cocok.");
      return;
    }
    if (passwords.new.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });
      if (error) throw error;
      setPasswords({ current: "", new: "", confirm: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal mengubah password.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatar = avatarPreview || user?.user_metadata?.avatar_url;
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "-";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profil", icon: <User size={15} /> },
    { id: "security", label: "Keamanan", icon: <Shield size={15} /> },
    { id: "notifications", label: "Notifikasi", icon: <Bell size={15} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-emerald-400" />
          <p className="text-[#4d6b5a] text-sm font-poppins">
            Memuat profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d] font-poppins pt-24 pb-16 px-4">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[920px] mx-auto">
        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <p className="text-[#4d6b5a] text-[0.8rem] font-medium uppercase tracking-[0.12em] mb-1">
            Akun
          </p>
          <h1 className="text-[1.8rem] font-extrabold text-[#e8f0ec] tracking-[-0.02em]">
            Profil Saya
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* ── LEFT SIDEBAR ── */}
          <div className="flex flex-col gap-4">
            {/* Avatar card */}
            <div
              className="rounded-[16px] border border-[rgba(16,185,129,0.15)] p-6 flex flex-col items-center gap-4"
              style={{
                background: "rgba(15,22,18,0.8)",
                backdropFilter: "blur(12px)",
              }}>
              {/* Avatar */}
              <div className="relative group">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-24 h-24 rounded-[16px] object-cover border-2 border-[rgba(16,185,129,0.2)]"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-[16px] flex items-center justify-center text-2xl font-black text-black border-2 border-[rgba(16,185,129,0.2)]"
                    style={{
                      background: "linear-gradient(135deg,#10b981,#06b6d4)",
                    }}>
                    {getInitials(name)}
                  </div>
                )}
                {/* Camera overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-[16px] bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                  <Camera size={20} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="text-center">
                <p className="text-[#e8f0ec] font-bold text-[1rem]">{name}</p>
                <p className="text-[#4d6b5a] text-[0.78rem] mt-0.5">
                  {form.job_title || "Belum diisi"}
                </p>
              </div>

              {/* Stats mini */}
              <div className="w-full grid grid-cols-2 gap-2">
                {[
                  {
                    icon: <FileText size={12} />,
                    label: "Lamaran",
                    value: "0",
                  },
                  { icon: <Star size={12} />, label: "Tersimpan", value: "0" },
                  {
                    icon: <Calendar size={12} />,
                    label: "Bergabung",
                    value: joinDate,
                  },
                  {
                    icon: <Briefcase size={12} />,
                    label: "Applied",
                    value: "0",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[10px] p-2.5 border border-[rgba(16,185,129,0.08)] bg-[rgba(16,185,129,0.03)] flex flex-col gap-1">
                    <span className="text-[#4d6b5a] flex items-center gap-1 text-[0.72rem]">
                      {stat.icon}
                      {stat.label}
                    </span>
                    <span className="text-[#c5d8cc] font-semibold text-[0.82rem] truncate">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs nav */}
            <div
              className="rounded-[16px] border border-[rgba(16,185,129,0.15)] p-2 flex flex-col gap-1"
              style={{
                background: "rgba(15,22,18,0.8)",
                backdropFilter: "blur(12px)",
              }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[0.85rem] font-medium w-full text-left transition-all duration-200 cursor-pointer
                    ${
                      activeTab === tab.id
                        ? "text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20"
                        : "text-[#7a9585] border border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"
                    }`}>
                  <span className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                  <ChevronRight size={13} className="opacity-40" />
                </button>
              ))}

              {/* Divider */}
              <div className="h-px bg-[rgba(16,185,129,0.08)] my-1" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-[0.85rem] font-medium text-[#7a9585] hover:text-red-400 hover:bg-red-500/[0.06] border border-transparent transition-all duration-200 w-full cursor-pointer">
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div
            className="rounded-[16px] border border-[rgba(16,185,129,0.15)] p-6 lg:p-8"
            style={{
              background: "rgba(15,22,18,0.8)",
              backdropFilter: "blur(12px)",
            }}>
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-red-500/[0.08] border border-red-500/20 mb-6">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-[0.84rem]">{error}</p>
              </div>
            )}

            {/* Success banner */}
            {saved && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-emerald-500/[0.08] border border-emerald-500/20 mb-6">
                <Check size={15} className="text-emerald-400 flex-shrink-0" />
                <p className="text-emerald-400 text-[0.84rem]">
                  Perubahan berhasil disimpan!
                </p>
              </div>
            )}

            {/* ── TAB: PROFILE ── */}
            {activeTab === "profile" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
                    Informasi Profil
                  </h2>
                  <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
                    Update data pribadi dan informasi profesionalmu
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full name */}
                  <InputField
                    label="Nama Lengkap"
                    icon={<User size={14} />}
                    value={form.full_name}
                    onChange={(v) => setForm((f) => ({ ...f, full_name: v }))}
                    placeholder="John Doe"
                  />

                  {/* Email (read-only) */}
                  <InputField
                    label="Email"
                    icon={<Mail size={14} />}
                    value={form.email}
                    onChange={() => {}}
                    placeholder="email@example.com"
                    disabled
                    hint="Email tidak dapat diubah"
                  />

                  {/* Phone */}
                  <InputField
                    label="Nomor HP"
                    icon={<Phone size={14} />}
                    value={form.phone}
                    onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    placeholder="+62 812 3456 7890"
                  />

                  {/* Location */}
                  <InputField
                    label="Lokasi"
                    icon={<MapPin size={14} />}
                    value={form.location}
                    onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                    placeholder="Jakarta, Indonesia"
                  />

                  {/* Job title — full width */}
                  <div className="sm:col-span-2">
                    <InputField
                      label="Posisi / Jabatan"
                      icon={<Briefcase size={14} />}
                      value={form.job_title}
                      onChange={(v) => setForm((f) => ({ ...f, job_title: v }))}
                      placeholder="Frontend Developer"
                    />
                  </div>

                  {/* Bio — textarea */}
                  <div className="sm:col-span-2">
                    <label className="block text-[0.8rem] font-medium text-[#7a9585] mb-1.5">
                      Bio
                    </label>
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, bio: e.target.value }))
                      }
                      placeholder="Ceritakan sedikit tentang dirimu..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-[10px] bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.12)] text-[#e8f0ec] text-[0.86rem] placeholder-[#3a5244] outline-none resize-none transition-all duration-200 focus:border-[rgba(16,185,129,0.35)] focus:bg-[rgba(16,185,129,0.06)]"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton saving={saving} onClick={handleSaveProfile} />
                </div>
              </div>
            )}

            {/* ── TAB: SECURITY ── */}
            {activeTab === "security" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
                    Keamanan Akun
                  </h2>
                  <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
                    Kelola password dan keamanan akunmu
                  </p>
                </div>

                {/* Change password section */}
                <div
                  className="rounded-[12px] border border-[rgba(16,185,129,0.1)] p-5 mb-5"
                  style={{ background: "rgba(16,185,129,0.02)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={15} className="text-emerald-400" />
                    <h3 className="text-[0.9rem] font-semibold text-[#c5d8cc]">
                      Ubah Password
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <PasswordField
                      label="Password Baru"
                      value={passwords.new}
                      onChange={(v) => setPasswords((p) => ({ ...p, new: v }))}
                      placeholder="Min. 8 karakter"
                    />
                    <PasswordField
                      label="Konfirmasi Password"
                      value={passwords.confirm}
                      onChange={(v) =>
                        setPasswords((p) => ({ ...p, confirm: v }))
                      }
                      placeholder="Ulangi password baru"
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <SaveButton
                      saving={saving}
                      onClick={handleChangePassword}
                      label="Ubah Password"
                    />
                  </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-[12px] border border-red-500/10 p-5 bg-red-500/[0.02]">
                  <h3 className="text-[0.9rem] font-semibold text-red-400 mb-1">
                    Zona Berbahaya
                  </h3>
                  <p className="text-[#4d6b5a] text-[0.8rem] mb-4">
                    Tindakan ini tidak dapat dibatalkan. Pastikan kamu yakin.
                  </p>
                  <button className="px-4 py-2 rounded-[9px] text-[0.84rem] font-semibold text-red-400 border border-red-500/20 bg-red-500/[0.06] hover:bg-red-500/[0.12] transition-all duration-200 cursor-pointer">
                    Hapus Akun
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
                    Pengaturan Notifikasi
                  </h2>
                  <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
                    Atur notifikasi yang ingin kamu terima
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    {
                      key: "job_alerts" as const,
                      label: "Job Alerts",
                      desc: "Notifikasi lowongan baru yang sesuai profilmu",
                    },
                    {
                      key: "application_updates" as const,
                      label: "Update Lamaran",
                      desc: "Status perubahan lamaran kerjamu",
                    },
                    {
                      key: "ai_insights" as const,
                      label: "AI Insights",
                      desc: "Tips dan analisa dari RecruitAI",
                    },
                    {
                      key: "weekly_digest" as const,
                      label: "Weekly Digest",
                      desc: "Ringkasan mingguan aktivitasmu",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between px-4 py-4 rounded-[12px] border border-[rgba(16,185,129,0.1)] bg-[rgba(16,185,129,0.02)] hover:border-[rgba(16,185,129,0.2)] transition-all duration-200">
                      <div>
                        <p className="text-[0.88rem] font-medium text-[#c5d8cc]">
                          {item.label}
                        </p>
                        <p className="text-[0.78rem] text-[#4d6b5a] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      {/* Toggle */}
                      <button
                        onClick={() =>
                          setNotifSettings((s) => ({
                            ...s,
                            [item.key]: !s[item.key],
                          }))
                        }
                        className={`relative w-10 h-[22px] rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer
                          ${
                            notifSettings[item.key]
                              ? "bg-emerald-500"
                              : "bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.15)]"
                          }`}>
                        <span
                          className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300
                            ${notifSettings[item.key] ? "left-[22px]" : "left-[3px]"}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton saving={saving} onClick={handleSaveProfile} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function InputField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  disabled = false,
  hint,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-[0.8rem] font-medium text-[#7a9585] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
          {icon}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-9 pr-4 py-[10px] rounded-[10px] border text-[0.86rem] outline-none transition-all duration-200
            ${
              disabled
                ? "bg-[rgba(16,185,129,0.02)] border-[rgba(16,185,129,0.06)] text-[#3a5244] cursor-not-allowed"
                : "bg-[rgba(16,185,129,0.04)] border-[rgba(16,185,129,0.12)] text-[#e8f0ec] placeholder-[#3a5244] focus:border-[rgba(16,185,129,0.35)] focus:bg-[rgba(16,185,129,0.06)]"
            }`}
        />
      </div>
      {hint && <p className="text-[#3a5244] text-[0.74rem] mt-1">{hint}</p>}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[0.8rem] font-medium text-[#7a9585] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
          <Shield size={14} />
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-[10px] rounded-[10px] bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.12)] text-[#e8f0ec] text-[0.86rem] placeholder-[#3a5244] outline-none transition-all duration-200 focus:border-[rgba(16,185,129,0.35)] focus:bg-[rgba(16,185,129,0.06)]"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a5244] hover:text-[#7a9585] transition-colors cursor-pointer">
          {show ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function SaveButton({
  saving,
  onClick,
  label = "Simpan Perubahan",
}: {
  saving: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="relative inline-flex h-10 rounded-[9px] overflow-hidden p-[1.5px] focus-visible:outline-none disabled:opacity-60 cursor-pointer">
      <span
        className="absolute inset-[-1000%]"
        style={{
          background:
            "conic-gradient(from 0deg,#10b981,#06b6d4,#8b5cf6,#10b981)",
          animation: "ctaSpin 5s linear infinite",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2 h-full px-5 rounded-[7.5px] bg-[#0a0f0d] text-[0.84rem] font-bold text-emerald-400 whitespace-nowrap transition-all duration-200 hover:text-[#e8f0ec] hover:bg-emerald-500/[0.12]">
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Save size={14} />
        )}
        {saving ? "Menyimpan..." : label}
      </span>
    </button>
  );
}
