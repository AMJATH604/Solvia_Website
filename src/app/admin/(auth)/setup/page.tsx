import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { setupAction } from "@/app/admin/actions";
import { AuthForm } from "@/components/admin/AuthForm";
import { AuthShell } from "@/components/admin/AuthShell";
import { readDb } from "@/lib/store";

export const metadata: Metadata = { title: "Set up" };

export default async function SetupPage() {
  await connection();
  if ((await readDb()).users.length > 0) redirect("/admin/login");
  return (
    <AuthShell title="Create your admin account" subtitle="This is a one-time step. You can invite more admins later.">
      <AuthForm
        action={setupAction}
        submitLabel="Create account"
        fields={[
          { name: "name", label: "Your name", autoComplete: "name" },
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password (10+ characters)", type: "password", autoComplete: "new-password" },
          { name: "confirm", label: "Confirm password", type: "password", autoComplete: "new-password" },
        ]}
      />
    </AuthShell>
  );
}
