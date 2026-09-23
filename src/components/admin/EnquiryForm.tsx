"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { btn, inputCls } from "./ui";

export function EnquiryForm({
  action,
  status,
  notes,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  status: string;
  notes: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!state.at) return;
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium">Status</span>
        <select name="status" defaultValue={status} className={inputCls}>
          <option value="new">New</option>
          <option value="open">In progress</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium">Internal notes</span>
        <textarea name="notes" defaultValue={notes} rows={5} className={`${inputCls} resize-y`} placeholder="Only visible to admins" />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={btn("primary")}>
          {pending && <Loader2 className="size-4 animate-spin" />} Save
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[#0a7a51]">
            <CheckCircle2 className="size-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
