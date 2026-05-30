// SERVER Component — tidak ada directive "use client".
// Pure render badge tipe pekerjaan (Full-time, Part-time, dsb).
// Tidak ada hooks atau browser API.

import { TYPE_COLORS } from "./detailConstants";

type TypeBadgeProps = {
  type: string;
};

export default function TypeBadge({ type }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] || "#5d7a6a";

  return (
    <span
      className="text-[0.65rem] font-semibold px-[8px] py-[3px] rounded-[4px]"
      style={{
        background: `${color}18`,
        color,
        border: `0.5px solid ${color}35`,
      }}
    >
      {type}
    </span>
  );
}
