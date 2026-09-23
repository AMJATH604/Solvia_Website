"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Heading2,
  ImagePlus,
  Italic,
  Library,
  Link2,
  List,
  Loader2,
  Plus,
  Quote,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { markdownToHtml } from "@/lib/markdown";
import { ICON_OPTIONS, slugify, type Field } from "@/lib/schema";
import { btn, inputCls } from "./ui";

type Values = Record<string, unknown>;
type Media = { id: string; name: string; url: string; type: string };

/* --------------------------------- Upload -------------------------------- */

export async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/admin/api/upload", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<Media[] | null>(null);
  useEffect(() => {
    fetch("/admin/api/media")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d.filter((m: Media) => m.type.startsWith("image/")) : []))
      .catch(() => setItems([]));
  }, []);
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-forest/30 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Media library"
        className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-semibold">Media library</p>
          <button type="button" onClick={onClose} className={btn("ghost", "sm")} aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          {items === null && <Loader2 className="mx-auto size-5 animate-spin text-muted" />}
          {items?.length === 0 && <p className="py-10 text-center text-muted">No images yet. Upload one first.</p>}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {items?.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => onPick(m.url)}
                className="group overflow-hidden rounded-xl border border-line text-left transition hover:border-brand"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt="" className="aspect-square w-full bg-surface object-cover" />
                <p className="truncate px-2 py-1.5 text-[12px] text-muted">{m.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageField({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-3">
      <div
        className="flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-surface"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files?.[0]);
        }}
      >
        {busy ? (
          <Loader2 className="size-5 animate-spin text-muted" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="size-6 text-ink/30" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/… or https://…" className={inputCls} />
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn("secondary", "sm")} onClick={() => fileRef.current?.click()} disabled={busy}>
            <Upload className="size-3.5" /> Upload
          </button>
          <button type="button" className={btn("secondary", "sm")} onClick={() => setPicker(true)}>
            <Library className="size-3.5" /> Library
          </button>
          {value && (
            <button type="button" className={btn("ghost", "sm")} onClick={() => onChange("")}>
              Remove
            </button>
          )}
        </div>
        {error && <p className="text-[12px] text-red-600">{error}</p>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {picker && (
        <MediaPicker
          onClose={() => setPicker(false)}
          onPick={(url) => {
            onChange(url);
            setPicker(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------- Icon --------------------------------- */

function IconField({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${inputCls} flex items-center gap-2.5 text-left`}
        aria-expanded={open}
      >
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon name={value} className="size-4" />
        </span>
        <span className="flex-1">{value || "Choose icon"}</span>
        <ChevronDown className="size-4 text-ink/40" />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 grid w-[296px] grid-cols-6 gap-1 rounded-xl border border-line bg-white p-2 shadow-xl">
          {ICON_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              title={o.label}
              aria-label={o.label}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`inline-flex size-11 items-center justify-center rounded-lg transition ${
                value === o.value ? "bg-brand text-white" : "text-ink/70 hover:bg-surface"
              }`}
            >
              <Icon name={o.value} className="size-[18px]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Markdown ------------------------------- */

function MarkdownField({ value, onChange, rows = 8, id }: { value: string; onChange: (v: string) => void; rows?: number; id: string }) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after = before, placeholder = "text") => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };
  const linePrefix = (prefix: string) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    onChange(value.slice(0, lineStart) + prefix + value.slice(lineStart));
    requestAnimationFrame(() => el.focus());
  };

  const tools = [
    { icon: Bold, label: "Bold", run: () => wrap("**") },
    { icon: Italic, label: "Italic", run: () => wrap("*") },
    { icon: Heading2, label: "Heading", run: () => linePrefix("## ") },
    { icon: List, label: "List", run: () => linePrefix("- ") },
    { icon: Quote, label: "Quote", run: () => linePrefix("> ") },
    { icon: Link2, label: "Link", run: () => wrap("[", "](https://)", "link text") },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
      <div className="flex items-center justify-between border-b border-line bg-surface/60 px-2 py-1.5">
        <div className="flex gap-0.5">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-2.5 py-1 text-[13px] capitalize ${tab === t ? "bg-white font-medium shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "write" && (
          <div className="flex gap-0.5">
            {tools.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={t.run}
                title={t.label}
                aria-label={t.label}
                className="inline-flex size-8 items-center justify-center rounded-lg text-ink/60 hover:bg-white hover:text-ink"
              >
                <t.icon className="size-4" />
              </button>
            ))}
          </div>
        )}
      </div>
      {tab === "write" ? (
        <textarea
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="block w-full resize-y px-3.5 py-3 font-mono text-[13px] leading-relaxed outline-none"
        />
      ) : (
        <div
          className="prose min-h-[160px] px-4 py-3 !text-[15px]"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(value) || '<p style="opacity:.5">Nothing to preview</p>' }}
        />
      )}
    </div>
  );
}

/* ---------------------------------- Tags --------------------------------- */

function TagsField({ value, onChange, id }: { value: string[]; onChange: (v: string[]) => void; id: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setDraft("");
  };
  return (
    <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border border-line bg-white px-2 py-1.5 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
      {value.map((t, i) => (
        <span key={`${t}-${i}`} className="inline-flex items-center gap-1 rounded-lg bg-surface py-1 pr-1 pl-2.5 text-[13px]">
          {t}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="inline-flex size-5 items-center justify-center rounded-md text-ink/40 hover:bg-white hover:text-ink"
            aria-label={`Remove ${t}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={value.length ? "" : "Type and press Enter"}
        className="min-w-[140px] flex-1 bg-transparent px-1.5 py-1 text-[14px] outline-none placeholder:text-ink/35"
      />
    </div>
  );
}

/* --------------------------------- Objects -------------------------------- */

function ObjectsField({ field, value, onChange }: { field: Field; value: Values[]; onChange: (v: Values[]) => void }) {
  const sub = field.fields || [];
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const blank = () => Object.fromEntries(sub.map((f) => [f.name, f.type === "tags" || f.type === "objects" ? [] : f.type === "boolean" ? false : ""]));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const preview = (v: Values) => String(sub.map((f) => v[f.name]).find((x) => typeof x === "string" && x.trim()) || "Untitled");

  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="rounded-xl border border-line bg-surface/40">
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              type="button"
              onClick={() => setCollapsed((c) => ({ ...c, [i]: !c[i] }))}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
              aria-expanded={!collapsed[i]}
            >
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-white text-[12px] font-semibold text-ink/60 ring-1 ring-line">
                {i + 1}
              </span>
              <span className="truncate font-medium">{preview(v)}</span>
            </button>
            <div className="flex shrink-0 items-center">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={btn("ghost", "sm")} aria-label="Move up">
                <ChevronUp className="size-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className={btn("ghost", "sm")} aria-label="Move down">
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className={`${btn("ghost", "sm")} hover:!text-red-600`}
                aria-label="Remove"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          {!collapsed[i] && (
            <div className="grid gap-4 rounded-b-xl border-t border-line bg-white p-4 md:grid-cols-2">
              {sub.map((f) => (
                <FieldControl
                  key={f.name}
                  field={f}
                  idPrefix={`${field.name}-${i}`}
                  value={v[f.name]}
                  values={v}
                  onChange={(nv) => onChange(value.map((x, j) => (j === i ? { ...x, [f.name]: nv } : x)))}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, blank()])} className={btn("secondary", "sm")}>
        <Plus className="size-3.5" /> Add {field.label.toLowerCase().replace(/s$/, "")}
      </button>
    </div>
  );
}

/* -------------------------------- Dispatcher ------------------------------ */

export function FieldControl({
  field,
  value,
  values,
  onChange,
  idPrefix = "f",
}: {
  field: Field;
  value: unknown;
  values: Values;
  onChange: (v: unknown) => void;
  idPrefix?: string;
}) {
  const id = `${idPrefix}-${field.name}`;
  const str = typeof value === "string" ? value : value == null ? "" : String(value);

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = <textarea id={id} value={str} rows={field.rows || 3} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y leading-relaxed`} placeholder={field.placeholder} />;
      break;
    case "markdown":
      control = <MarkdownField id={id} value={str} rows={field.rows} onChange={onChange} />;
      break;
    case "number":
      control = <input id={id} type="number" value={str} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
      break;
    case "boolean":
      control = (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className="flex items-center gap-3 text-left"
        >
          <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${value ? "bg-brand" : "bg-ink/15"}`}>
            <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
          </span>
          <span className="font-medium">{field.label}</span>
        </button>
      );
      break;
    case "select":
      control = (
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "date":
      control = <input id={id} type="date" value={str.slice(0, 10)} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
      break;
    case "color":
      control = (
        <div className="flex gap-2">
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(str) ? str : "#0ea66e"}
            onChange={(e) => onChange(e.target.value)}
            className="h-[42px] w-14 cursor-pointer rounded-xl border border-line bg-white p-1"
            aria-label={`${field.label} picker`}
          />
          <input id={id} value={str} onChange={(e) => onChange(e.target.value)} className={`${inputCls} font-mono`} placeholder="#0EA66E" />
        </div>
      );
      break;
    case "image":
      control = <ImageField id={id} value={str} onChange={onChange} />;
      break;
    case "icon":
      control = <IconField id={id} value={str} onChange={onChange} />;
      break;
    case "tags":
      control = <TagsField id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
      break;
    case "objects":
      control = <ObjectsField field={field} value={Array.isArray(value) ? (value as Values[]) : []} onChange={onChange} />;
      break;
    case "slug":
      control = (
        <div className="flex">
          <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line bg-surface px-3 text-[13px] text-muted">/</span>
          <input
            id={id}
            value={str}
            onChange={(e) => onChange(slugify(e.target.value) + (e.target.value.endsWith("-") ? "-" : ""))}
            placeholder={slugify(String(values[field.from || "title"] || "")) || "auto-generated"}
            className={`${inputCls} rounded-l-none`}
          />
        </div>
      );
      break;
    default:
      control = (
        <input
          id={id}
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputCls}
        />
      );
  }

  return (
    <div className={field.half ? "" : "md:col-span-2"}>
      {field.type !== "boolean" && (
        <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px] font-medium text-ink/80">
          <span>
            {field.label}
            {field.required && <span className="text-brand"> *</span>}
          </span>
        </label>
      )}
      {control}
      {field.help && <p className="mt-1.5 text-[12px] text-muted">{field.help}</p>}
    </div>
  );
}
