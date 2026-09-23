import "server-only";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DATA_DIR, readDb, type User } from "./store";

const COOKIE = "solvia_session";
const SESSION_DAYS = 14;

/* ------------------------------ Passwords ------------------------------ */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, "base64"), expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

/* ------------------------------ Sessions ------------------------------- */

let secretPromise: Promise<Buffer> | null = null;

function getSecret(): Promise<Buffer> {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16) {
    return Promise.resolve(Buffer.from(process.env.SESSION_SECRET));
  }
  secretPromise ??= (async () => {
    const file = path.join(/*turbopackIgnore: true*/ DATA_DIR, ".session-secret");
    try {
      return Buffer.from(await fs.readFile(file, "utf8"), "base64");
    } catch {
      const secret = crypto.randomBytes(32);
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(file, secret.toString("base64"), { mode: 0o600 });
      return secret;
    }
  })();
  return secretPromise;
}

async function sign(payload: string) {
  return crypto.createHmac("sha256", await getSecret()).update(payload).digest("base64url");
}

export async function createSession(user: User) {
  const exp = Date.now() + SESSION_DAYS * 86400_000;
  // The password hash fingerprint invalidates sessions after a password change.
  const fp = crypto.createHash("sha256").update(user.passwordHash).digest("base64url").slice(0, 12);
  const payload = Buffer.from(JSON.stringify({ uid: user.id, exp, fp })).toString("base64url");
  const token = `${payload}.${await sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { uid, exp, fp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof exp !== "number" || exp < Date.now()) return null;
    const db = await readDb();
    const user = db.users.find((u) => u.id === uid);
    if (!user) return null;
    const currentFp = crypto.createHash("sha256").update(user.passwordHash).digest("base64url").slice(0, 12);
    return currentFp === fp ? user : null;
  } catch {
    return null;
  }
}

/** Use at the top of every admin page and server action. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const db = await readDb();
    redirect(db.users.length === 0 ? "/admin/setup" : "/admin/login");
  }
  return user;
}

/* ---------------------------- Rate limiting ---------------------------- */

const buckets = new Map<string, { count: number; reset: number }>();

/** Returns true if the action is allowed. Simple in-memory fixed window. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const t = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < t) {
    buckets.set(key, { count: 1, reset: t + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}
