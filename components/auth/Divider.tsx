// components/auth/Divider.tsx
export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-emerald-500/10" />
      <span className="text-[#3a5444] text-[0.72rem] whitespace-nowrap font-medium">
        {label}
      </span>
      <div className="flex-1 h-px bg-emerald-500/10" />
    </div>
  );
}
