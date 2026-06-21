"use client";

import { useEffect, useRef } from "react";

export function useOutsideClick(
  refs: React.RefObject<HTMLElement | null>[],
  callbacks: (() => void)[],
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      refs.forEach((ref, i) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          callbacks[i]?.();
        }
      });
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
}
