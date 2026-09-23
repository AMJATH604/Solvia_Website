"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clientIp,
  createSession,
  destroySession,
  hashPassword,
  rateLimit,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import { COLLECTIONS, getCollection, getSingleton, slugify, type Item } from "@/lib/schema";
import { missingRequired, sanitizeFields } from "@/lib/sanitize";
import { mutate, newId, readDb, UPLOAD_DIR, type EnquiryStatus } from "@/lib/store";

export type ActionState = { ok: boolean; error?: string; message?: string; at?: number };

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function refreshSite() {
  revalidatePath("/", "layout");
}

/* ------------------------------- Auth -------------------------------- */

export async function loginAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const email = str(form.get("email")).toLowerCase();
  const password = String(form.get("password") ?? "");
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 10, 15 * 60_000)) {
    return { ok: false, error: "Too many attempts. Wait 15 minutes and try again." };
  }
  const db = await readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: "Incorrect email or password." };
  }
  await mutate((d) => {
    const u = d.users.find((x) => x.id === user.id);
    if (u) u.lastLoginAt = new Date().toISOString();
  });
  await createSession(user);
  redirect("/admin");
}

export async function setupAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const name = str(form.get("name"));
  const email = str(form.get("email")).toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!name || !emailOk(email)) return { ok: false, error: "Enter your name and a valid email." };
  if (password.length < 10) return { ok: false, error: "Use a password of at least 10 characters." };
  if (password !== String(form.get("confirm") ?? "")) return { ok: false, error: "Passwords don't match." };

  const user = await mutate((db) => {
    if (db.users.length > 0) return null; // Setup only works once.
    const u = { id: newId(), name, email, passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
    db.users.push(u);
    return u;
  });
  if (!user) redirect("/admin/login");
  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ----------------------------- Singletons ----------------------------- */

export async function saveSingletonAction(key: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();
  const def = getSingleton(key);
  if (!def) return { ok: false, error: "Unknown section." };
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return { ok: false, error: "Could not read the form." };
  }
  const fields = def.sections.flatMap((s) => s.fields);
  const data = sanitizeFields(fields, input);
  const missing = missingRequired(fields, data);
  if (missing.length) return { ok: false, error: `Please fill in: ${missing.join(", ")}` };
  await mutate((db) => {
    db.singletons[key] = { ...db.singletons[key], ...data, _updatedAt: new Date().toISOString() };
  });
  refreshSite();
  return { ok: true, message: "Changes published", at: Date.now() };
}

/* ----------------------------- Collections ---------------------------- */

export async function saveItemAction(
  key: string,
  id: string,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireUser();
  const def = getCollection(key);
  if (!def) return { ok: false, error: "Unknown collection." };
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return { ok: false, error: "Could not read the form." };
  }
  const data = sanitizeFields(def.fields, input);
  const published = input.published === true;
  const missing = missingRequired(def.fields, data);
  if (missing.length) return { ok: false, error: `Please fill in: ${missing.join(", ")}` };

  const slugField = def.fields.find((f) => f.type === "slug");
  const result = await mutate((db) => {
    const items = (db.collections[key] ??= []);
    const isNew = id === "new";
    if (slugField) {
      let slug = slugify(String(data[slugField.name] || data[slugField.from || def.titleField] || "")) || newId();
      const taken = (s: string) => items.some((i) => i.slug === s && i.id !== id);
      for (let n = 2; taken(slug); n++) slug = `${slugify(String(data[slugField.name] || data[def.titleField]))}-${n}`;
      data[slugField.name] = slug;
    }
    const now = new Date().toISOString();
    if (isNew) {
      const item = {
        ...data,
        id: newId(),
        published,
        order: items.reduce((m, i) => Math.max(m, i.order ?? 0), -1) + 1,
        createdAt: now,
        updatedAt: now,
      } as Item;
      items.push(item);
      return item.id;
    }
    const existing = items.find((i) => i.id === id);
    if (!existing) return null;
    Object.assign(existing, data, { published, updatedAt: now });
    return existing.id;
  });
  if (!result) return { ok: false, error: "This item no longer exists." };
  refreshSite();
  if (id === "new") redirect(`/admin/collections/${key}/${result}?created=1`);
  return { ok: true, message: published ? "Published" : "Saved as draft", at: Date.now() };
}

export async function deleteItemAction(key: string, id: string) {
  await requireUser();
  if (!getCollection(key)) return;
  await mutate((db) => {
    db.collections[key] = (db.collections[key] || []).filter((i) => i.id !== id);
  });
  refreshSite();
  redirect(`/admin/collections/${key}`);
}

export async function duplicateItemAction(key: string, id: string) {
  await requireUser();
  if (!getCollection(key)) return;
  const def = getCollection(key);
  const newItemId = await mutate((db) => {
    const items = db.collections[key] || [];
    const src = items.find((i) => i.id === id);
    if (!src || !def) return null;
    const now = new Date().toISOString();
    const copy = {
      ...structuredClone(src),
      id: newId(),
      published: false,
      order: items.reduce((m, i) => Math.max(m, i.order ?? 0), -1) + 1,
      createdAt: now,
      updatedAt: now,
    } as Item;
    copy[def.titleField] = `${String(src[def.titleField] ?? "")} (copy)`;
    if (typeof src.slug === "string") copy.slug = `${src.slug}-copy-${copy.id.slice(0, 4)}`;
    items.push(copy);
    return copy.id;
  });
  if (newItemId) redirect(`/admin/collections/${key}/${newItemId}`);
}

