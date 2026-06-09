"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  BriefcaseBusiness,
  Users,
  Layers,
  AlignLeft,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "../../../app/(role)/dashboard/hr/_components/shared";
import { createPortal } from "react-dom";
import { Company } from "@/types/company";

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"] as const;
type CompanySize = (typeof COMPANY_SIZES)[number];

const INDUSTRIES = [
  "Teknologi & Software",
  "E-commerce & Retail",
  "Keuangan & Fintech",
  "Kesehatan & Medis",
  "Pendidikan",
  "Manufaktur",
  "Lainnya",
] as const;
type Industry = (typeof INDUSTRIES)[number] | "";

interface CompanyForm {
  name: string;
  description: string;
  company_size: CompanySize | "";
  industry: Industry;
}

interface Step {
  label: string;
  done?: boolean;
  active?: boolean;
}

const STEPS: Step[] = [
  { label: "Akun", done: true },
  { label: "Perusahaan", active: true },
  { label: "Selesai" },
];

export default function CompanySetupModal({
  token,
  onDone,
}: {
  token: string;
  onDone: (c: Company) => void;
}) {
  const [form, setForm] = useState<CompanyForm>({
    name: "",
    description: "",
    company_size: "",
    industry: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    if (!form.name.trim()) return setError("Nama perusahaan wajib diisi");
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/companies/create", token, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onDone(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setForm((prev) => ({
      ...prev,
      description: e.target.value.slice(0, 200),
    }));
  };

  const handleIndustryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setForm((prev) => ({ ...prev, industry: e.target.value as Industry }));
  };

  const handleSizeSelect = (size: CompanySize): void => {
    setForm((prev) => ({ ...prev, company_size: size }));
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          padding: "16px",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title">
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "relative",
            background: "#0d1610",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: "20px",
            padding: "24px",
            width: "100%",
            maxWidth: "460px",
          }}>
          {/* Close button */}
          <button
            type="button"
            title="Tutup modal"
            aria-label="Tutup modal setup perusahaan"
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              width: "26px",
              height: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(52,211,153,0.1)",
              color: "#4d7a63",
              cursor: "pointer",
              transition: "all 0.15s",
            }}>
            <X size={13} aria-hidden="true" />
          </button>

          {/* Header row: icon + badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
            }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#34d399",
                flexShrink: 0,
              }}>
              <Building size={20} aria-hidden="true" />
            </div>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "10px",
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: "20px",
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  color: "#34d399",
                  marginBottom: "4px",
                }}>
                <Sparkles size={10} aria-hidden="true" />
                Langkah terakhir
              </div>
              <h2
                id="modal-title"
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#ecfdf5",
                  letterSpacing: "-0.3px",
                  margin: 0,
                }}>
                Setup Perusahaan
              </h2>
            </div>
          </div>

          <p
            style={{
              fontSize: "12px",
              color: "#4d7a63",
              lineHeight: 1.5,
              marginBottom: "16px",
            }}>
            Lengkapi profil perusahaan untuk mulai menggunakan dashboard secara
            penuh.
          </p>

          {/* Steps */}
          <nav
            aria-label="Langkah pengisian"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "18px",
            }}>
            {STEPS.map((s, i) => (
              <div key={s.label} style={{ display: "contents" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: s.active ? "#34d399" : "#4d7a63",
                    whiteSpace: "nowrap",
                  }}
                  aria-current={s.active ? "step" : undefined}>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      border: `1px solid ${s.done || s.active ? "rgba(52,211,153,0.45)" : "rgba(52,211,153,0.15)"}`,
                      background:
                        s.done || s.active
                          ? "rgba(52,211,153,0.15)"
                          : "transparent",
                      color: s.done || s.active ? "#34d399" : "#4d7a63",
                    }}>
                    {s.done ? <Check size={9} aria-hidden="true" /> : i + 1}
                  </div>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(52,211,153,0.1)",
                    }}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Fields */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "14px",
            }}>
            {/* Company name */}
            <div>
              <label
                htmlFor="company-name"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#4d7a63",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "5px",
                }}>
                <Building size={11} aria-hidden="true" />
                Nama Perusahaan{" "}
                <span style={{ color: "#f87171" }} aria-hidden="true">
                  *
                </span>
              </label>
              <div style={{ position: "relative" }}>
                <BriefcaseBusiness
                  size={14}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#2d5040",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="company-name"
                  type="text"
                  name="company_name"
                  title="Nama perusahaan"
                  placeholder="PT Teknologi Indonesia"
                  autoComplete="organization"
                  required
                  aria-required="true"
                  aria-label="Nama perusahaan (wajib diisi)"
                  maxLength={150}
                  value={form.name}
                  onChange={handleNameChange}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(52,211,153,0.15)",
                    borderRadius: "10px",
                    padding: "9px 12px 9px 36px",
                    fontSize: "13px",
                    color: "#d1fae5",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Company size chips */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#4d7a63",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                }}>
                <Users size={11} aria-hidden="true" />
                Ukuran Tim
              </legend>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                role="group"
                aria-label="Pilih ukuran tim">
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    title={`Pilih ukuran tim: ${size} karyawan`}
                    onClick={() => handleSizeSelect(size)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 500,
                      border: `1px solid ${form.company_size === size ? "rgba(52,211,153,0.45)" : "rgba(52,211,153,0.15)"}`,
                      background:
                        form.company_size === size
                          ? "rgba(52,211,153,0.12)"
                          : "transparent",
                      color: form.company_size === size ? "#34d399" : "#4d7a63",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}>
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Industry */}
            <div>
              <label
                htmlFor="company-industry"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#4d7a63",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "5px",
                }}>
                <Layers size={11} aria-hidden="true" />
                Industri
              </label>
              <div style={{ position: "relative" }}>
                <select
                  id="company-industry"
                  name="industry"
                  title="Pilih industri perusahaan"
                  aria-label="Industri perusahaan"
                  value={form.industry}
                  onChange={handleIndustryChange}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(52,211,153,0.15)",
                    borderRadius: "10px",
                    padding: "9px 34px 9px 12px",
                    fontSize: "13px",
                    color: form.industry ? "#d1fae5" : "#2d5040",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}>
                  <option value="" disabled>
                    Pilih industri...
                  </option>
                  {INDUSTRIES.map((ind) => (
                    <option
                      key={ind}
                      value={ind}
                      style={{ background: "#0d1610", color: "#d1fae5" }}>
                      {ind}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#2d5040",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="company-description"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#4d7a63",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "5px",
                }}>
                <AlignLeft size={11} aria-hidden="true" />
                Deskripsi Singkat
              </label>
              <textarea
                id="company-description"
                name="description"
                title="Deskripsi singkat perusahaan (maksimal 200 karakter)"
                placeholder="Ceritakan sedikit tentang perusahaan kamu..."
                aria-label="Deskripsi singkat perusahaan"
                aria-describedby="desc-char-count"
                rows={2}
                maxLength={200}
                value={form.description}
                onChange={handleDescriptionChange}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(52,211,153,0.15)",
                  borderRadius: "10px",
                  padding: "9px 12px",
                  fontSize: "13px",
                  color: "#d1fae5",
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.5,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <p
                id="desc-char-count"
                aria-live="polite"
                style={{
                  fontSize: "10px",
                  color: "#2d5040",
                  textAlign: "right",
                  marginTop: "3px",
                }}>
                {form.description.length} / 200
              </p>
            </div>
          </div>

          {/* Privacy note — compact */}
          <div
            role="note"
            aria-label="Informasi privasi"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(52,211,153,0.05)",
              border: "1px solid rgba(52,211,153,0.15)",
              borderRadius: "8px",
              padding: "8px 12px",
              marginBottom: "14px",
            }}>
            <Lock
              size={12}
              aria-hidden="true"
              style={{ color: "#34d399", flexShrink: 0 }}
            />
            <p
              style={{
                fontSize: "11px",
                color: "#4d7a63",
                lineHeight: 1.4,
                margin: 0,
              }}>
              Data ini hanya digunakan untuk personalisasi dashboard dan tidak
              dibagikan ke pihak ketiga.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#f87171",
                fontSize: "12px",
                marginBottom: "12px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px",
                padding: "7px 10px",
              }}>
              <AlertCircle size={13} aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              title="Go back to previous step"
              aria-label="Go back to previous step"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#4d7a63",
                border: "1px solid rgba(52,211,153,0.2)",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                flexShrink: 0,
              }}>
              <ArrowLeft size={13} aria-hidden="true" />
              Kembali
            </button>
            <Button
              type="button"
              title="Simpan data perusahaan dan mulai gunakan dashboard"
              aria-label="Simpan dan mulai gunakan dashboard"
              disabled={loading}
              onClick={handleSubmit}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #059669, #10b981)",
                border: "none",
                borderRadius: "10px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.15s",
                fontFamily: "inherit",
              }}>
              {loading ? (
                <>
                  <Loader2
                    size={14}
                    aria-hidden="true"
                    className="animate-spin"
                  />
                  Menyimpan...
                </>
              ) : (
                <>
                  Mulai Gunakan Dashboard
                  <ArrowRight size={14} aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
