import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { addUserAction, removeUserAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { Badge, Card, PageHeader, timeAgo } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/store";

export const metadata: Metadata = { title: "Admins" };

export default async function UsersPage() {
  const me = await requireUser();
  const { users } = await readDb();
  return (
    <>
      <PageHeader title="Admins" description="People who can sign in and edit the website. Every admin has full access." />
      <Card className="overflow-hidden">
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-4 px-5 py-4">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand text-[14px] font-semibold text-white">
                {u.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {u.name} {u.id === me.id && <Badge tone="green">You</Badge>}
                </p>
                <p className="truncate text-[13px] text-muted">{u.email}</p>
              </div>
              <p className="hidden text-[13px] text-muted sm:block">Last sign-in {timeAgo(u.lastLoginAt)}</p>
              {u.id !== me.id && (
                <form action={removeUserAction.bind(null, u.id)}>
                  <ConfirmButton
                    message={`Remove ${u.name}? They will no longer be able to sign in.`}
                    className="inline-flex size-9 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
                    title="Remove admin"
                  >
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="mt-6 p-6">
        <h2 className="font-semibold">Add an admin</h2>
        <p className="mt-0.5 mb-5 text-muted">Share the email and password with them securely. They can change the password in My account.</p>
        <SimpleForm
          action={addUserAction}
          submitLabel="Add admin"
          resetOnSuccess
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Temporary password", type: "password", autoComplete: "new-password", help: "At least 10 characters", required: true },
          ]}
        />
      </Card>
    </>
  );
}
