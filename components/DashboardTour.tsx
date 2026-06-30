"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import type { TourStep } from "@/hooks/dashboard/candidate/useDashboardTour";

interface DashboardTourProps {
  isActive: boolean;
  currentStep: TourStep | undefined;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;
const GAP = 16;
const VIEWPORT_MARGIN = 12;
const TOOLTIP_W = 300;
// Hanya dipakai sebelum ukuran asli tooltip terukur (render pertama).
const TOOLTIP_H_FALLBACK = 220;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Titik di tepi `rect` yang mengarah ke `toward` — dipakai untuk ujung garis penghubung. */
function edgePoint(rect: Rect, toward: { x: number; y: number }) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const halfW = rect.width / 2;
  const halfH = rect.height / 2;
  const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

export default function DashboardTour({
  isActive,
  currentStep,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: DashboardTourProps) {
  const [rect, setRect] = useState<Rect | null>(null);
  const [tooltipSize, setTooltipSize] = useState<{ width: number; height: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const measureTarget = useCallback(() => {
    if (!currentStep) {
      setRect(null);
      return;
    }
    const el = document.querySelector(currentStep.target);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({
      top: r.top - PADDING,
      left: r.left - PADDING,
      width: r.width + PADDING * 2,
      height: r.height + PADDING * 2,
    });
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentStep]);

  useEffect(() => {
    if (!isActive || !currentStep) return;
    setTooltipSize(null); // reset, supaya tidak pakai ukuran step sebelumnya
    measureTarget();
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);
    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
    };
  }, [isActive, currentStep, measureTarget]);

  // Ukur tooltip yang BENAR-BENAR dirender (bukan tebakan), supaya placement
  // & clamping akurat berapa pun panjang teks deskripsinya.
  useLayoutEffect(() => {
    if (!isActive || !currentStep) return;
    const el = tooltipRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setTooltipSize((prev) => {
        if (prev && Math.abs(prev.height - r.height) < 1 && Math.abs(prev.width - r.width) < 1) {
          return prev;
        }
        return { width: r.width, height: r.height };
      });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isActive, currentStep, rect]);

  // Escape key untuk skip
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isActive, onSkip]);

  if (!isActive || !currentStep) return null;

  const placement = currentStep.placement ?? "bottom";
  const tooltipH = tooltipSize?.height ?? TOOLTIP_H_FALLBACK;
  const tooltipW = tooltipSize?.width ?? TOOLTIP_W;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // ── Hitung posisi tooltip ──
  // Kalau target tidak ditemukan, taruh di tengah layar.
  // Kalau ada, taruh di dekat target sesuai placement yang diminta, dengan
  // auto-fallback ke sisi lain bila ruang tidak cukup, lalu CLAMP penuh ke
  // batas viewport memakai ukuran ASLI tooltip — sehingga dijamin tidak
  // pernah terpotong, sekaligus tetap terasa "menempel" pada targetnya.
  const { tooltipTop, tooltipLeft } = (() => {
    if (!rect) {
      return {
        tooltipTop: vh / 2 - tooltipH / 2,
        tooltipLeft: vw / 2 - tooltipW / 2,
      };
    }

    const spaceLeft = rect.left;
    const spaceRight = vw - (rect.left + rect.width);
    const spaceTop = rect.top;
    const spaceBottom = vh - (rect.top + rect.height);

    let resolved = placement;
    if (placement === "left" && spaceLeft < tooltipW + GAP) {
      resolved = spaceRight > spaceLeft ? "right" : spaceBottom > spaceTop ? "bottom" : "top";
    } else if (placement === "right" && spaceRight < tooltipW + GAP) {
      resolved = spaceLeft > spaceRight ? "left" : spaceBottom > spaceTop ? "bottom" : "top";
    } else if (placement === "top" && spaceTop < tooltipH + GAP) {
      resolved = "bottom";
    } else if (placement === "bottom" && spaceBottom < tooltipH + GAP) {
      resolved = spaceTop > spaceBottom ? "top" : "bottom";
    }

    let top: number;
    let left: number;

    switch (resolved) {
      case "top":
        top = rect.top - GAP - tooltipH;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.left - GAP - tooltipW;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.left + rect.width + GAP;
        break;
      case "bottom":
      default:
        top = rect.top + rect.height + GAP;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        break;
    }

    top = clamp(top, VIEWPORT_MARGIN, vh - tooltipH - VIEWPORT_MARGIN);
    left = clamp(left, VIEWPORT_MARGIN, vw - tooltipW - VIEWPORT_MARGIN);

    return { tooltipTop: top, tooltipLeft: left };
  })();

  const tooltipRectNow: Rect = {
    top: tooltipTop,
    left: tooltipLeft,
    width: tooltipW,
    height: tooltipH,
  };

  const targetCenter = rect
    ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    : null;
  const tooltipCenter = {
    x: tooltipRectNow.left + tooltipRectNow.width / 2,
    y: tooltipRectNow.top + tooltipRectNow.height / 2,
  };

  const lineStart = rect && targetCenter ? edgePoint(rect, tooltipCenter) : null;
  const lineEnd = rect && targetCenter ? edgePoint(tooltipRectNow, targetCenter) : null;

  return (
    <AnimatePresence>
      <motion.div
        key="tour-overlay"
        className="fixed inset-0 z-[200]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}>
        {/* ── Dim background dengan lubang spotlight ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {rect && (
                <motion.rect
                  initial={false}
                  animate={{
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  rx={12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(5,10,8,0.78)"
            mask="url(#tour-spotlight-mask)"
          />

          {/* ── Garis penghubung spotlight ↔ tooltip ── */}
          {lineStart && lineEnd && (
            <motion.line
              key={`line-${currentStep.id}`}
              x1={lineStart.x}
              y1={lineStart.y}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke="rgba(16,185,129,0.55)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          )}
          {lineEnd && (
            <motion.circle
              key={`dot-${currentStep.id}`}
              cx={lineEnd.x}
              cy={lineEnd.y}
              r={3.5}
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.25, duration: 0.2 }}
            />
          )}
        </svg>

        {/* ── Border highlight di sekitar target, dengan pulse animasi ── */}
        {rect && (
          <motion.div
            key={`box-${currentStep.id}`}
            initial={false}
            animate={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute rounded-[12px] border-2 border-emerald-400 pointer-events-none">
            <motion.div
              className="absolute inset-0 rounded-[12px]"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(16,185,129,0.35)",
                  "0 0 0 8px rgba(16,185,129,0)",
                ],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>
        )}

        {/* ── Klik di luar tooltip = tidak menutup ── */}
        <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} />

        {/* ── Tooltip: menempel dekat target, posisi & clamp pakai ukuran
             ASLI (terukur dari DOM), jadi dijamin tidak pernah terpotong
             viewport, di placement & panjang teks apa pun. ── */}
        <motion.div
          ref={tooltipRef}
          key={currentStep.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          style={{
            top: tooltipTop,
            left: tooltipLeft,
            visibility: tooltipSize ? "visible" : "hidden",
          }}
          className="fixed z-[210] w-[300px] max-w-[calc(100vw-24px)] max-h-[70vh] overflow-y-auto bg-[#0a0f0c] border border-emerald-500/25 rounded-[14px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <button
            title="Skip tour"
            onClick={onSkip}
            className="absolute top-3 right-3 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer bg-transparent border-0">
            <X size={14} />
          </button>

          <div className="text-[0.6rem] font-bold text-emerald-400 tracking-wide mb-1">
            STEP {stepIndex + 1}/{totalSteps}
          </div>
          <div className="font-bold text-[0.92rem] text-[#e8f0ec] mb-1 pr-4">
            {currentStep.title}
          </div>
          <div className="text-[0.78rem] text-[#9bb3a6] leading-relaxed mb-4">
            {currentStep.description}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              title="Skip the whole tour"
              onClick={onSkip}
              className="text-[0.74rem] text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer bg-transparent border-0">
              Skip
            </button>

            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  title="Previous step"
                  onClick={onPrev}
                  className="flex items-center justify-center w-7 h-7 rounded-[8px] border border-emerald-500/20 text-[#7a9585] hover:text-[#e8f0ec] hover:border-emerald-500/40 transition-all cursor-pointer bg-transparent">
                  <ArrowLeft size={13} />
                </button>
              )}
              <button
                title={stepIndex === totalSteps - 1 ? "Finish" : "Next"}
                onClick={onNext}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3 py-[6px] rounded-[8px] text-[0.76rem] transition-all cursor-pointer border-0">
                {stepIndex === totalSteps - 1 ? "Finish" : "Next"}
                {stepIndex < totalSteps - 1 && <ArrowRight size={12} />}
              </button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-[4px] rounded-full transition-all ${
                  i === stepIndex
                    ? "w-5 bg-emerald-400"
                    : i < stepIndex
                    ? "w-[4px] bg-emerald-500/40"
                    : "w-[4px] bg-white/10"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}