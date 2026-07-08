"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  MoreHorizontal,
  Check,
  Lock,
  ClipboardList,
} from "lucide-react";
import { CandidateRaw, CandidateStatus } from "@/types/candidates";
import { STATUS_CONFIG } from "@/constants/candidates";
import {
  CandidatesStatusConfirmModal,
  isStatusLocked,
  showStatusToast,
  type ConfirmableStatus,
} from "./CandidatesStatusConfirmModal";

// Statuses only ever set automatically by a form/flow elsewhere (schedule
// interview, evaluation, offer letter, offer accept/decline, onboarding
// email), never by clicking a dropdown item manually. Once a candidate
// reaches one of these, Shortlist/Review/Reject are locked so HR can't
// accidentally overwrite an in-progress or finished stage.
//
// RENAME: sebelumnya "OFFER_FLOW_STATUSES" — sudah tidak akurat lagi
// karena sekarang mencakup lebih dari offer flow (interview & evaluated
// terjadi SEBELUM offer letter dikirim).
//
// FIX: "accepted" dibuang — sudah dihapus dari CandidateStatus juga
// (types/candidates.ts), karena deriveDisplayStatus() tidak pernah
// benar-benar mengembalikan nilai ini ke UI.
//
// TAMBAHAN: "interview" (di-set otomatis saat submit Create Interview),
// "evaluated" (di-set otomatis saat submit EvaluationModal dengan
// rekomendasi Hire, sebelum offer letter dikirim), "onboard" (di-set
// otomatis saat onboarding email sukses terkirim).
const AUTOMATED_STATUSES: CandidateStatus[] = [
  "interview",
  "evaluated",
  "offered",
  "declined",
  "expired",
  "hired",
  "onboard",
];

