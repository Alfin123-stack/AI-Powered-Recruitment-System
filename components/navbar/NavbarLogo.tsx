import Link from "next/link";

export default function NavbarLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 no-underline flex-shrink-0"
    >
      <div
        className="
          relative w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden flex-shrink-0
          bg-gradient-to-br from-emerald-400 to-cyan-400
          shadow-[0_0_0_0_rgba(16,185,129,0)]
          transition-all duration-300
          group-hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]
          group-hover:scale-110 group-hover:rotate-[8deg]
        "
      >
        <span className="text-black font-black text-base leading-none">✦</span>
      </div>
      <span className="font-extrabold text-[1.08rem] tracking-[-0.02em] text-[#e8f0ec] leading-none whitespace-nowrap">
        Recruit
        <em className="not-italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          AI
        </em>
      </span>
    </Link>
  );
}
