type TypeBadgeProps = {
  type: string | null;
};

export default function TypeBadge({ type }: TypeBadgeProps) {
  const color = "#5d7a6a";

  return (
    <span
      className="text-[0.65rem] font-semibold px-[8px] py-[3px] rounded-[4px]"
      style={{
        background: `${color}18`,
        color,
        border: `0.5px solid ${color}35`,
      }}>
      {type}
    </span>
  );
}
