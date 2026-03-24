"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, getInitials, inputCls } from "../_components/shared";
import { useCandidate } from "../layout";

export default function ProfilePage() {
  const { user } = useCandidate();
  const [form, setForm] = useState({ full_name: user?.full_name || "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await supabase.auth.updateUser({ data: { full_name: form.full_name } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[560px]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        {/* Avatar card */}
        <div className="flex items-center gap-5 mb-6 p-5 bg-[#0f1612] border border-emerald-500/15 rounded-[14px]">
          <div className="w-[64px] h-[64px] rounded-[14px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-syne font-extrabold text-[1.4rem] text-emerald-400">
            {user ? getInitials(user.full_name) : "K"}
          </div>
          <div>
            <div className="font-syne font-bold text-[1.1rem]">
              {user?.full_name}
            </div>
            <div className="text-[0.78rem] text-[#7a9585]">{user?.email}</div>
            <div className="inline-flex items-center gap-1 mt-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-[2px] rounded-full text-[0.65rem] font-bold">
              ✓ Kandidat
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-6 mb-4">
          <div className="flex items-center gap-[7px] font-bold text-[0.9rem] mb-5">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400" />{" "}
            Informasi Profil
          </div>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="text-[0.72rem] font-semibold text-[#7a9585] mb-[6px] block tracking-[0.06em] uppercase">
                Nama Lengkap
              </label>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ full_name: e.target.value })}
                placeholder="Nama lengkap kamu"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[0.72rem] font-semibold text-[#7a9585] mb-[6px] block tracking-[0.06em] uppercase">
                Email
              </label>
              <input
                value={user?.email || ""}
                disabled
                className={`${inputCls} opacity-50 cursor-not-allowed`}
              />
              <p className="text-[0.7rem] text-[#7a9585] mt-[5px]">
                Email tidak dapat diubah.
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-[10px] rounded-[10px] font-bold text-[0.88rem] transition-all
              ${saved ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"}`}>
            {loading ? (
              <Loader2 size={15} className="animate-spin mr-2" />
            ) : saved ? (
              <Check size={15} className="mr-2" />
            ) : null}
            {loading
              ? "Menyimpan..."
              : saved
                ? "Tersimpan!"
                : "Simpan Perubahan"}
          </Button>
        </div>

        {/* Logout */}
        <div className="bg-[#0f1612] border border-red-500/15 rounded-[14px] p-6">
          <div className="flex items-center gap-[7px] font-bold text-[0.9rem] mb-2 text-red-400">
            <span className="w-[6px] h-[6px] rounded-full bg-red-400" /> Keluar
            Akun
          </div>
          <p className="text-[#7a9585] text-[0.82rem] mb-4">
            Kamu akan keluar dari sesi ini.
          </p>
          <Button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            variant="outline"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-[9px] bg-transparent px-5 py-[9px] text-[0.82rem]">
            Keluar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
