"use client";

import { useState, useEffect } from "react";

type Props = {
  value: number;
  color: string;
  delay?: number;
  height?: number;
};

export default function AnimatedBar({
  value,
  color,
  delay = 0,
  height = 4,
}: Props) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: color,
          transition: "width 1.1s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}
