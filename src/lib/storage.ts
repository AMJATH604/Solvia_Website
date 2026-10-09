import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { del, get, put } from "@vercel/blob";

// Primary Cloud Storage: Supabase Storage
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "";
export const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);
const BUCKET = "cms";

// Secondary Cloud Storage: Vercel Blob
export const usingBlob = !usingSupabase && Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
const BLOB_PREFIX = "solvia/";

// Local / Temporary fallback
export const DATA_DIR = path.resolve(
  /*turbopackIgnore: true*/
  process.env.DATA_DIR || (process.env.VERCEL ? "/tmp/solvia-data" : path.join(process.cwd(), "data")),
);
export const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");

/** Someone else saved first; reload and try again. */
export class ConflictError extends Error {}

function supabaseHeaders(contentType?: string) {
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

function assertStorage() {
  if (process.env.VERCEL && !usingSupabase && !usingBlob) {
    console.warn(
      "[Storage] Notice: Neither Supabase nor Vercel Blob is configured. Changes will only persist in temporary /tmp storage. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Vercel project settings.",
    );
  }
}

const filePath = (name: string) => path.join(/*turbopackIgnore: true*/ DATA_DIR, name);

/* ------------------------------ Documents ------------------------------ */

/** Reads a document, always fresh. Returns null if it doesn't exist yet. */
export async function readDoc(name: string): Promise<string | null> {
  // 1. Supabase Storage
  if (usingSupabase) {
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
        headers: supabaseHeaders(),
        cache: "no-store",
      });
      if (res.status === 404) return null;
      if (res.ok) return await res.text();
      console.warn(`[Storage] Supabase readDoc(${name}) status:`, res.status);
    } catch (err) {
      console.warn(`[Storage] Supabase readDoc(${name}) error, falling back:`, err);
    }
  }

  // 2. Vercel Blob
  if (usingBlob) {
    try {
      const res = await get(BLOB_PREFIX + name, { access: "private", useCache: false });
      if (res && res.statusCode === 200) return new Response(res.stream).text();
    } catch (err) {
      console.warn(`[Storage] Blob readDoc(${name}) error, falling back:`, err);
    }
  }

  // 3. Local disk / ephemeral /tmp
  try {
    return await fs.readFile(filePath(name), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    return null;
  }
}

/**
 * Writes a private document. With `create`, it fails with ConflictError if the
 * document already exists (so two servers can't both create it).
 */
export async function writeDoc(name: string, text: string, opts: { create?: boolean } = {}): Promise<void> {
  assertStorage();

  // 1. Supabase Storage
  if (usingSupabase) {
    try {
      if (opts.create) {
        const existing = await readDoc(name);
        if (existing !== null) throw new ConflictError("Document exists");
      }
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
        method: "POST",
        headers: {
          ...supabaseHeaders(name.endsWith(".json") ? "application/json" : "text/plain"),
          "x-upsert": opts.create ? "false" : "true",
        },
        body: text,
      });
      if (res.ok) return;
      if (opts.create && res.status === 409) throw new ConflictError("Document exists");
      console.warn(`[Storage] Supabase writeDoc(${name}) status:`, res.status, await res.text());
    } catch (err) {
      if (err instanceof ConflictError) throw err;
      console.warn(`[Storage] Supabase writeDoc(${name}) error, falling back:`, err);
    }
  }

  // 2. Vercel Blob
  if (usingBlob) {
    try {
      await put(BLOB_PREFIX + name, text, {
        access: "private",
        contentType: name.endsWith(".json") ? "application/json" : "text/plain",
        addRandomSuffix: false,
        allowOverwrite: !opts.create,
      });
      return;
    } catch (err) {
      if (opts.create && (await readDoc(name)) !== null) throw new ConflictError("Document exists");
      console.warn(`[Storage] Blob writeDoc(${name}) error, falling back:`, err);
    }
  }

  // 3. Local disk / ephemeral /tmp
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const target = filePath(name);
    if (opts.create) {
      try {
        await fs.access(target);
        throw new ConflictError("Document exists");
      } catch (err) {
        if (err instanceof ConflictError) throw err;
      }
    }
    const tmp = `${target}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`;
    await fs.writeFile(tmp, text, { encoding: "utf8", mode: 0o600 });
    await fs.rename(tmp, target);
  } catch (err) {
    if (err instanceof ConflictError) throw err;
    console.warn(`[Storage] writeDoc disk fallback failed:`, err);
  }
}

/* ------------------------------- Uploads ------------------------------- */

export async function saveUpload(name: string, data: Buffer, contentType: string) {
  assertStorage();

  // 1. Supabase Storage
  if (usingSupabase) {
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/uploads/${name}`, {
        method: "POST",
        headers: {
          ...supabaseHeaders(contentType),
          "x-upsert": "true",
        },
        body: new Uint8Array(data),
      });
      if (res.ok) return;
      console.warn(`[Storage] Supabase saveUpload(${name}) status:`, res.status, await res.text());
    } catch (err) {
      console.warn(`[Storage] Supabase saveUpload(${name}) error:`, err);
    }
  }

  // 2. Vercel Blob
  if (usingBlob) {
    try {
      await put(`${BLOB_PREFIX}uploads/${name}`, data, { access: "private", contentType, addRandomSuffix: false });
      return;
    } catch (err) {
      console.warn(`[Storage] Blob saveUpload(${name}) error:`, err);
    }
  }

  // 3. Local disk / /tmp
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), data);
  } catch (err) {
    console.warn(`[Storage] saveUpload disk fallback failed:`, err);
  }
}

export async function readUpload(name: string): Promise<BodyInit | null> {
  // 1. Supabase Storage
  if (usingSupabase) {
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/uploads/${name}`, {
        headers: supabaseHeaders(),
      });
      if (res.ok) {
        return new Uint8Array(await res.arrayBuffer());
      }
    } catch (err) {
      console.warn(`[Storage] Supabase readUpload(${name}) error:`, err);
    }
  }

  // 2. Vercel Blob
  if (usingBlob) {
    try {
      const res = await get(`${BLOB_PREFIX}uploads/${name}`, { access: "private" });
      if (res && res.statusCode === 200) return res.stream;
    } catch (err) {
      console.warn(`[Storage] Blob readUpload(${name}) error:`, err);
    }
  }

  // 3. Local disk / /tmp
  try {
    return new Uint8Array(await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name)));
  } catch {
    return null;
  }
}

export async function deleteUpload(name: string) {
  // 1. Supabase Storage
  if (usingSupabase) {
    try {
      await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
        method: "DELETE",
        headers: supabaseHeaders("application/json"),
        body: JSON.stringify({ prefixes: [`uploads/${name}`] }),
      });
      return;
    } catch (err) {
      console.warn(`[Storage] Supabase deleteUpload(${name}) error:`, err);
    }
  }

  // 2. Vercel Blob
  if (usingBlob) {
    try {
      await del(`${BLOB_PREFIX}uploads/${name}`).catch(() => undefined);
      return;
    } catch (err) {
      console.warn(`[Storage] Blob deleteUpload(${name}) error:`, err);
    }
  }

  // 3. Local disk
  try {
    await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), { force: true });
  } catch {}
}
