import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { loginAction } from "@/app/admin/actions";
import { AuthForm } from "@/components/admin/AuthForm";
import { AuthShell } from "@/components/admin/AuthShell";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/store";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  await connection();
  if ((await readDb()).users.length === 0) redirect("/admin/setup");
  if (await getCurrentUser()) redirect("/admin");
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage the Solvia website.">
      <AuthForm
        action={loginAction}
        submitLabel="Sign in"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@solvia.tech" },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ]}
      />
    </AuthShell>
  );
}
