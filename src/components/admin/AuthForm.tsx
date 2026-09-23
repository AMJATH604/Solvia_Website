"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { inputCls } from "./ui";

type FieldDef = { name: string; label: string; type?: string; autoComplete?: string; placeholder?: string };

export function AuthForm({
  action,
  fields,
  submitLabel,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  fields: FieldDef[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false });
  return (
    <form action={formAction} className="space-y-4">
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ink/80">{f.label}</span>
          <input
            name={f.name}
            type={f.type || "text"}
            required
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            className={`${inputCls} h-11`}
          />
        </label>
      ))}
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-forest font-medium text-white transition hover:bg-black disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {submitLabel}
        {!pending && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
      </button>
    </form>
  );
}