export async function togglePublishAction(key: string, id: string) {
  await requireUser();
  if (!getCollection(key)) return;
  await mutate((db) => {
    const item = (db.collections[key] || []).find((i) => i.id === id);
    if (item) {
      item.published = !item.published;
      item.updatedAt = new Date().toISOString();
    }
  });
  refreshSite();
  revalidatePath(`/admin/collections/${key}`);
}

export async function moveItemAction(key: string, id: string, direction: "up" | "down") {
  await requireUser();
  if (!getCollection(key)) return;
  await mutate((db) => {
    const items = [...(db.collections[key] || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const i = items.findIndex((x) => x.id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    items.forEach((item, idx) => (item.order = idx));
  });
  refreshSite();
  revalidatePath(`/admin/collections/${key}`);
}

/* ------------------------------ Enquiries ----------------------------- */

export async function updateEnquiryAction(id: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();
  const status = str(form.get("status")) as EnquiryStatus;
  const notes = String(form.get("notes") ?? "").slice(0, 10_000);
  await mutate((db) => {
    const e = db.enquiries.find((x) => x.id === id);
    if (!e) return;
    if (["new", "open", "replied", "archived"].includes(status)) e.status = status;
    e.notes = notes;
  });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Enquiry updated", at: Date.now() };
}

export async function deleteEnquiryAction(id: string) {
  await requireUser();
  await mutate((db) => {
    db.enquiries = db.enquiries.filter((e) => e.id !== id);
  });
  revalidatePath("/admin", "layout");
  redirect("/admin/enquiries");
}

/* -------------------------------- Media -------------------------------- */

export async function deleteMediaAction(id: string) {
  await requireUser();
  const file = await mutate((db) => {
    const m = db.media.find((x) => x.id === id);
    db.media = db.media.filter((x) => x.id !== id);
    return m?.file;
  });
  if (file && /^[a-z0-9-]+\.[a-z0-9]+$/i.test(file)) {
    await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, file), { force: true });
  }
  revalidatePath("/admin/media");
}

/* ----------------------------- Users & account ------------------------- */

export async function addUserAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();
  const name = str(form.get("name"));
  const email = str(form.get("email")).toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!name || !emailOk(email)) return { ok: false, error: "Enter a name and a valid email." };
  if (password.length < 10) return { ok: false, error: "Password must be at least 10 characters." };
  const added = await mutate((db) => {
    if (db.users.some((u) => u.email.toLowerCase() === email)) return false;
    db.users.push({ id: newId(), name, email, passwordHash: hashPassword(password), createdAt: new Date().toISOString() });
    return true;
  });
  if (!added) return { ok: false, error: "An admin with that email already exists." };
  revalidatePath("/admin/users");
  return { ok: true, message: `${name} can now sign in`, at: Date.now() };
}

export async function removeUserAction(id: string) {
  const me = await requireUser();
  if (me.id === id) return;
  await mutate((db) => {
    db.users = db.users.filter((u) => u.id !== id);
  });
  revalidatePath("/admin/users");
}

export async function updateAccountAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const me = await requireUser();
  const name = str(form.get("name"));
  const email = str(form.get("email")).toLowerCase();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("password") ?? "");
  if (!name || !emailOk(email)) return { ok: false, error: "Enter a name and a valid email." };
  if (next && next.length < 10) return { ok: false, error: "New password must be at least 10 characters." };
  if ((next || email !== me.email.toLowerCase()) && !verifyPassword(current, me.passwordHash)) {
    return { ok: false, error: "Enter your current password to change email or password." };
  }
  const updated = await mutate((db) => {
    if (db.users.some((u) => u.id !== me.id && u.email.toLowerCase() === email)) return null;
    const u = db.users.find((x) => x.id === me.id);
    if (!u) return null;
    u.name = name;
    u.email = email;
    if (next) u.passwordHash = hashPassword(next);
    return { ...u };
  });
  if (!updated) return { ok: false, error: "That email is used by another admin." };
  if (next) await createSession(updated); // keep this browser signed in
  revalidatePath("/admin", "layout");
  return { ok: true, message: next ? "Account and password updated" : "Account updated", at: Date.now() };
}

/* ------------------------------- Backup -------------------------------- */

export async function importBackupAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a backup file first." };
  if (file.size > 20 * 1024 * 1024) return { ok: false, error: "Backup file is too large." };
  let data: { singletons?: Record<string, Record<string, unknown>>; collections?: Record<string, unknown[]> };
  try {
    data = JSON.parse(await file.text());
  } catch {
    return { ok: false, error: "That file isn't a valid backup." };
  }
  if (!data || typeof data !== "object" || !data.singletons || !data.collections) {
    return { ok: false, error: "That file isn't a Solvia backup." };
  }
  await mutate((db) => {
    for (const [key, value] of Object.entries(data.singletons || {})) {
      const def = getSingleton(key);
      if (def && value && typeof value === "object") {
        db.singletons[key] = sanitizeFields(def.sections.flatMap((s) => s.fields), value);
      }
    }
    for (const def of COLLECTIONS) {
      const items = data.collections?.[def.key];
      if (!Array.isArray(items)) continue;
      const now = new Date().toISOString();
      db.collections[def.key] = items
        .filter((i): i is Record<string, unknown> => Boolean(i) && typeof i === "object")
        .map((raw, idx) => ({
          ...sanitizeFields(def.fields, raw),
          id: typeof raw.id === "string" && /^[a-z0-9]{4,32}$/i.test(raw.id) ? raw.id : newId(),
          published: raw.published !== false,
          order: typeof raw.order === "number" ? raw.order : idx,
          createdAt: typeof raw.createdAt === "string" ? raw.createdAt : now,
          updatedAt: now,
        })) as Item[];
    }
  });
  refreshSite();
  return { ok: true, message: "Backup restored", at: Date.now() };
}
