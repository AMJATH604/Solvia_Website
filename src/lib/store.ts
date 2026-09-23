import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { COLLECTIONS, SINGLETONS, type Item } from "./schema";
import { seedCollections, seedSingletons } from "./seed";

// A small JSON document store. All content lives in DATA_DIR/content.json and is
// written atomically (temp file + rename) through a single serialised queue.

export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(process.cwd(), "data"));
export const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");
const DB_FILE = path.join(/*turbopackIgnore: true*/ DATA_DIR, "content.json");

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

function seedDb(): Db {
  const collections: Record<string, Item[]> = {};
  for (const def of COLLECTIONS) {
    collections[def.key] = (seedCollections[def.key] || []).map((raw, i) => {
      const { published = true, ...rest } = raw;
      return { ...rest, id: newId(), published: Boolean(published), order: i, createdAt: now(), updatedAt: now() } as Item;
    });
  }
  const singletons: Record<string, Record<string, unknown>> = {};
  for (const def of SINGLETONS) singletons[def.key] = { ...(seedSingletons[def.key] || {}) };
  return { version: 1, singletons, collections, enquiries: [], users: [], media: [], updatedAt: now() };
}

let cache: { db: Db; mtime: number } | null = null;
let queue: Promise<unknown> = Promise.resolve();
let seeding: Promise<Db> | null = null;

async function load(): Promise<Db> {
  try {
    const stat = await fs.stat(DB_FILE);
    if (cache && cache.mtime === stat.mtimeMs) return cache.db;
    const db = JSON.parse(await fs.readFile(DB_FILE, "utf8")) as Db;
    // Make sure newly added singletons/collections exist.
    for (const def of SINGLETONS) db.singletons[def.key] ??= { ...(seedSingletons[def.key] || {}) };
    for (const def of COLLECTIONS) db.collections[def.key] ??= [];
    db.enquiries ??= [];
    db.users ??= [];
    db.media ??= [];
    cache = { db, mtime: stat.mtimeMs };
    return db;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    // First run: create the store once, even if many requests arrive together.
    seeding ??= (async () => {
      const db = seedDb();
      await persist(db);
      return db;
    })().finally(() => {
      seeding = null;
    });
    return seeding;
  }
}

async function persist(db: Db) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  db.updatedAt = now();
  const tmp = `${DB_FILE}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
  const stat = await fs.stat(DB_FILE);
  cache = { db, mtime: stat.mtimeMs };
}

/** Read a snapshot of the whole store. Treat as read-only. */
export async function readDb(): Promise<Db> {
  await queue;
  return load();
}

/** Mutate the store; writes are serialised so concurrent saves never clobber each other. */
export function mutate<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = structuredClone(await load());
    const result = await fn(db);
    await persist(db);
    return result;
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
