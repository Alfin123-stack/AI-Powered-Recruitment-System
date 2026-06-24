"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Loader2, RotateCcw, ChevronDown } from "lucide-react";
import { DashboardContext } from "@/context/DashboardContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant";
  content: string;
};

// ─── Inline styles (no Tailwind purge risk for dynamic values) ────────────────

const S = {
  overlay: {
    position: "fixed" as const,
    bottom: "88px",
    right: "24px",
    zIndex: 9999,
    width: "360px",
    maxHeight: "520px",
    display: "flex",
    flexDirection: "column" as const,
    borderRadius: "16px",
    overflow: "hidden",
    background: "#0a0f0d",
    border: "1px solid rgba(16,185,129,0.18)",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.06)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    background: "#0d1510",
    borderBottom: "1px solid rgba(16,185,129,0.12)",
    flexShrink: 0,
  },
  headerIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "14px 14px 8px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    scrollbarWidth: "none" as const,
  },
  bubble: (role: "user" | "assistant") => ({
    maxWidth: "88%",
    alignSelf: role === "user" ? "flex-end" : ("flex-start" as const),
    padding: "9px 13px",
    borderRadius:
      role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
    fontSize: "0.8rem",
    lineHeight: "1.55",
    background:
      role === "user"
        ? "rgba(16,185,129,0.15)"
        : "rgba(255,255,255,0.04)",
    border:
      role === "user"
        ? "1px solid rgba(16,185,129,0.25)"
        : "1px solid rgba(255,255,255,0.07)",
    color: role === "user" ? "#d1fae5" : "#c8ddd3",
    wordBreak: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
  }),
  inputRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    padding: "12px 14px",
    borderTop: "1px solid rgba(16,185,129,0.1)",
    background: "#0a0f0d",
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    resize: "none" as const,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(16,185,129,0.18)",
    borderRadius: "10px",
    color: "#e8f0ec",
    fontSize: "0.8rem",
    padding: "9px 12px",
    outline: "none",
    lineHeight: "1.5",
    maxHeight: "96px",
    overflowY: "auto" as const,
    fontFamily: "inherit",
    scrollbarWidth: "none" as const,
  },
  sendBtn: (disabled: boolean) => ({
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled
      ? "rgba(16,185,129,0.08)"
      : "rgba(16,185,129,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.2s",
  }),
  fab: {
    position: "fixed" as const,
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "1.5px solid rgba(16,185,129,0.35)",
    background: "#0d1510",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.55), 0 0 0 1px rgba(16,185,129,0.08)",
  },
};

// ─── Quick suggestions per role ───────────────────────────────────────────────

const SUGGESTIONS = {
  hr: [
    "Tampilkan top kandidat per posisi",
    "Cari kandidat untuk Backend Developer",
    "Cara membuat lowongan baru?",
  ],
  candidate: [
    "Bagaimana cara menganalisis resume?",
    "Cara melamar pekerjaan di sini?",
    "Apa itu ATS Score?",
  ],
};

// ─── Robot SVG icon (custom, bukan lucide) ────────────────────────────────────

function RobotIcon({ size = 24, color = "#10b981" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="8" width="14" height="10" rx="3" stroke={color} strokeWidth="1.6" />
      <rect x="9" y="11" width="2" height="2" rx="0.5" fill={color} />
      <rect x="13" y="11" width="2" height="2" rx="0.5" fill={color} />
      <path d="M9 16h6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 8V5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="4.5" r="1" fill={color} />
      <path d="M5 13H3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 13h-2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ─── Loading dots ─────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "4px", padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#10b981",
            display: "block",
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChatbotWidget() {
  const { token, user } = useContext(DashboardContext);
  const role = (user?.role ?? "candidate") as "hr" | "candidate";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus textarea when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, [open]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    const nextHistory = [...messages, userMsg];

    setMessages(nextHistory);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: msg,
            conversationHistory: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }
      );

      if (!res.ok) throw new Error("API error");

      const data = (await res.json()) as { reply: string };
      setMessages([...nextHistory, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...nextHistory,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const resetChat = () => setMessages([]);

  const suggestions = SUGGESTIONS[role];

  return (
    <>
      {/* ── Floating Action Button ── */}
      <motion.button
        style={S.fab}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Buka chatbot"
        title="AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <ChevronDown size={20} color="#10b981" />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <RobotIcon size={22} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <motion.span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1.5px solid rgba(16,185,129,0.4)",
              pointerEvents: "none",
            }}
            animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            style={S.overlay}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div style={S.header}>
              <div style={S.headerIcon}>
                <RobotIcon size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#e8f0ec",
                    lineHeight: 1,
                  }}
                >
                  AI Assistant
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#4a6a5a",
                    marginTop: "2px",
                  }}
                >
                  {role === "hr" ? "HR · Rekrutmen & Kandidat" : "Kandidat · Karier & Lamaran"}
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {messages.length > 0 && (
                  <button
                    onClick={resetChat}
                    title="Reset percakapan"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "6px",
                      color: "#4a6a5a",
                      display: "flex",
                    }}
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  title="Tutup"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "6px",
                    color: "#4a6a5a",
                    display: "flex",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={S.messages}>
              {messages.length === 0 && (
                <div style={{ padding: "4px 0 8px" }}>
                  {/* Welcome */}
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 10px",
                      }}
                    >
                      <RobotIcon size={22} />
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#c8ddd3",
                        marginBottom: "4px",
                      }}
                    >
                      Halo! Ada yang bisa saya bantu?
                    </div>
                    <div
                      style={{ fontSize: "0.72rem", color: "#4a6a5a" }}
                    >
                      Tanya seputar platform atau{" "}
                      {role === "hr" ? "data kandidat" : "karier kamu"}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => void sendMessage(s)}
                        style={{
                          textAlign: "left",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(16,185,129,0.13)",
                          borderRadius: "9px",
                          padding: "8px 12px",
                          fontSize: "0.75rem",
                          color: "#7a9585",
                          cursor: "pointer",
                          transition: "background 0.15s, color 0.15s",
                          lineHeight: 1.4,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(16,185,129,0.08)";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#a7c4b2";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(255,255,255,0.03)";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#7a9585";
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div style={S.bubble(m.role)}>{m.content}</div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px 12px 12px 3px",
                    padding: "8px 12px",
                  }}
                >
                  <TypingDots />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input row */}
            <div style={S.inputRow}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan… (Enter untuk kirim)"
                rows={1}
                style={S.textarea}
                disabled={loading}
              />
              <button
                onClick={() => void sendMessage()}
                disabled={!input.trim() || loading}
                style={S.sendBtn(!input.trim() || loading)}
                aria-label="Kirim pesan"
              >
                {loading ? (
                  <Loader2 size={15} color="#10b981" className="animate-spin" />
                ) : (
                  <Send size={15} color={!input.trim() ? "#2d4a3a" : "#fff"} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
