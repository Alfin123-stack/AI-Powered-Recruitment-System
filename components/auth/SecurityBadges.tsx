// components/auth/SecurityBadges.tsx
import { Lock, ShieldCheck, DatabaseZap } from "lucide-react";

const DEFAULT_BADGES = [
  {
    icon: <Lock size={11} />,
    label: "SSL Encrypted",
    iconColor: "#0F6E56", // teal — enkripsi/keamanan koneksi
  },
  {
    icon: <ShieldCheck size={11} />,
    label: "PDPA Compliant",
    iconColor: "#185FA5", // biru — kepatuhan regulasi/legalitas
  },
  {
    icon: <DatabaseZap size={11} />,
    label: "Data Aman",
    iconColor: "#534AB7", // ungu — data/sistem
  },
];

export function SecurityBadges({
  badges = DEFAULT_BADGES,
}: {
  badges?: { icon: React.ReactNode; label: string; iconColor?: string }[];
}) {
  return (
    <div className="flex items-center justify-center gap-[10px] flex-wrap">
      {badges.map((b, i) => (
        <span
          key={i}
          className="flex items-center gap-[5px] text-[#2e4a3a] text-[0.68rem] font-medium">
          <span style={{ color: b.iconColor ?? "inherit" }}>{b.icon}</span>
          {b.label}
          {i < badges.length - 1 && (
            <span className="ml-[10px] w-[3px] h-[3px] rounded-full bg-[#2e4a3a]" />
          )}
        </span>
      ))}
    </div>
  );
}
