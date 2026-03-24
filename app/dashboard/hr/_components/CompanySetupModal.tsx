"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch, Company, inputCls } from "./shared";

export default function CompanySetupModal({
  token,
  onDone,
}: {
  token: string;
  onDone: (c: Company) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    company_size: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name.trim()) return setError("Nama perusahaan wajib diisi");
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/companies/create", token, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onDone(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0f1612] border border-emerald-500/20 rounded-[20px] p-8 w-full max-w-[480px] mx-4">
        <div className="w-12 h-12 rounded-[12px] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-5">
          <Building2 size={22} />
        </div>
        <h2 className="font-syne font-extrabold text-[1.4rem] mb-1">
          Setup Perusahaan
        </h2>
        <p className="text-[#7a9585] text-[0.85rem] mb-6">
          Sebelum mulai, lengkapi informasi perusahaan kamu terlebih dahulu.
        </p>

        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="text-[0.75rem] font-semibold text-[#7a9585] mb-[6px] block">
              Nama Perusahaan <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="PT Teknologi Indonesia"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-[0.75rem] font-semibold text-[#7a9585] mb-[6px] block">
              Ukuran Perusahaan
            </label>
            <select
              value={form.company_size}
              onChange={(e) =>
                setForm({ ...form, company_size: e.target.value })
              }
              className={`${inputCls} appearance-none cursor-pointer`}>
              <option value="">Pilih ukuran...</option>
              <option value="1-10 karyawan">1–10 karyawan</option>
              <option value="11-50 karyawan">11–50 karyawan</option>
              <option value="51-200 karyawan">51–200 karyawan</option>
              <option value="201-500 karyawan">201–500 karyawan</option>
              <option value="500+ karyawan">500+ karyawan</option>
            </select>
          </div>
          <div>
            <label className="text-[0.75rem] font-semibold text-[#7a9585] mb-[6px] block">
              Deskripsi Singkat
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Ceritakan sedikit tentang perusahaan kamu..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-[0.82rem] mb-4 bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[11px] py-[12px] text-[0.95rem]">
          {loading && <Loader2 size={16} className="animate-spin mr-2" />}
          {loading ? "Menyimpan..." : "Mulai Gunakan Dashboard →"}
        </Button>
      </motion.div>
    </div>
  );
}
