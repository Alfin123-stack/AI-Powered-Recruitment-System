"use client";

import { motion } from "framer-motion";
import AnimatedBar from "./AnalyzeAnimatedBar";
import { getScoreColor } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  sub: string;
  primary?: boolean;
  delay?: number;
};

export default function ScoreBlock({
  label,
  value,
  sub,
  primary = false,
  delay = 0,
}: Props) {
  const accent = getScoreColor(value);
  const bg = primary ? accent : "rgba(255,255,255,0.025)";
  const border = primary ? accent : "rgba(255,255,255,0.07)";
  const valueColor = primary ? "rgba(10,15,12,0.92)" : accent;
  const labelColor = primary ? "rgba(10,15,12,0.55)" : "rgba(255,255,255,0.28)";
  const subColor = primary ? "rgba(10,15,12,0.45)" : "rgba(255,255,255,0.22)";
  const suffixColor = primary
    ? "rgba(10,15,12,0.35)"
    : "rgba(255,255,255,0.18)";
  const badgeBg = primary ? "rgba(10,15,12,0.14)" : `${accent}18`;
  const badgeColor = primary ? "rgba(10,15,12,0.85)" : accent;
  const barFill = primary ? "rgba(10,15,12,0.7)" : accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-[12px] p-4"
      style={{ background: bg, border: `1px solid ${border}` }}>
      <div
        className="text-[9.5px] font-bold tracking-[0.08em] uppercase mb-2"
        style={{ color: labelColor }}>
        {label}
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span
          className="font-black leading-none"
          style={{ fontSize: primary ? 40 : 28, color: valueColor }}>
          {value}
        </span>
        <span
          className="font-medium mb-[3px]"
          style={{
            fontSize: primary ? 14 : 12,
            color: suffixColor,
          }}>
          /100
        </span>
        <span
          className="mb-[3px] text-[10.5px] font-bold px-[7px] py-[2px] rounded-[5px]"
          style={{
            background: badgeBg,
            color: badgeColor,
            marginLeft: "auto",
          }}>
          {value}
        </span>
      </div>
      <AnimatedBar
        value={value}
        color={barFill}
        delay={delay * 1000 + 300}
        height={primary ? 5 : 3}
      />
      <div className="text-[10px] mt-[6px]" style={{ color: subColor }}>
        {sub}
      </div>
    </motion.div>
  );
}