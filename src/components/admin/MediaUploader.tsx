"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Check, Copy, Loader2, UploadCloud } from "lucide-react";
import { uploadFile } from "./fields";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setErrors([]);
    setBusy(files.length);
    const errs: string[] = [];
    for (const f of Array.from(files)) {
      try {
        await uploadFile(f);
      } catch (e) {
        errs.push(`${f.name}: ${(e as Error).message}`);
      }
      setBusy((n) => n - 1);
    }
    setErrors(errs);
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          upload(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          over ? "border-brand bg-brand/5" : "border-line bg-white hover:border-ink/25"
        }`}
      >
        {busy ? <Loader2 className="size-7 animate-spin text-brand" /> : <UploadCloud className="size-7 text-ink/40" />}
        <p className="mt-3 font-medium">{busy ? `Uploading ${busy} file${busy > 1 ? "s" : ""}…` : "Drop files here or click to upload"}</p>
        <p className="mt-1 text-[13px] text-muted">PNG, JPG, WebP, GIF, AVIF, SVG or PDF · up to 10 MB each</p>
      </button>
      <input ref={ref} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => upload(e.target.files)} />
      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-xl bg-red-50 p-3 text-[13px] text-red-700">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex size-8 items-center justify-center rounded-lg text-ink/55 hover:bg-surface hover:text-ink"
      title="Copy URL"
      aria-label="Copy URL"
    >
      {copied ? <Check className="size-4 text-brand" /> : <Copy className="size-4" />}
    </button>
  );
}
