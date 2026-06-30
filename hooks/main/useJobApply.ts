import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Job } from "@/types/jobs";
import { calcMatchScore } from "@/lib/helpers/candidate/matches";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Step = "upload" | "analyzing" | "done" | "error";

export function useJobApply({
  job,
  token,
  userId,
  onSuccess,
}: {
  job: Job;
  token: string;
  userId: string;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
      setErrorMsg("Only PDF files are supported");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg("Maximum file size is 5MB");
      return;
    }
    setErrorMsg("");
    setFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const extractTextFromPDF = async (f: File): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url,
    ).toString();
    const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() })
      .promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text +=
        content.items.map((item) => ("str" in item ? item.str : "")).join(" ") +
        "\n";
    }
    return text.trim();
  };

  const handleSubmit = async () => {
    if (!file) return setErrorMsg("Please select a CV file first");
    setStep("analyzing");
    setErrorMsg("");

    try {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("cv_candidate")
        .upload(filePath, file);
      if (uploadError)
        throw new Error("Failed to upload CV: " + uploadError.message);

      const { data: urlData } = supabase.storage
        .from("cv_candidate")
        .getPublicUrl(filePath);
      const cv_url = urlData.publicUrl;

      const cvText = await extractTextFromPDF(file);

      const aiRes = await fetch(`${API}/api/ai/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cvText,
          jobDescription: `${job.title}\n${job.description}\n${job.requirements}`,
        }),
      });
      if (!aiRes.ok) throw new Error("Failed to analyze CV");
      const analysis = await aiRes.json();

      // ── Hitung matching score job-specific di sini ──────────
      // Gemini tidak menghasilkan field matchingScore, jadi kita
      // hitung manual pakai calcMatchScore yang sama dengan yang
      // dipakai di halaman Job Matches, supaya konsisten.
      const candidateSkillNames: string[] = Array.isArray(analysis.skills)
        ? analysis.skills.map((s: { name: string }) => s.name)
        : [];

      const { score: matchingScore } = calcMatchScore(
        candidateSkillNames,
        job.skills || [],
      );

      const analysisWithMatch = {
        ...analysis,
        matchingScore,
      };

      const applyRes = await fetch(`${API}/api/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: job.id,
          cv_url,
          analysis: analysisWithMatch,
        }),
      });
      if (!applyRes.ok) {
        const err = await applyRes.json();
        throw new Error(err.error || "Failed to apply");
      }

      setStep("done");
      onSuccess();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
      setStep("error");
    }
  };

  return {
    file,
    step,
    errorMsg,
    dragging,
    inputRef,
    handleFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    handleInputChange,
    handleSubmit,
  };
}