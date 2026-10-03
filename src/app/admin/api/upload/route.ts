import crypto from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { saveUpload } from "@/lib/storage";
import { mutate, newId } from "@/lib/store";

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
// Hosting platforms cap request bodies (Vercel: 4.5 MB), so keep uploads under 4 MB.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await getCurrentUser())) return Response.json({ error: "Not signed in" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return Response.json({ error: "Use PNG, JPG, WebP, GIF, AVIF, SVG or PDF." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Files must be under 4 MB." }, { status: 400 });

  const name = `${crypto.randomBytes(10).toString("hex")}${ext}`;
  await saveUpload(name, Buffer.from(await file.arrayBuffer()), file.type);
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