export function CandidatesActionDropdown({
  candidate,
  onStatusChange,
  onView,
  onSendOnboarding,
}: {
  candidate: CandidateRaw;
  onStatusChange: (id: string, status: CandidateStatus) => void;
  onView: () => void;
  // Buka OnboardingModal untuk candidate ini. Hanya tampil di menu kalau
  // candidate.status === "hired". Membutuhkan field
  // `onboarding_sent?: boolean` di tipe CandidateRaw (types/candidates.ts).
  onSendOnboarding: (candidate: CandidateRaw) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  // TAMBAHAN: status yang menunggu konfirmasi HR lewat
  // CandidatesStatusConfirmModal — sebelumnya klik Shortlist/Review/Reject
  // langsung memanggil onStatusChange tanpa dialog konfirmasi apa pun,
  // padahal CandidatesStatusConfirmModal sudah dibuat lengkap tapi tidak
  // pernah dirender di mana pun (dead code). Sekarang klik status item
  // cuma men-set pending status ini; eksekusi sungguhan terjadi di
  // handleConfirm setelah HR klik "Ya, ..." di modal.
  const [pendingStatus, setPendingStatus] = useState<ConfirmableStatus | null>(
    null,
  );

  const isLocked = AUTOMATED_STATUSES.includes(
    candidate.status as CandidateStatus,
  );
  // FIX: sebelumnya kondisi ini cek `status === "accepted" || status ===
  // "hired"`. Itu dead code separuh — backend (updateOfferStatus) men-set
  // `status` langsung ke "hired" di baris yang sama saat offer_status
  // jadi "accepted", jadi status "accepted" tidak pernah benar-benar
  // sampai ke UI sebagai nilai `candidate.status` (lihat
  // deriveDisplayStatus di useCandidatesData.ts). Disederhanakan jadi
  // satu-satunya kondisi yang memang bisa terjadi.
  const canSendOnboarding = candidate.status === "hired";

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    // Locked state renders a shorter menu (1 item instead of 4) — kecuali
    // status "hired", yang dapat 1 item tambahan (tombol onboarding).
    const dropdownH = isLocked ? (canSendOnboarding ? 130 : 90) : 160;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < dropdownH ? rect.top - dropdownH - 4 : rect.bottom + 4;
    setPos({ top, left: rect.right - 160 });
  }, [isLocked, canSendOnboarding]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePos();
    setOpen((o) => !o);
  };

  // NOTE: onStatusChange bertipe `(id, status) => void` — tidak ada Promise
  // yang bisa di-await di sini, jadi `loading` di
  // CandidatesStatusConfirmModal tidak benar-benar merepresentasikan
  // request in-flight, cuma menutup modal langsung setelah dipanggil. Kalau
  // onStatusChange di useCandidatesData nanti diubah jadi async, ubah
  // handleConfirm jadi async + await, lalu set loading state asli sebelum
  // setPendingStatus(null).
  const handleConfirm = () => {
    if (!pendingStatus) return;
    onStatusChange(candidate.id, pendingStatus);
    // TAMBAHAN: toast konfirmasi visual setelah status berhasil diubah.
    showStatusToast(pendingStatus, candidate.name);
    setPendingStatus(null);
  };

  const handleCancel = () => setPendingStatus(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  // ── Item aksi (View Detail selalu aktif, tidak terkait status) ─────────
  const viewItem = {
    label: "View Detail",
    icon: Eye,
    action: () => {
      onView();
      setOpen(false);
    },
    color: "#e8f0ec",
  };

  // ── Item status — masing-masing dicek terhadap status kandidat saat ini ─
  const statusItems: Array<{
    label: string;
    status: CandidateStatus;
    icon: React.ElementType;
    color: string;
  }> = [
    {
      label: "Shortlist",
      status: "shortlisted",
      icon: ThumbsUp,
      color: "#10b981",
    },
    {
      label: "In Review",
      status: "review",
      icon: RotateCcw,
      color: "#06b6d4",
    },
    {
      label: "Reject",
      status: "rejected",
      icon: ThumbsDown,
      color: "#f43f5e",
    },
  ];

  const menu = (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="fixed z-[9999] rounded-[10px] overflow-hidden w-44"
            style={{
              top: pos.top,
              left: pos.left,
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
            {/* View Detail */}
            <button
              type="button"
              title={viewItem.label}
              onClick={(e) => {
                e.stopPropagation();
                viewItem.action();
              }}
              className="flex items-center gap-2 w-full px-3 py-[9px] text-[12px] font-semibold text-left transition-colors hover:bg-[rgba(16,185,129,0.06)]"
              style={{ color: viewItem.color }}>
              <viewItem.icon size={12} />
              {viewItem.label}
            </button>

            <div
              className="h-px mx-1"
              style={{ background: "rgba(16,185,129,0.1)" }}
            />

            {/* Status actions — hidden once the candidate is past the
                manual review stage (interview/evaluated/offer
                flow/onboard). Those stages only ever change via their own
                form/flow (Create Interview, Evaluate & Offer, onboarding
                email), not this menu. */}
            {isLocked ? (
              <>
                {/* Tombol Kirim Onboarding Email — hanya untuk status
                    "hired". */}
                {canSendOnboarding && (
                  <button
                    type="button"
                    title={
                      candidate.onboarding_sent
                        ? "Onboarding email sudah dikirim"
                        : "Kirim Onboarding Email"
                    }
                    disabled={candidate.onboarding_sent}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendOnboarding(candidate);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-[9px] text-[12px] font-semibold text-left transition-colors hover:bg-[rgba(16,185,129,0.06)] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ color: "#10b981" }}>
                    <ClipboardList size={12} />
                    {candidate.onboarding_sent
                      ? "Onboarding Terkirim"
                      : "Kirim Onboarding Email"}
                  </button>
                )}
                <div
                  className="flex items-center gap-2 w-full px-3 py-[9px] text-[11px] font-medium text-left"
                  style={{ color: "#5d7a6a" }}>
                  <Lock size={11} />
                  Managed via Interview &amp; Offer flow
                </div>
              </>
            ) : (
              statusItems.map(({ label, status, icon: Icon, color }) => {
                const isActive = candidate.status === status;
                // FIX: sebelumnya hanya `isActive` yang di-cek di sini —
                // kalau kandidat sudah "shortlisted", tombol "In Review"
                // dan "Reject" masih bisa diklik dari dropdown ini (beda
                // dengan CandidatesModal.tsx yang sudah benar pakai
                // isStatusLocked). Begitu juga kalau sudah "rejected",
                // "In Review" dan "Shortlist" seharusnya terkunci. Sekarang
                // pakai aturan yang sama, satu sumber kebenaran, dengan
                // CandidatesModal.
                const isCrossLocked = isStatusLocked(
                  candidate.status as CandidateStatus,
                  status as ConfirmableStatus,
                );
                const disabled = isActive || isCrossLocked;
                return (
                  <button
                    key={status}
                    type="button"
                    title={
                      isActive
                        ? `Kandidat sudah berstatus ${label}`
                        : isCrossLocked
                          ? `Tidak bisa diubah — kandidat sudah ${
                              STATUS_CONFIG[candidate.status as CandidateStatus]
                                ?.label ?? candidate.status
                            }`
                          : `Ubah status ke ${label}`
                    }
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (disabled) return;
                      // FIX: sebelumnya `onStatusChange(candidate.id, status)`
                      // langsung dipanggil di sini tanpa konfirmasi. Sekarang
                      // cuma buka CandidatesStatusConfirmModal — eksekusi
                      // sungguhan pindah ke handleConfirm.
                      setPendingStatus(status as ConfirmableStatus);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 w-full px-3 py-[9px] text-[12px] font-semibold text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      color,
                      background: isActive ? `${color}14` : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!disabled)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "rgba(16,185,129,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!disabled)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "transparent";
                    }}>
                    <span className="flex items-center gap-2">
                      <Icon size={12} />
                      {label}
                    </span>
                    {isActive && <Check size={12} />}
                  </button>
                );
              })
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        title="Candidate action options"
        onClick={handleOpen}
        className="w-7 h-7 flex items-center justify-center rounded-[7px] transition-colors text-[#7a9585] hover:bg-[rgba(16,185,129,0.08)]"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(16,185,129,0.12)",
        }}>
        <MoreHorizontal size={14} />
      </button>
      {typeof document !== "undefined" && createPortal(menu, document.body)}
      {/* TAMBAHAN: konfirmasi sebelum status benar-benar berubah */}
      {pendingStatus && (
        <CandidatesStatusConfirmModal
          status={pendingStatus}
          candidateName={candidate.name}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}