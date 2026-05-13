"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Building2,
  ChevronRight,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  Star,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-[#141f19] border border-emerald-500/15 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-emerald-500/40 transition-colors";

const getInitials = (name: string) =>
  (name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

async function apiFetch(url: string, token: string, opts?: RequestInit) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  accent = "emerald",
  children,
}: {
  title: string;
  icon: React.ElementType;
  accent?: "emerald" | "red";
  children: React.ReactNode;
}) {
  const isRed = accent === "red";
  return (
    <div
      className={`rounded-[14px] border p-6 mb-4 bg-[#0f1612] ${isRed ? "border-red-500/15" : "border-emerald-500/15"}`}>
      <div className="flex items-center gap-2 mb-5">
        <div
          className={`w-7 h-7 rounded-[7px] flex items-center justify-center ${isRed ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
          <Icon size={14} />
        </div>
        <span
          className={`font-bold text-[0.9rem] ${isRed ? "text-red-400" : ""}`}>
          {title}
        </span>
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

function SaveBtn({
  loading,
  saved,
  onClick,
  label = "Simpan Perubahan",
}: {
  loading: boolean;
  saved: boolean;
  onClick: () => void;
  label?: string;
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
      {loading ? "Menyimpan..." : saved ? "Tersimpan!" : label}
    </Button>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 text-red-400 text-[0.82rem] bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2 mb-4">
      <AlertCircle size={13} /> {msg}
    </div>
  );
}

function SuccessBanner({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="flex items-center gap-2 text-emerald-400 text-[0.82rem] bg-emerald-500/10 border border-emerald-500/20 rounded-[8px] px-3 py-2 mb-4">
          <Check size={13} /> Perubahan berhasil disimpan!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 ${checked ? "bg-emerald-500" : "bg-white/10"}`}>
      <div
        className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${checked ? "left-[22px]" : "left-[2px]"}`}
      />
    </button>
  );
}

function PasswordInput({
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
    <Field label={label}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputCls} pr-11`}
        />
        <button
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </Field>
  );
}

