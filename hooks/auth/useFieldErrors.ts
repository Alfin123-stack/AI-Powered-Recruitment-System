// hooks/auth/useFieldErrors.ts
import { useState, useCallback } from "react";
import { type AuthFieldErrors }  from "@/lib/auth/validation";

/**
 * useFieldErrors
 * Manages per-field validation error state.
 *
 * @returns fieldErrors    – current error map
 * @returns setFieldErrors – replace entire error map
 * @returns clearError     – clear a single field error
 * @returns clearAll       – clear all field errors
 */
export function useFieldErrors() {
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const clearError = useCallback(
    (field: keyof AuthFieldErrors) =>
      setFieldErrors((prev) => ({ ...prev, [field]: undefined })),
    []
  );

  const clearAll = useCallback(() => setFieldErrors({}), []);

  return { fieldErrors, setFieldErrors, clearError, clearAll } as const;
}
