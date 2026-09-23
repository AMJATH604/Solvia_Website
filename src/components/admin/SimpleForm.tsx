"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { btn, inputCls } from "./ui";

type F = { name: string; label: string; type?: string; defaultValue?: string; autoComplete?: string; help?: string; required?: boolean; accept?: string };

/** Small forms (add admin, account, restore) with inline success/error feedback. */
export function SimpleForm({
  action,
  fields,
  submitLabel,
  resetOnSuccess = false,
  confirm,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  fields: F[];
  submitLabel: string;
  resetOnSuccess?: boolean;
  confirm?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false });
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={ref}
      action={formAction}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className={`block ${f.type === "file" ? "sm:col-span-2" : ""}`}>
            <span className="mb-1.5 block text-[13px] font-medium">{f.label}</span>
            <input
              name={f.name}
              type={f.type || "text"}
              defaultValue={f.defaultValue}
              autoComplete={f.autoComplete}
              required={f.required}
              accept={f.accept}
              className={f.type === "file" ? "block w-full text-[14px] file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-2 file:font-medium" : inputCls}
            />
            {f.help && <span className="mt-1 block text-[12px] text-muted">{f.help}</span>}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={btn("primary")}>
          {pending && <Loader2 className="size-4 animate-spin" />} {submitLabel}
        </button>
        {state.error && <span className="text-[13px] text-red-600">{state.error}</span>}
        {state.ok && state.message && (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[#0a7a51]">
            <CheckCircle2 className="size-4" /> {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
