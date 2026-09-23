"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { submitEnquiry, type ContactState } from "./actions";

const input =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/35 transition outline-none focus:border-brand focus:ring-4 focus:ring-brand/10";

function Chips({ name, options, defaultValue }: { name: string; options: string[]; defaultValue?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o} className="cursor-pointer">
          <input type="radio" name={name} value={o} defaultChecked={defaultValue === o} className="peer sr-only" />
          <span className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm text-ink/75 transition peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-brand/20 hover:border-ink/25">
            {o}
          </span>
        </label>
      ))}
    </div>
  );
}

export function ContactForm({ services, budgets, success }: { services: string[]; budgets: string[]; success: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitEnquiry, { ok: false });

  if (state.ok) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-5xl border border-line bg-white p-10 text-center">
        <svg viewBox="0 0 100 100" className="draw-check size-20" aria-hidden="true">
          <rect width="100" height="100" rx="26" fill="var(--accent)" />
          <path d="M29 52 L44 67 L72 33" pathLength={1} fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="mt-8 text-3xl font-semibold tracking-tight">Message received.</h2>
        <p className="mt-3 max-w-sm text-muted">{success}</p>
      </div>
    );
  }

  const f = state.fields || {};
  return (
    <form action={action} className="rounded-5xl border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(12,26,20,0.4)] md:p-10" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Name *</span>
          <input name="name" required autoComplete="name" defaultValue={f.name} className={input} placeholder="Your full name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Work email *</span>
          <input name="email" type="email" required autoComplete="email" defaultValue={f.email} className={input} placeholder="you@company.com" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Company</span>
          <input name="company" autoComplete="organization" defaultValue={f.company} className={input} placeholder="Company name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" defaultValue={f.phone} className={input} placeholder="+91" />
        </label>
      </div>

      {services.length > 0 && (
        <fieldset className="mt-7">
          <legend className="mb-3 text-sm font-medium">What do you need help with?</legend>
          <Chips name="service" options={services} defaultValue={f.service} />
        </fieldset>
      )}
      {budgets.length > 0 && (
        <fieldset className="mt-7">
          <legend className="mb-3 text-sm font-medium">Estimated budget</legend>
          <Chips name="budget" options={budgets} defaultValue={f.budget} />
        </fieldset>
      )}

      <label className="mt-7 block">
        <span className="mb-2 block text-sm font-medium">Tell us about the problem *</span>
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={f.message}
          className={`${input} resize-y`}
          placeholder="What's slowing you down? What would 'solved' look like?"
        />
      </label>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">We reply within one business day.</p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 font-medium text-white transition hover:bg-black disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {pending ? "Sending…" : "Send message"}
          {!pending && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
        </button>
      </div>
    </form>
  );
}
