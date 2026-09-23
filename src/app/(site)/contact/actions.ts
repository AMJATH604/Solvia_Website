"use server";

import { clientIp, rateLimit } from "@/lib/auth";
import { mutate, newId } from "@/lib/store";

export type ContactState = { ok: boolean; error?: string; fields?: Record<string, string> };

const clean = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").trim().slice(0, max);

export async function submitEnquiry(_prev: ContactState, form: FormData): Promise<ContactState> {
  const fields = {
    name: clean(form.get("name"), 120),
    email: clean(form.get("email"), 200),
    company: clean(form.get("company"), 160),
    phone: clean(form.get("phone"), 40),
    service: clean(form.get("service"), 80),
    budget: clean(form.get("budget"), 80),
    message: clean(form.get("message"), 5000),
  };

  // Honeypot: real people never fill this hidden field.
  if (clean(form.get("website"))) return { ok: true };

  if (!fields.name || !fields.email || !fields.message) {
    return { ok: false, error: "Please fill in your name, email and a short message.", fields };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { ok: false, error: "That email address doesn't look right.", fields };
  }

  const ip = await clientIp();
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
    return { ok: false, error: "Too many messages in a short time. Please try again in a few minutes.", fields };
  }

  await mutate((db) => {
    db.enquiries.unshift({
      id: newId(),
      ...fields,
      status: "new",
      notes: "",
      createdAt: new Date().toISOString(),
      ip,
    });
  });

  return { ok: true };
}
