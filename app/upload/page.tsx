"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  BarChart3,
  Zap,
} from "lucide-react";

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

interface AnalysisResult {
  resumeScore: number;
  matchScore: number;
  skills: string[];
  strengths: string[];
  improvements: string[];
}

export default function UploadCV() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [jobDesc, setJobDesc] = useState("React developer");
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const MAX_MB = 5;

  const validateFile = (f: File): string | null => {
    if (!ALLOWED.includes(f.type))
      return "Hanya file PDF atau DOCX yang didukung.";
    if (f.size > MAX_MB * 1024 * 1024)
      return `Ukuran file maksimal ${MAX_MB}MB.`;
    return null;
  };

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setState("error");
      return;
    }
    setFile(f);
    setState("idle");
    setError("");
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    setState("idle");
    setResult(null);
    setError("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = async () => {
    if (!file) return;
    setState("uploading");
    setProgress(0);
    setError("");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("jobDescription", jobDesc);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/analyze",
        formData,
        {
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
            setProgress(pct);
          },
        },
      );
      setResult(res.data);
      setState("success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Terjadi kesalahan saat menganalisis CV. Coba lagi.",
      );
      setState("error");
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const getFileIcon = () => {
    if (!file) return null;
    const isPdf = file.type === "application/pdf";
    return isPdf ? "PDF" : "DOC";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --em: #10b981; --em2: #06b6d4;
          --surface: #0a0f0d; --surface2: #0f1612; --surface3: #141f19;
          --border: rgba(16,185,129,0.15); --border-hover: rgba(16,185,129,0.35);
          --text: #e8f0ec; --muted: #7a9585;
          --font-display: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
        }
        body { background: var(--surface); color: var(--text); font-family: var(--font-body); }

        .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 24px; position: relative; overflow: hidden;
          background: radial-gradient(ellipse 60% 55% at 30% 20%, rgba(16,185,129,0.07) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 50% at 75% 80%, rgba(6,182,212,0.05) 0%, transparent 60%),
                      var(--surface); }
        .page::before { content:''; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(16,185,129,0.035) 1px,transparent 1px), linear-gradient(90deg,rgba(16,185,129,0.035) 1px,transparent 1px);
          background-size: 48px 48px; pointer-events: none; }

        .ring { position: absolute; border-radius: 50%; border: 1px solid rgba(16,185,129,0.06); pointer-events: none; animation: spin 35s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .wrap { position: relative; z-index: 1; width: 100%; max-width: 540px; }

        /* HEADER */
        .header { text-align: center; margin-bottom: 28px; }
        .logo { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; color: var(--text); text-decoration: none; margin-bottom: 20px; }
        .logo em { font-style: normal; color: var(--em); }
        .logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg,#10b981,#06b6d4); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: #000; font-weight: 800; }
        h1 { font-family: var(--font-display); font-size: 1.7rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 8px; }
        .subtitle { color: var(--muted); font-size: 0.88rem; line-height: 1.6; }

        /* CARD */
        .card { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 28px; box-shadow: 0 32px 80px rgba(0,0,0,0.45); animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        /* SECTION LABEL */
        .section-label { font-size: 0.7rem; font-weight: 700; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }

        /* JOB DESC INPUT */
        .jd-input { width: 100%; background: var(--surface3); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: var(--font-body); font-size: 0.88rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 20px; }
        .jd-input::placeholder { color: rgba(122,149,133,0.4); }
        .jd-input:focus { border-color: var(--em); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); background: rgba(16,185,129,0.03); }

        /* DROP ZONE */
        .drop-zone { border: 2px dashed var(--border); border-radius: 14px; padding: 36px 24px; text-align: center; cursor: pointer; transition: all 0.25s; position: relative; }
        .drop-zone:hover, .drop-zone.drag { border-color: var(--em); background: rgba(16,185,129,0.04); }
        .drop-zone.has-file { border-style: solid; border-color: rgba(16,185,129,0.35); background: rgba(16,185,129,0.04); cursor: default; }
        .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .drop-zone.has-file input { display: none; }

        .drop-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: var(--em); }
        .drop-title { font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 6px; }
        .drop-sub { color: var(--muted); font-size: 0.8rem; line-height: 1.55; }
        .drop-hint { display: inline-block; margin-top: 10px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: var(--em); padding: 4px 12px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; }

        /* FILE PREVIEW */
        .file-preview { display: flex; align-items: center; gap: 14px; }
        .file-icon { width: 48px; height: 48px; border-radius: 11px; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.72rem; font-weight: 800; color: var(--em); flex-shrink: 0; }
        .file-info { flex: 1; text-align: left; }
        .file-name { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
        .file-size { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
        .file-remove { width: 28px; height: 28px; border-radius: 7px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .file-remove:hover { background: rgba(239,68,68,0.2); }

        /* PROGRESS */
        .progress-wrap { margin-top: 16px; }
        .progress-header { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--muted); margin-bottom: 8px; }
        .progress-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--em), var(--em2)); transition: width 0.3s ease; }
        .progress-steps { display: flex; justify-content: space-between; margin-top: 8px; }
        .progress-step { font-size: 0.67rem; color: var(--muted); text-align: center; }
        .progress-step.active { color: var(--em); }

        /* UPLOAD BTN */
        .upload-btn { width: 100%; margin-top: 18px; background: var(--em); color: #000; font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; padding: 14px; border-radius: 11px; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 9px; }
        .upload-btn:hover:not(:disabled) { background: #0ea06e; box-shadow: 0 6px 24px rgba(16,185,129,0.35); transform: translateY(-1px); }
        .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ERROR */
        .error-box { display: flex; align-items: flex-start; gap: 9px; background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 12px 14px; margin-top: 14px; }
        .error-text { font-size: 0.83rem; color: #fca5a5; line-height: 1.5; }

        /* RESULT */
        .result-card { margin-top: 20px; background: var(--surface3); border: 1px solid rgba(16,185,129,0.2); border-radius: 14px; padding: 20px; }
        .result-header { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .result-title { font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; }

        .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
        .score-chip { background: var(--surface2); border-radius: 10px; padding: 14px; text-align: center; }
        .score-num { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .score-lbl { font-size: 0.7rem; color: var(--muted); }

        .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .skill-tag { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 500; font-family: monospace; }

        .feedback-col { display: flex; flex-direction: column; gap: 6px; }
        .fb-item { display: flex; align-items: flex-start; gap: 8px; font-size: 0.8rem; color: var(--muted); line-height: 1.5; padding: 8px 10px; border-radius: 8px; }
        .fb-strength { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15); }
        .fb-improve  { background: rgba(245,158,11,0.06);  border: 1px solid rgba(245,158,11,0.15); }

        .result-actions { display: flex; gap: 8px; margin-top: 16px; }
        .btn-detail { flex: 1; padding: 10px; border-radius: 9px; background: transparent; border: 1px solid var(--border); color: var(--text); font-family: var(--font-body); font-size: 0.82rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; text-decoration: none; }
        .btn-detail:hover { border-color: var(--border-hover); color: var(--em); }
        .btn-full { flex: 1; padding: 10px; border-radius: 9px; background: var(--em); border: none; color: #000; font-family: var(--font-body); font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; text-decoration: none; }
        .btn-full:hover { background: #0ea06e; box-shadow: 0 4px 14px rgba(16,185,129,0.3); }

        .divider { height: 1px; background: var(--border); margin: 20px 0; }
      `}</style>

      <div className="page">
        <div
          className="ring"
          style={{
            width: 500,
            height: 500,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div
          className="ring"
          style={{
            width: 720,
            height: 720,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animationDirection: "reverse",
            animationDuration: "50s",
          }}
        />

        <div className="wrap">
          {/* Header */}
          <div className="header">
            <a href="/" className="logo">
              <div className="logo-icon">✦</div>
              Recruit<em>AI</em>
            </a>
            <h1>
              Analisis CV dengan{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#10b981,#06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                Kecerdasan Buatan
              </span>
            </h1>
            <p className="subtitle">
              Upload CV Anda dan dapatkan resume score, job matching analysis,
              serta rekomendasi personal dari AI dalam hitungan detik.
            </p>
          </div>

          <div className="card">
            {/* Job description */}
            <div className="section-label">Deskripsi Pekerjaan (opsional)</div>
            <input
              className="jd-input"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Contoh: React developer with 2+ years experience..."
            />

            {/* Drop zone */}
            <div className="section-label">Upload CV</div>
            <div
              className={`drop-zone ${state === "dragging" ? "drag" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setState("dragging");
              }}
              onDragLeave={() => {
                if (state === "dragging") setState("idle");
              }}
              onDrop={handleDrop}>
              {!file ? (
                <>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                  <div className="drop-icon">
                    <Upload size={22} />
                  </div>
                  <div className="drop-title">Drag & drop CV Anda di sini</div>
                  <div className="drop-sub">
                    atau klik untuk memilih file dari komputer Anda
                  </div>
                  <span className="drop-hint">
                    PDF · DOCX · Maks {MAX_MB}MB
                  </span>
                </>
              ) : (
                <div className="file-preview">
                  <div className="file-icon">{getFileIcon()}</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatSize(file.size)}</div>
                  </div>
                  <button className="file-remove" onClick={handleRemove}>
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Progress bar when uploading */}
            <AnimatePresence>
              {state === "uploading" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="progress-wrap">
                  <div className="progress-header">
                    <span>Menganalisis CV dengan Gemini AI...</span>
                    <span style={{ color: "var(--em)", fontWeight: 700 }}>
                      {progress}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="progress-steps">
                    {["Upload", "Ekstraksi", "Analisis AI", "Hasil"].map(
                      (s, i) => (
                        <span
                          key={s}
                          className={`progress-step ${progress >= i * 33 ? "active" : ""}`}>
                          {s}
                        </span>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {(state === "error" || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="error-box">
                  <AlertCircle
                    size={15}
                    style={{ color: "#ef4444", flexShrink: 0, marginTop: 1 }}
                  />
                  <span className="error-text">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload button */}
            <button
              className="upload-btn"
              onClick={upload}
              disabled={!file || state === "uploading"}>
              {state === "uploading" ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Menganalisis...
                </>
              ) : state === "success" ? (
                <>
                  <CheckCircle2 size={16} /> Analisis Selesai!
                </>
              ) : (
                <>
                  <Zap size={16} /> Analisis CV dengan AI
                </>
              )}
            </button>

            {/* Result */}
            <AnimatePresence>
              {state === "success" && result && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="divider" />
                  <div className="result-card">
                    <div className="result-header">
                      <CheckCircle2 size={18} style={{ color: "var(--em)" }} />
                      <span className="result-title">Hasil Analisis AI</span>
                    </div>

                    {/* Scores */}
                    <div className="score-grid">
                      <div className="score-chip">
                        <div className="score-num" style={{ color: "#10b981" }}>
                          {result.resumeScore}
                        </div>
                        <div className="score-lbl">Resume Score</div>
                      </div>
                      <div className="score-chip">
                        <div className="score-num" style={{ color: "#06b6d4" }}>
                          {result.matchScore}%
                        </div>
                        <div className="score-lbl">Job Match Score</div>
                      </div>
                    </div>

                    {/* Skills */}
                    {result.skills?.length > 0 && (
                      <>
                        <div
                          className="section-label"
                          style={{ marginBottom: 8 }}>
                          Skill Terdeteksi
                        </div>
                        <div className="skills-wrap">
                          {result.skills.map((s) => (
                            <span key={s} className="skill-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Strengths */}
                    {result.strengths?.length > 0 && (
                      <>
                        <div
                          className="section-label"
                          style={{ marginBottom: 8, color: "#10b981" }}>
                          Kekuatan CV
                        </div>
                        <div
                          className="feedback-col"
                          style={{ marginBottom: 12 }}>
                          {result.strengths.map((s, i) => (
                            <div key={i} className="fb-item fb-strength">
                              <CheckCircle2
                                size={13}
                                style={{
                                  color: "#10b981",
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              />
                              {s}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Improvements */}
                    {result.improvements?.length > 0 && (
                      <>
                        <div
                          className="section-label"
                          style={{ marginBottom: 8, color: "#f59e0b" }}>
                          Rekomendasi Perbaikan
                        </div>
                        <div
                          className="feedback-col"
                          style={{ marginBottom: 14 }}>
                          {result.improvements.map((s, i) => (
                            <div key={i} className="fb-item fb-improve">
                              <ChevronRight
                                size={13}
                                style={{
                                  color: "#f59e0b",
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              />
                              {s}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="result-actions">
                      <a href="/analyze" className="btn-detail">
                        <BarChart3 size={13} /> Analisis Lengkap
                      </a>
                      <a href="/jobs" className="btn-full">
                        <Zap size={13} /> Lihat Job Matches
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 18,
              flexWrap: "wrap",
            }}>
            {["🔒 SSL Encrypted", "🤖 Gemini AI", "🛡️ PDPA Compliant"].map(
              (b) => (
                <span
                  key={b}
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(122,149,133,0.55)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}>
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
