// hooks/auth/usePasswordToggle.ts
import { useState, useCallback } from "react";

/**
 * usePasswordToggle
 * Manages show/hide password visibility state.
 *
 * @returns showPass   – current visibility boolean
 * @returns togglePass – flip visibility
 * @returns inputType  – "text" | "password" (ready for <input type={inputType}>)
 */
export function usePasswordToggle() {
  const [showPass, setShowPass] = useState(false);

  const togglePass = useCallback(() => setShowPass((prev) => !prev), []);

  return {
    showPass,
    togglePass,
    inputType: showPass ? ("text" as const) : ("password" as const),
  } as const;
}
