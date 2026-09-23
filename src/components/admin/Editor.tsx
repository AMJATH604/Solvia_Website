"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import type { Section } from "@/lib/schema";
import { FieldControl } from "./fields";
import { btn, Card } from "./ui";

type Values = Record<string, unknown>;

function Toast({ state }: { state: ActionState }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!state.at && !state.error) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), state.error ? 6000 : 2800);
    return () => clearTimeout(t);
  }, [state]);
  if (!visible) return null;
  return (
    <div
      role="status"
      className={`fixed right-4 bottom-4 z-[80] flex max-w-sm items-start gap-2.5 rounded-xl px-4 py-3 text-[14px] shadow-2xl ${
        state.error ? "bg-red-600 text-white" : "bg-forest text-white"
      }`}
    >
      {state.error ? <TriangleAlert className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-mint" />}
      {state.error || state.message}
    </div>
  );
}

export function Editor({
  sections,
  initial,
  action,
  mode = "sections",
  publishable = false,
  aside,
  submitLabel = "Publish changes",
}: {
  sections: Section[];
  initial: Values;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  mode?: "sections" | "item";
  publishable?: boolean;
  aside?: React.ReactNode;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Values>(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [state, formAction, pending] = useActionState(action, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);
  const formId = `editor-${useId().replace(/:/g, "")}`;
  const dirty = JSON.stringify(values) !== baseline;

  // After a successful save, the saved values become the new baseline.
  const lastSaved = useRef<string>("");
  useEffect(() => {
    if (state.ok && state.at) setBaseline(lastSaved.current);
  }, [state]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [dirty]);

  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));
  const serialized = JSON.stringify(values);

  const saveButton = (
    <button type="submit" form={formId} disabled={pending} className={btn("primary")}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Saving…" : submitLabel}
    </button>
  );

  const status = (
    <span className="inline-flex items-center gap-2 text-[13px] text-muted">
      <span className={`size-2 rounded-full ${dirty ? "bg-amber-500" : "bg-brand"}`} />
      {dirty ? "Unsaved changes" : "All changes saved"}
    </span>
  );

  const form = (
    <form
      id={formId}
      ref={formRef}
      action={(fd) => {
        lastSaved.current = serialized;
        return formAction(fd);
      }}
      className="space-y-6"
    >
      <input type="hidden" name="data" value={serialized} />
      {sections.map((section) => (
        <Card key={section.title} className="scroll-mt-24 p-6 md:p-7">
          <div id={`s-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="scroll-mt-24">
            <h2 className="text-[16px] font-semibold">{section.title}</h2>
            {section.description && <p className="mt-0.5 text-muted">{section.description}</p>}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {section.fields.map((f) => (
              <FieldControl key={f.name} field={f} value={values[f.name]} values={values} onChange={(v) => set(f.name, v)} />
            ))}
          </div>
        </Card>
      ))}
    </form>
  );

  if (mode === "item") {
    return (
      <>
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
          {form}
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="p-5">
              {publishable && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(values.published)}
                  onClick={() => set("published", !values.published)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-surface px-3.5 py-3 text-left"
                >
                  <span>
                    <span className="block font-medium">{values.published ? "Published" : "Draft"}</span>
                    <span className="block text-[12px] text-muted">{values.published ? "Visible on the website" : "Hidden from the website"}</span>
                  </span>
                  <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${values.published ? "bg-brand" : "bg-ink/15"}`}>
                    <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${values.published ? "left-[22px]" : "left-0.5"}`} />
                  </span>
                </button>
              )}
              <div className="mt-4 flex flex-col gap-3">
                {saveButton}
                <div className="text-center">{status}</div>
              </div>
              <p className="mt-3 text-center text-[12px] text-ink/40">Tip: press ⌘S / Ctrl+S to save</p>
            </Card>
            {aside}
          </div>
        </div>
        <Toast state={state} />
      </>
    );
  }

  return (
    <>
      <div className="sticky top-16 z-20 -mx-4 mb-6 flex items-center justify-between gap-4 border-b border-line bg-[#F7F9F8]/90 px-4 py-3 backdrop-blur-xl md:-mx-8 md:px-8">
        <nav aria-label="Sections" className="hidden gap-1 overflow-x-auto md:flex">
          {sections.map((s) => (
            <a
              key={s.title}
              href={`#s-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="rounded-lg px-2.5 py-1.5 text-[13px] whitespace-nowrap text-muted hover:bg-white hover:text-ink"
            >
              {s.title}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {status}
          {saveButton}
        </div>
      </div>
      {form}
      <Toast state={state} />
    </>
  );
}
