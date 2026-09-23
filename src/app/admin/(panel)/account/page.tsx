import type { Metadata } from "next";
import { updateAccountAction } from "@/app/admin/actions";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <>
      <PageHeader title="My account" description="Update your name, email or password." />
      <Card className="max-w-2xl p-6">
        <SimpleForm
          action={updateAccountAction}
          submitLabel="Save account"
          fields={[
            { name: "name", label: "Name", defaultValue: me.name, required: true },
            { name: "email", label: "Email", type: "email", defaultValue: me.email, required: true },
            { name: "password", label: "New password", type: "password", autoComplete: "new-password", help: "Leave empty to keep your current password" },
            { name: "current", label: "Current password", type: "password", autoComplete: "current-password", help: "Required to change email or password" },
          ]}
        />
      </Card>
    </>
  );
}
