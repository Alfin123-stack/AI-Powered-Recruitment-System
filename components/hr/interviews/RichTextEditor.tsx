"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

// Cek apakah isi rich text kosong. HTML kosong dari Tiptap tetap berupa
// "<p></p>", jadi tag-nya dibuang dulu sebelum di-trim. Dipakai di
// pemanggil untuk validasi form (required) atau untuk cek "HR nulis
// pesan atau tidak" pada field yang optional.
export function isRichTextEmpty(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").trim().length === 0;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Pasangan konversi untuk field yang di hook-nya disimpan sebagai string
// newline-separated (mis. "Dokumen A\nDokumen B"), bukan HTML. Dipakai
// lewat prop `deserialize`/`serialize` di RichTextEditor supaya HR bisa
// mengedit sebagai bullet list beneran, sementara kontrak data ke
// hook/backend tetap plain string seperti sebelumnya — tidak ada
// parsing lain yang perlu diubah.
export function linesToListHtml(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return "<ul><li></li></ul>";
  return `<ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`;
}

export function listHtmlToLines(html: string): string {
  if (typeof window === "undefined") return html;
  const container = document.createElement("div");
  container.innerHTML = html;

  const items = Array.from(container.querySelectorAll("li"))
    .map((li) => (li.textContent ?? "").trim())
    .filter(Boolean);
  if (items.length > 0) return items.join("\n");

  // Fallback kalau HR menghapus semua bullet dan cuma nyisain paragraf
  // biasa — tetap dianggap satu baris per paragraf.
  const paragraphs = Array.from(container.querySelectorAll("p"))
    .map((p) => (p.textContent ?? "").trim())
    .filter(Boolean);
  return paragraphs.join("\n");
}

function ToolbarButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer border"
      style={{
        color: active ? "#10b981" : "#5a8070",
        background: active ? "rgba(16,185,129,0.12)" : "transparent",
        borderColor: active ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.05)",
      }}>
      {icon}
    </button>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-1 px-2 pt-2">
      <ToolbarButton
        icon={<Bold size={12} />}
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={<Italic size={12} />}
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={<List size={12} />}
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={<ListOrdered size={12} />}
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
    </div>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  /** Transform Tiptap's HTML output into whatever string format the
   *  caller's state expects, sebelum dikirim ke `onChange`. Default-nya
   *  identity (HTML dikirim apa adanya). */
  serialize?: (html: string) => string;
  /** Transform nilai yang tersimpan di caller menjadi HTML awal yang
   *  dimengerti Tiptap. Default-nya identity (value dianggap HTML). */
  deserialize?: (value: string) => string;
}

// Editor rich text generik berbasis Tiptap (headless — toolbar & tampilan
// full custom Tailwind, konsisten dengan tema dark/emerald RecruitAI).
// Dipakai di modal manapun yang butuh field teks berformat (bold, list),
// hasilnya disimpan sebagai HTML string lewat `onChange` secara default —
// atau format lain lewat `serialize`/`deserialize` (lihat linesToListHtml
// / listHtmlToLines di atas untuk field yang formatnya newline-separated).
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 110,
  serialize = (html) => html,
  deserialize = (val) => val,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: deserialize(value),
    onUpdate: ({ editor }) => onChange(serialize(editor.getHTML())),
    editorProps: {
      attributes: {
        class: "rich-text-editor-content px-3 pb-2.5 text-[0.82rem] text-[#e8f0ec] focus:outline-none",
        style: `min-height: ${minHeight}px`,
      },
    },
    // Hindari mismatch SSR/hydration di Next.js App Router.
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div
      className="rounded-[10px] transition-all"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <EditorToolbar editor={editor} />
      <div className="h-px bg-white/[0.05] mx-2 my-2" />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .rich-text-editor-content p {
          margin: 0 0 6px 0;
        }
        .rich-text-editor-content ul,
        .rich-text-editor-content ol {
          margin: 0 0 6px 0;
          padding-left: 1.2rem;
        }
        .rich-text-editor-content ul {
          list-style: disc;
        }
        .rich-text-editor-content ol {
          list-style: decimal;
        }
        .rich-text-editor-content strong {
          color: #eafff5;
        }
        .rich-text-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #3d5c49;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}