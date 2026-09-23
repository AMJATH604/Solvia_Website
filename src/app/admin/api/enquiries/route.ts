import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/store";

const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await getCurrentUser())) return new Response("Not signed in", { status: 401 });
  const db = await readDb();
  const cols = ["createdAt", "status", "name", "email", "company", "phone", "service", "budget", "message", "notes"] as const;
  const rows = [cols.join(","), ...db.enquiries.map((e) => cols.map((c) => cell(e[c])).join(","))];
  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="solvia-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
