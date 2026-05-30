// components/auth/ErrorBanner.tsx
export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-start gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-[10px] px-4 py-3">
      <span className="text-red-400 text-[0.85rem] mt-[1px] flex-shrink-0">
        ⚠
      </span>
      <p className="text-red-400 text-[0.82rem] leading-[1.5]">{message}</p>
    </div>
  );
}