// ─── Tab types ─────────────────────────────────────────────────────────────────
type CandidateTab = "profile" | "security" | "notifications";
type HRTab = "profile" | "company" | "security" | "notifications";

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UnifiedProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth & role
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [role, setRole] = useState<"candidate" | "hr" | null>(null);
  const [loading, setLoading] = useState(true);

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Profile form (candidate)
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    location: "",
    job_title: "",
    bio: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [globalSaved, setGlobalSaved] = useState(false);

  // HR profile form
  const [hrProfileForm, setHrProfileForm] = useState({ full_name: "" });
  const [hrProfileLoading, setHrProfileLoading] = useState(false);
  const [hrProfileSaved, setHrProfileSaved] = useState(false);

  // Company form (HR only)
  const [company, setCompany] = useState<any>(null);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    description: "",
    company_size: "",
  });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companySaved, setCompanySaved] = useState(false);
  const [companyError, setCompanyError] = useState("");

  // Password
  const [passwordForm, setPasswordForm] = useState({
    new: "",
    confirm: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Notifications
  const [notifPref, setNotifPref] = useState({
    new_application: true,
    interview_reminder: true,
    shortlisted: true,
    job_alerts: true,
    application_updates: true,
    ai_insights: false,
    weekly_digest: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // ── Detect role ─────────────────────────────────────────────────────────────
  // Adjust this logic to match your actual role detection system
  // (e.g. from user_metadata, JWT claims, a separate API call, or context)
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      const u = session.user;
      setUser(u);
      setToken(session.access_token);

      // ── Role detection ──
      // Option A: from user_metadata
      const detectedRole: "candidate" | "hr" =
        u.user_metadata?.role === "hr" ? "hr" : "candidate";

      setRole(detectedRole);

      if (detectedRole === "candidate") {
        setProfileForm({
          full_name: u.user_metadata?.full_name || "",
          phone: u.user_metadata?.phone || "",
          location: u.user_metadata?.location || "",
          job_title: u.user_metadata?.job_title || "",
          bio: u.user_metadata?.bio || "",
        });
      } else {
        setHrProfileForm({ full_name: u.user_metadata?.full_name || "" });
        // Fetch company data
        try {
          const companyData = await apiFetch(
            "/api/companies/me",
            session.access_token,
          );
          setCompany(companyData);
          setCompanyForm({
            name: companyData.name || "",
            description: companyData.description || "",
            company_size: companyData.company_size || "",
          });
        } catch {
          // Company not found yet — keep defaults
        }
      }

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveCandidateProfile = async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      let avatar_url = user?.user_metadata?.avatar_url;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `avatars/${user.id}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(path);
          avatar_url = urlData.publicUrl;
        }
      }
      const { error } = await supabase.auth.updateUser({
        data: { ...profileForm, avatar_url },
      });
      if (error) throw error;
      setProfileSaved(true);
      setGlobalSaved(true);
      setTimeout(() => {
        setProfileSaved(false);
        setGlobalSaved(false);
      }, 2500);
    } catch (err: any) {
      setProfileError(err.message || "Gagal menyimpan profil.");
    } finally {
      setProfileLoading(false);
    }
  };

  const saveHrProfile = async () => {
    setHrProfileLoading(true);
    try {
      await supabase.auth.updateUser({
        data: { full_name: hrProfileForm.full_name },
      });
      setHrProfileSaved(true);
      setTimeout(() => setHrProfileSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setHrProfileLoading(false);
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
      if (error) throw error;
      setPasswordSaved(true);
      setPasswordForm({ new: "", confirm: "" });
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // ── Derived values ──────────────────────────────────────────────────────────
  const displayName =
    (role === "hr" ? hrProfileForm.full_name : profileForm.full_name) ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarSrc = avatarPreview || user?.user_metadata?.avatar_url || null;

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "-";

  // ── Tab definitions per role ─────────────────────────────────────────────────
  const candidateTabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "notifications", label: "Notifikasi", icon: Bell },
  ];

  const hrTabs = [
    { id: "profile", label: "Profil Akun", icon: User },
    { id: "company", label: "Profil Perusahaan", icon: Building2 },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "notifications", label: "Notifikasi", icon: Bell },
  ];

  const tabs = role === "hr" ? hrTabs : candidateTabs;

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-emerald-400" />
          <p className="text-[#4d6b5a] text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d] pt-24 pb-16 px-4">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04] bg-[radial-gradient(circle,#10b981_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[radial-gradient(circle,#06b6d4_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-[920px] mx-auto">
        {/* Page header */}
        <FadeIn>
          <div className="mb-8">
            <p className="text-[#4d6b5a] text-[0.78rem] font-semibold uppercase tracking-[0.14em] mb-1">
              {role === "hr" ? "HR · Pengaturan" : "Kandidat · Akun"}
            </p>
            <h1 className="text-[1.8rem] font-extrabold text-[#e8f0ec] tracking-[-0.02em]">
              Pengaturan
            </h1>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* ── LEFT SIDEBAR ── */}
          <FadeIn delay={0.04}>
            <div className="flex flex-col gap-4">
              {/* Avatar card */}
              <div className="rounded-[16px] border border-emerald-500/15 p-6 flex flex-col items-center gap-4 bg-[#0f1612]">
                <div className="relative group">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-24 h-24 rounded-[16px] object-cover border-2 border-emerald-500/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-[16px] flex items-center justify-center text-2xl font-black text-black border-2 border-emerald-500/20 bg-[linear-gradient(135deg,#10b981,#06b6d4)]">
                      {getInitials(displayName)}
                    </div>
                  )}
                  {/* Only candidate can upload avatar */}
                  {role === "candidate" && (
                    <>
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
                    </>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-[#e8f0ec] font-bold text-[1rem]">
                    {displayName}
                  </p>
                  <p className="text-[#4d6b5a] text-[0.78rem] mt-0.5">
                    {user?.email}
                  </p>
                  <div
                    className={`inline-flex items-center gap-1 mt-2 px-2 py-[2px] rounded-full text-[0.65rem] font-bold border ${
                      role === "hr"
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}>
                    {role === "hr" ? "✦ HR / Recruiter" : "✓ Kandidat"}
                  </div>
                </div>

                {/* Mini stats — candidate only */}
                {role === "candidate" && (
                  <div className="w-full grid grid-cols-2 gap-2">
                    {[
                      {
                        icon: <FileText size={12} />,
                        label: "Lamaran",
                        value: "0",
                      },
                      {
                        icon: <Star size={12} />,
                        label: "Tersimpan",
                        value: "0",
                      },
                      {
                        icon: <Calendar size={12} />,
                        label: "Bergabung",
                        value: joinDate,
                      },
                      {
                        icon: <Briefcase size={12} />,
                        label: "Posisi",
                        value: profileForm.job_title || "-",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[10px] p-2.5 border border-emerald-500/8 bg-emerald-500/3 flex flex-col gap-1">
                        <span className="text-[#4d6b5a] flex items-center gap-1 text-[0.72rem]">
                          {stat.icon}
                          {stat.label}
                        </span>
                        <span className="text-[#c5d8cc] font-semibold text-[0.78rem] truncate">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* HR company info */}
                {role === "hr" && company && (
                  <div className="w-full rounded-[10px] p-3 border border-emerald-500/10 bg-emerald-500/3">
                    <p className="text-[0.72rem] text-[#4d6b5a] mb-1 flex items-center gap-1">
                      <Building2 size={11} /> Perusahaan
                    </p>
                    <p className="text-[0.84rem] font-semibold text-[#c5d8cc]">
                      {company.name}
                    </p>
                    {company.company_size && (
                      <p className="text-[0.72rem] text-[#4d6b5a] mt-0.5">
                        {company.company_size}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Tab nav */}
              <div className="rounded-[16px] border border-emerald-500/15 p-2 flex flex-col gap-1 bg-[#0f1612]">
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
                      <tab.icon size={15} />
                      {tab.label}
                    </span>
                    <ChevronRight size={13} className="opacity-40" />
                  </button>
                ))}

                <div className="h-px bg-emerald-500/8 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-[0.85rem] font-medium text-[#7a9585] hover:text-red-400 hover:bg-red-500/[0.06] border border-transparent transition-all duration-200 w-full cursor-pointer">
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            </div>
          </FadeIn>

          {/* ── RIGHT CONTENT ── */}
          <FadeIn delay={0.08}>
            <div className="rounded-[16px] border border-emerald-500/15 p-6 lg:p-8 bg-[#0f1612] min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
                  {/* ══ TAB: PROFILE (Candidate) ══ */}
                  {activeTab === "profile" && role === "candidate" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
                          Informasi Profil
                        </h2>
                        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
                          Update data pribadi dan informasi profesionalmu
                        </p>
                      </div>
                      <SuccessBanner show={globalSaved} />
                      <ErrorBanner msg={profileError} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <Field label="Nama Lengkap">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5244]">
                              <User size={14} />
                            </span>
                            <input
                              value={profileForm.full_name}
                              onChange={(e) =>
                                setProfileForm((f) => ({
                                  ...f,
                                  full_name: e.target.value,
                                }))
                              }
                              placeholder="Nama lengkap kamu"
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
                              value={user?.email || ""}
                              disabled
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
                              onChange={(e) =>
                                setProfileForm((f) => ({
                                  ...f,
                                  phone: e.target.value,
                                }))
                              }
                              placeholder="+62 812 3456 7890"
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
                              onChange={(e) =>
                                setProfileForm((f) => ({
                                  ...f,
                                  location: e.target.value,
                                }))
                              }
                              placeholder="Jakarta, Indonesia"
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
                                onChange={(e) =>
                                  setProfileForm((f) => ({
                                    ...f,
                                    job_title: e.target.value,
                                  }))
                                }
                                placeholder="Frontend Developer"
                                className={`${inputCls} pl-9`}
                              />
                            </div>
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Bio">
                            <textarea
                              value={profileForm.bio}
                              onChange={(e) =>
                                setProfileForm((f) => ({
                                  ...f,
                                  bio: e.target.value,
                                }))
                              }
                              rows={4}
                              placeholder="Ceritakan sedikit tentang dirimu..."
                              className={`${inputCls} resize-none`}
                            />
                          </Field>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <SaveBtn
                          loading={profileLoading}
                          saved={profileSaved}
                          onClick={saveCandidateProfile}
                        />
                      </div>
                    </div>
                  )}

                  {/* ══ TAB: PROFILE (HR) ══ */}
                  {activeTab === "profile" && role === "hr" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
                          Profil Akun
                        </h2>
                        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
                          Informasi akun HR kamu
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 mb-6">
                        <Field label="Nama Lengkap">
                          <input
                            value={hrProfileForm.full_name}
                            onChange={(e) =>
                              setHrProfileForm({ full_name: e.target.value })
                            }
                            placeholder="Nama lengkap kamu"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Email" hint="Email tidak dapat diubah.">
                          <input
                            value={user?.email || ""}
                            disabled
                            className={`${inputCls} opacity-50 cursor-not-allowed`}
                          />
                        </Field>
                      </div>
                      <SaveBtn
                        loading={hrProfileLoading}
                        saved={hrProfileSaved}
                        onClick={saveHrProfile}
                      />
                    </div>
                  )}

                  {/* ══ TAB: COMPANY (HR only) ══ */}
                  {activeTab === "company" && role === "hr" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
                          Profil Perusahaan
                        </h2>
                        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
                          Informasi perusahaan yang tampil ke kandidat
                        </p>
                      </div>
                      <ErrorBanner msg={companyError} />
                      <div className="flex flex-col gap-4 mb-6">
                        <Field label="Nama Perusahaan *">
                          <input
                            value={companyForm.name}
                            onChange={(e) =>
                              setCompanyForm((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
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
                            <option value="11-50 karyawan">
                              11–50 karyawan
                            </option>
                            <option value="51-200 karyawan">
                              51–200 karyawan
                            </option>
                            <option value="201-500 karyawan">
                              201–500 karyawan
                            </option>
                            <option value="500+ karyawan">500+ karyawan</option>
                          </select>
                        </Field>
                        <Field label="Deskripsi Singkat">
                          <textarea
                            value={companyForm.description}
                            onChange={(e) =>
                              setCompanyForm((p) => ({
                                ...p,
                                description: e.target.value,
                              }))
                            }
                            rows={4}
                            placeholder="Ceritakan tentang perusahaan kamu..."
                            className={`${inputCls} resize-none`}
                          />
                        </Field>
                      </div>
                      <SaveBtn
                        loading={companyLoading}
                        saved={companySaved}
                        onClick={saveCompany}
                      />
                    </div>
                  )}

                  {/* ══ TAB: SECURITY (shared) ══ */}
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
                      <div className="rounded-[12px] border border-emerald-500/10 p-5 mb-5 bg-emerald-500/2">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield size={15} className="text-emerald-400" />
                          <h3 className="text-[0.9rem] font-semibold text-[#c5d8cc]">
                            Ubah Password
                          </h3>
                        </div>
                        <ErrorBanner msg={passwordError} />
                        <div className="flex flex-col gap-4 mb-4">
                          <PasswordInput
                            label="Password Baru"
                            value={passwordForm.new}
                            onChange={(v) =>
                              setPasswordForm((p) => ({ ...p, new: v }))
                            }
                            placeholder="Minimal 6 karakter"
                          />
                          <PasswordInput
                            label="Konfirmasi Password Baru"
                            value={passwordForm.confirm}
                            onChange={(v) =>
                              setPasswordForm((p) => ({ ...p, confirm: v }))
                            }
                            placeholder="Ulangi password baru"
                          />
                        </div>
                        <div className="flex justify-end">
                          <SaveBtn
                            loading={passwordLoading}
                            saved={passwordSaved}
                            onClick={savePassword}
                            label="Ubah Password"
                          />
                        </div>
                      </div>

                      {/* Danger zone */}
                      <div className="rounded-[12px] border border-red-500/15 p-5 bg-red-500/2">
                        <div className="flex items-center gap-2 mb-2">
                          <LogOut size={14} className="text-red-400" />
                          <h3 className="text-[0.9rem] font-semibold text-red-400">
                            Keluar Akun
                          </h3>
                        </div>
                        <p className="text-[#7a9585] text-[0.82rem] mb-4">
                          Kamu akan keluar dari semua sesi yang aktif.
                        </p>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-[9px] bg-transparent px-5 py-[9px] text-[0.82rem]">
                          Keluar dari Akun
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ══ TAB: NOTIFICATIONS (shared) ══ */}
                  {activeTab === "notifications" && (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-[1.1rem] font-bold text-[#e8f0ec]">
                          Preferensi Notifikasi
                        </h2>
                        <p className="text-[#4d6b5a] text-[0.82rem] mt-0.5">
                          Atur notifikasi yang ingin kamu terima
                        </p>
                      </div>

                      <div className="flex flex-col gap-0 mb-6">
                        {(role === "hr"
                          ? [
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
                            ]
                          : [
                              {
                                key: "job_alerts",
                                label: "Job Alerts",
                                desc: "Notifikasi lowongan baru yang sesuai profilmu",
                              },
                              {
                                key: "application_updates",
                                label: "Update Lamaran",
                                desc: "Status perubahan lamaran kerjamu",
                              },
                              {
                                key: "ai_insights",
                                label: "AI Insights",
                                desc: "Tips dan analisa dari AI Recruiter",
                              },
                              {
                                key: "weekly_digest",
                                label: "Weekly Digest",
                                desc: "Ringkasan mingguan aktivitasmu",
                              },
                            ]
                        ).map(({ key, label, desc }, i, arr) => (
                          <div
                            key={key}
                            className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? "border-b border-emerald-500/10" : ""}`}>
                            <div>
                              <div className="text-[0.85rem] font-medium text-[#c5d8cc]">
                                {label}
                              </div>
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

                      <div className="flex justify-end">
                        <SaveBtn
                          loading={false}
                          saved={notifSaved}
                          onClick={saveNotif}
                          label="Simpan Preferensi"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
