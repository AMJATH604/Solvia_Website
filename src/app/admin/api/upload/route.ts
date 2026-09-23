import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { mutate, newId, UPLOAD_DIR } from "@/lib/store";

const ALLOWED: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "application/pdf": ".pdf",
};
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await getCurrentUser())) return Response.json({ error: "Not signed in" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return Response.json({ error: "Use PNG, JPG, WebP, GIF, AVIF, SVG or PDF." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Files must be under 10 MB." }, { status: 400 });

  const name = `${crypto.randomBytes(10).toString("hex")}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  const media = {
    id: newId(),
    name: file.name.slice(0, 200) || name,
    file: name,
    url: `/uploads/${name}`,
    type: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  };
  await mutate((db) => {
    db.media.unshift(media);
  });
  return Response.json(media);
}
