import { useState, useRef, useEffect } from "react";

export function useInterviewMoreDropdown() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + 6,
        right: window.innerWidth - r.right,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Recompute position on scroll/resize while open, so the dropdown
    // stays anchored to its trigger button instead of drifting.
    const reposition = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + 6,
        right: window.innerWidth - r.right,
      });
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    const h = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !dropRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", h);

    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("mousedown", h);
    };
  }, [open]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return { open, toggle, close, pos, btnRef, dropRef };
}