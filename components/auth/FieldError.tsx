// components/auth/FieldError.tsx
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-[5px] text-[0.72rem] text-red-400 animate-[fadeSlideIn_0.2s_ease-out]">
      <span>⚠</span>
      {message}
    </p>
  );
}
