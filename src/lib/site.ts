import "server-only";
import { connection } from "next/server";
import { getSingletonData, listItems } from "./store";
import type { Item } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Doc = Record<string, any>;

/** Loads content at request time so admin edits show up immediately. */
export async function getSettings(): Promise<Doc> {
  await connection();
  return getSingletonData<Doc>("settings");
}

export async function getPage(key: "home" | "about" | "pages"): Promise<Doc> {
  await connection();
  return getSingletonData<Doc>(key);
}

export async function getItems(key: string): Promise<(Item & Doc)[]> {
  await connection();
  return (await listItems(key)) as (Item & Doc)[];
}

export const list = <T = Doc>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export function siteUrl() {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function formatDate(value: unknown) {
  if (!value) return "";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Only allow safe hex colours for the injected accent. */
export function safeColor(value: unknown, fallback = "#0EA66E") {
  const v = String(value || "").trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : fallback;
}
