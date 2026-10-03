import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { BlobPreconditionFailedError, del, get, put } from "@vercel/blob";

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

export type ReadResult = { unchanged: true; version: string } | { unchanged: false; text: string; version: string };

/** Reads a private document. Pass the version you already have to skip re-downloading it. */
export async function readDoc(name: string, knownVersion?: string): Promise<ReadResult | null> {
  assertStorage();
  if (usingBlob) {
    const res = await get(PREFIX + name, { access: "private", useCache: false, ifNoneMatch: knownVersion });
    if (!res) return null;
    if (res.statusCode === 304) return { unchanged: true, version: res.blob.etag };
    return { unchanged: false, text: await new Response(res.stream).text(), version: res.blob.etag };
  }
  try {
    const stat = await fs.stat(filePath(name));
    const version = String(stat.mtimeMs);
    if (version === knownVersion) return { unchanged: true, version };
    return { unchanged: false, text: await fs.readFile(filePath(name), "utf8"), version };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

/**
 * Writes a private document and returns its new version.
 * `ifVersion` makes the write fail with ConflictError if someone saved in between;
 * `create` makes it fail if the document already exists.
 */
export async function writeDoc(name: string, text: string, opts: { ifVersion?: string; create?: boolean } = {}): Promise<string> {
  assertStorage();
  if (usingBlob) {
    try {
      const res = await put(PREFIX + name, text, {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: !opts.create,
        ifMatch: opts.create ? undefined : opts.ifVersion,
      });
      return res.etag;
    } catch (err) {
      if (err instanceof BlobPreconditionFailedError) throw new ConflictError("Document changed");
      // With `create`, a failure usually means another request created it first.
      if (opts.create && (await readDoc(name))) throw new ConflictError("Document exists");
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
  return String((await fs.stat(target)).mtimeMs);
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
