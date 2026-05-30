"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── UPLOAD ZONE ─────────────────────────────────────────────────────────────
type Props = {
  onFileSelect: (f: File) => void;
  isLoading: boolean;
};

export default function UploadZone({ onFileSelect, isLoading }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith(".pdf")) onFileSelect(f);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isLoading && inputRef.current?.click()}
      className="rounded-[16px] p-16 text-center cursor-pointer transition-all duration-300"
      style={{
        border: `1.5px dashed ${dragging ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
        background: dragging ? "rgba(255,255,255,0.02)" : "transparent",
        pointerEvents: isLoading ? "none" : "auto",
        opacity: isLoading ? 0.6 : 1,
      }}>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
        }}
      />
      <div
        className="w-[50px] h-[50px] rounded-[12px] flex items-center justify-center mx-auto mb-5"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
        {isLoading ? (
          <Loader2
            size={20}
            className="animate-spin"
            style={{ color: "rgba(74,222,128,0.6)" }}
          />
        ) : (
          <Upload size={20} style={{ color: "rgba(255,255,255,0.35)" }} />
        )}
      </div>
      <div
        className="font-semibold text-[1rem] mb-[6px]"
        style={{ color: "rgba(255,255,255,0.7)" }}>
        {isLoading ? "Menganalisis CV..." : "Upload CV kamu"}
      </div>
      <p
        className="text-[0.82rem] mb-6"
        style={{ color: "rgba(255,255,255,0.22)" }}>
        {isLoading
          ? "AI sedang memproses, mohon tunggu sebentar"
          : "Drag & drop atau klik tombol di bawah · Maks. 5MB · PDF"}
      </p>
      {!isLoading && (
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[0.85rem] px-6 py-[9px] rounded-[9px] inline-flex items-center gap-2">
          <Upload size={13} /> Pilih File CV
        </Button>
      )}
    </div>
  );
}
