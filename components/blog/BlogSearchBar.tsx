// @/components/blog/BlogSearchBar.tsx
// Komponen presentasional murni — hanya menerima props, tidak ada state sendiri

import { Search } from "lucide-react";

interface BlogSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function BlogSearchBar({ value, onChange, onClear }: BlogSearchBarProps) {
  return (
    <div className="max-w-[1180px] mx-auto px-6 pt-2 pb-6">
      <div
        className="relative max-w-[520px] animate-[fadeInUp_0.65s_0.15s_ease-out_both]"
        style={{ animationFillMode: "both" }}>
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b58] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Cari artikel, tips, atau topik..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0f1612] border border-emerald-500/20 rounded-[10px] pl-10 pr-10 py-[11px] text-[0.9rem] text-[#e8f0ec] placeholder-[#4a6b58] focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6b58] hover:text-emerald-400 transition-colors text-[0.75rem] cursor-pointer">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
