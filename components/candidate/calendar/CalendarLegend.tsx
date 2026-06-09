const LEGEND_ITEMS = [
  {
    dot: "w-[8px] h-[8px] rounded-[2px] bg-emerald-500/25 ring-1 ring-emerald-500/50",
    label: "Hari ini",
  },
  {
    dot: "w-[6px] h-[6px] rounded-full bg-cyan-400",
    label: "Terjadwal",
  },
  {
    dot: "w-[6px] h-[6px] rounded-full bg-emerald-400",
    label: "Selesai",
  },
  {
    dot: "w-[6px] h-[6px] rounded-full bg-red-400/60",
    label: "Dibatalkan",
  },
];

export default function CalendarLegend() {
  return (
    <div className="flex items-center gap-5 mt-4 pt-4 border-t border-emerald-500/8 flex-wrap">
      {LEGEND_ITEMS.map(({ dot, label }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 text-[0.68rem] text-[#7a9585]">
          <div className={dot} />
          {label}
        </div>
      ))}
    </div>
  );
}
