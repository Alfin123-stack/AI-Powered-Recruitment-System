"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

// ── Animated Counter ──────────────────────────────────────────────────────────

export function Counter({
  to,
  suffix = "",
  duration = 2200,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Fade-in on scroll ─────────────────────────────────────────────────────────

export function FadeIn({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

// ── Section tag / pill ────────────────────────────────────────────────────────

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase">
      {children}
    </span>
  );
}

// ── Hoverable content card ────────────────────────────────────────────────────

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  );
}

// ── Floating photo badge ──────────────────────────────────────────────────────

export function PhotoBadge({
  icon,
  label,
  value,
  color,
  borderColor,
  position,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
  borderColor: string;
  position: string; // tailwind absolute positioning classes
}) {
  return (
    <div
      className={`absolute ${position} z-20 bg-[#0a0f0d]/90 backdrop-blur-sm rounded-[12px] px-4 py-3 flex items-center gap-3`}
      style={{ border: `1px solid ${borderColor}` }}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: `${color}20` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-[0.65rem] text-[#7a9585]">{label}</p>
        <p className="text-[0.9rem] font-bold" style={{ color }}>
          {value}
        </p>
      </div>
    </div>
  );
}
