import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/store";

// Full content backup (settings, pages, collections, enquiries). Admin accounts are never exported.
export async function GET() {
  if (!(await getCurrentUser())) return new Response("Not signed in", { status: 401 });
  const db = await readDb();
  const { users: _users, ...rest } = db;
  void _users;
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify({ ...rest, exportedAt: new Date().toISOString() }, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="solvia-backup-${stamp}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
