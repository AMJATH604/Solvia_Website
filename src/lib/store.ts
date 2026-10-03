import "server-only";
import crypto from "node:crypto";
import { cache as reactCache } from "react";
import { COLLECTIONS, SINGLETONS, type Item } from "./schema";
import { seedCollections, seedSingletons } from "./seed";
import { ConflictError, readDoc, writeDoc } from "./storage";

// A small JSON document store: all content lives in one document, content.json,
// on disk or in a private Vercel Blob store (see storage.ts). Writes in this
// process are queued; each save bumps a revision number stored in the document,
// and a save is retried if another server's save landed in between.

export { DATA_DIR, UPLOAD_DIR, usingBlob } from "./storage";
const DOC = "content.json";

export type EnquiryStatus = "new" | "open" | "replied" | "archived";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string;
  ip?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  file: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface Db {
  version: 1;
  singletons: Record<string, Record<string, unknown>>;
  collections: Record<string, Item[]>;
  enquiries: Enquiry[];
  users: User[];
  media: MediaFile[];
  updatedAt: string;
  /** Incremented on every save; used to detect saves from other servers. */
  rev?: number;
}

export const newId = () => crypto.randomBytes(8).toString("hex");
const now = () => new Date().toISOString();

function seedItems(key: string): Item[] {
  return (seedCollections[key] || []).map((raw, i) => {
    const { published = true, ...rest } = raw;
    return { ...rest, id: newId(), published: Boolean(published), order: i, createdAt: now(), updatedAt: now() } as Item;
  });
}

function seedDb(): Db {
  const collections: Record<string, Item[]> = {};
  for (const def of COLLECTIONS) collections[def.key] = seedItems(def.key);
  const singletons: Record<string, Record<string, unknown>> = {};
  for (const def of SINGLETONS) singletons[def.key] = { ...(seedSingletons[def.key] || {}) };
  return { version: 1, singletons, collections, enquiries: [], users: [], media: [], updatedAt: now() };
}

function normalize(db: Db): Db {
  // Make sure newly added singletons/collections exist.
  for (const def of SINGLETONS) db.singletons[def.key] ??= { ...(seedSingletons[def.key] || {}) };
  // Collections added in a later version arrive with their starter content.
  for (const def of COLLECTIONS) db.collections[def.key] ??= seedItems(def.key);
  db.enquiries ??= [];
  db.users ??= [];
  db.media ??= [];
  return db;
}

let queue: Promise<unknown> = Promise.resolve();
let seeding: Promise<Db> | null = null;

/** Always reads the latest saved document (creating it with starter content on first run). */
async function load(): Promise<Db> {
  const text = await readDoc(DOC);
  if (text !== null) return normalize(JSON.parse(text) as Db);
  // First run: create the store once, even if many requests arrive together.
  seeding ??= (async () => {
    const db = { ...seedDb(), rev: 1 };
    try {
      await writeDoc(DOC, JSON.stringify(db, null, 2), { create: true });
      return db;
    } catch (err) {
      if (err instanceof ConflictError) return load(); // another server created it first
      throw err;
    }
  })().finally(() => {
    seeding = null;
  });
  return seeding;
}

// One read per page view: React's cache() shares the result between the layout,
// page and metadata of a single request, and every new request reads fresh.
const readForRequest = reactCache(async () => {
  await queue;
  return load();
});

/** Read a snapshot of the whole store. Treat as read-only. */
export async function readDb(): Promise<Db> {
  return readForRequest();
}

/** Mutate the store; saves are serialised here and retried if another server saved in between. */
export function mutate<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    for (let attempt = 0; ; attempt++) {
      const base = await load();
      const db = structuredClone(base);
      const result = await fn(db);
      db.rev = (base.rev ?? 0) + 1;
      db.updatedAt = now();
      // Re-check right before saving: if someone else saved meanwhile, redo the change on top of theirs.
      const latest = attempt < 4 ? await load() : base;
      if ((latest.rev ?? 0) !== (base.rev ?? 0)) continue;
      await writeDoc(DOC, JSON.stringify(db, null, 2));
      return result;
    }
  });
  queue = run.catch(() => undefined);
  return run;
}

/* ---------------------------- Content helpers ---------------------------- */

export async function getSingletonData<T = Record<string, unknown>>(key: string): Promise<T> {
  const db = await readDb();
  return (db.singletons[key] || {}) as T;
}

function sortItems(key: string, items: Item[]) {
  const def = COLLECTIONS.find((c) => c.key === key);
  const copy = [...items];
  if (def?.sort === "date") {
    copy.sort((a, b) => String(b.date || b.createdAt).localeCompare(String(a.date || a.createdAt)));
  } else {
    copy.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  return copy;
}

export async function listItems(key: string, opts: { all?: boolean } = {}): Promise<Item[]> {
  const db = await readDb();
  const items = db.collections[key] || [];
  return sortItems(key, opts.all ? items : items.filter((i) => i.published));
}

export async function getItemBySlug(key: string, slug: string): Promise<Item | undefined> {
  const items = await listItems(key);
  return items.find((i) => i.slug === slug);
}

export async function getItem(key: string, id: string): Promise<Item | undefined> {
  const db = await readDb();
  return (db.collections[key] || []).find((i) => i.id === id);
}
