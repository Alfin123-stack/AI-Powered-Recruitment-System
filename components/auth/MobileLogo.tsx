// components/auth/MobileLogo.tsx
export function MobileLogo() {
  return (
    <div className="flex lg:hidden items-center justify-center gap-[9px] mb-8">
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center font-black text-black text-[1rem]
        bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
        ✦
      </div>
      <span className="font-syne text-[1.25rem] font-extrabold tracking-[-0.02em] text-[#e8f0ec]">
        Recruit
        <em className="not-italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          AI
        </em>
      </span>
    </div>
  );
}
