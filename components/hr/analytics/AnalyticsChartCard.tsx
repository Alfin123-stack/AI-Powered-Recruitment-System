"use client";

import { motion } from "framer-motion";
import { T } from "@/constants/hr/analytics";

interface AnalyticsChartCardProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnalyticsChartCard({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  children,
  delay = 0,
  className = "",
}: AnalyticsChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[18px] p-5 ${className}`}
      style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{ background: iconBg, color: iconColor }}>
            <Icon size={13} />
          </div>
          <div>
            <div
              className="font-bold text-[0.88rem]"
              style={{ color: T.textPrimary }}>
              {title}
            </div>
            {subtitle && (
              <div
                className="text-[0.65rem]"
                style={{ color: T.textSecondary }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}
