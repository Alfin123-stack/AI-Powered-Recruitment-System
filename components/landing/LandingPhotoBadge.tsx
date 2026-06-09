import { ReactNode } from "react";

export function LandingPhotoBadge({
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
  position: string;
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
