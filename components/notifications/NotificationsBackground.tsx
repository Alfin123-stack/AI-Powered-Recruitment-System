

export default function NotificationsBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-48 -right-48 w-[520px] h-[520px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #34d399, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.025]"
        style={{
          background: "radial-gradient(circle, #38bdf8, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.015]"
        style={{
          background: "radial-gradient(circle, #a78bfa, transparent 70%)",
        }}
      />
    </div>
  );
}
