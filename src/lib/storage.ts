import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { del, get, put } from "@vercel/blob";

// Where the site keeps its data. On a normal server (local, Render, Docker) that
// is a folder on disk. On Vercel, which has no writable disk, it is a *private*
// Vercel Blob store. Connecting one to the project sets BLOB_STORE_ID (the SDK
// then signs in with Vercel's built-in OIDC token) or, on older setups,
// BLOB_READ_WRITE_TOKEN.

export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(process.cwd(), "data"));
export const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");

export const usingBlob = Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
const PREFIX = "solvia/";

/** Someone else saved first; reload and try again. */
export class ConflictError extends Error {}

function assertStorage() {
  if (process.env.VERCEL && !usingBlob) {
    throw new Error(
      "No storage connected. In Vercel open Storage → Create → Blob (choose Private), connect it to this project, then redeploy.",
    );
  }
}

const filePath = (name: string) => path.join(/*turbopackIgnore: true*/ DATA_DIR, name);

/* ------------------------------ Documents ------------------------------ */

/** Reads a private document, always fresh. Returns null if it doesn't exist yet. */
export async function readDoc(name: string): Promise<string | null> {
  if (usingBlob) {
    try {
      const res = await get(PREFIX + name, { access: "private", useCache: false });
      if (!res || res.statusCode !== 200) return null;
      return new Response(res.stream).text();
    } catch (blobErr) {
      console.warn("[Storage] Blob read error, falling back:", blobErr);
      return null;
    }
  }
  if (process.env.VERCEL) {
    // On Vercel without Blob connected, return null to gracefully use seed data
    return null;
  }
  try {
    return await fs.readFile(filePath(name), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

/**
 * Writes a private document. With `create`, it fails with ConflictError if the
 * document already exists (so two servers can't both create it).
 */
export async function writeDoc(name: string, text: string, opts: { create?: boolean } = {}): Promise<void> {
  assertStorage();
  if (usingBlob) {
    try {
      await put(PREFIX + name, text, {
        access: "private",
        contentType: name.endsWith(".json") ? "application/json" : "text/plain",
        addRandomSuffix: false,
        allowOverwrite: !opts.create,
      });
      return;
    } catch (err) {
      // With `create`, a failure usually means another request created it first.
      if (opts.create && (await readDoc(name)) !== null) throw new ConflictError("Document exists");
      throw err;
    }
  }
  // On disk a single process owns the file; writes are atomic (temp file + rename).
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
}

/* ------------------------------- Uploads ------------------------------- */

export async function saveUpload(name: string, data: Buffer, contentType: string) {
  assertStorage();
  if (usingBlob) {
    await put(`${PREFIX}uploads/${name}`, data, { access: "private", contentType, addRandomSuffix: false });
    return;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), data);
}

export async function readUpload(name: string): Promise<BodyInit | null> {
  assertStorage();
  if (usingBlob) {
    const res = await get(`${PREFIX}uploads/${name}`, { access: "private" });
    return res && res.statusCode === 200 ? res.stream : null;
  }
  try {
    return new Uint8Array(await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name)));
  } catch {
    return null;
  }
}

export async function deleteUpload(name: string) {
  assertStorage();
  if (usingBlob) {
    await del(`${PREFIX}uploads/${name}`).catch(() => undefined);
    return;
  }
  await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), { force: true });
}
