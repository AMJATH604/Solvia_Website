import "server-only";
import crypto from "node:crypto";
import { COLLECTIONS, SINGLETONS, type Item } from "./schema";
import { seedCollections, seedSingletons } from "./seed";
import { ConflictError, readDoc, writeDoc } from "./storage";

// A small JSON document store: all content lives in one document, content.json,
// on disk or in a private Vercel Blob store (see storage.ts). Writes in this
// process are queued, and writes from other servers are detected by version
// and retried, so concurrent saves never overwrite each other.

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

let cache: { db: Db; version: string } | null = null;
let queue: Promise<unknown> = Promise.resolve();
let seeding: Promise<{ db: Db; version: string }> | null = null;

async function load(): Promise<{ db: Db; version: string }> {
  const res = await readDoc(DOC, cache?.version);
  if (res?.unchanged && cache) return cache;
  if (res && !res.unchanged) {
    cache = { db: normalize(JSON.parse(res.text) as Db), version: res.version };
    return cache;
  }
  // First run: create the store once, even if many requests arrive together.
  seeding ??= (async () => {
    const db = seedDb();
    try {
      const version = await writeDoc(DOC, JSON.stringify(db, null, 2), { create: true });
      cache = { db, version };
      return cache;
    } catch (err) {
      if (err instanceof ConflictError) {
        cache = null;
        return load(); // another server created it first
      }
      throw err;
    }
  })().finally(() => {
    seeding = null;
  });
  return seeding;
}

/** Read a snapshot of the whole store. Treat as read-only. */
export async function readDb(): Promise<Db> {
  await queue;
  return (await load()).db;
}

/** Mutate the store; concurrent saves are serialised here and retried across servers. */
export function mutate<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    for (let attempt = 0; ; attempt++) {
      const base = await load();
      const db = structuredClone(base.db);
      const result = await fn(db);
      db.updatedAt = now();
      try {
        const version = await writeDoc(DOC, JSON.stringify(db, null, 2), { ifVersion: base.version });
        cache = { db, version };
        return result;
      } catch (err) {
        if (!(err instanceof ConflictError) || attempt >= 4) throw err;
        cache = null; // someone else saved first: reload and apply the change again
      }
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
