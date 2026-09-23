import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/store";

export async function GET() {
  if (!(await getCurrentUser())) return Response.json({ error: "Not signed in" }, { status: 401 });
  const db = await readDb();
  return Response.json(db.media);
}
