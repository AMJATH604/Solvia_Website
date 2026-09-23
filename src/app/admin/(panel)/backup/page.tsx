import type { Metadata } from "next";
import { Download } from "lucide-react";
import { importBackupAction } from "@/app/admin/actions";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { btn, Card, PageHeader } from "@/components/admin/ui";
import { DATA_DIR } from "@/lib/store";

export const metadata: Metadata = { title: "Backup & restore" };

export default function BackupPage() {
  return (
    <>
      <PageHeader title="Backup & restore" description="Download everything on the site as one file, or restore from a previous backup." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-semibold">Download a backup</h2>
          <p className="mt-1 mb-5 text-muted">Includes settings, every page, all content and enquiries. Admin passwords are never included.</p>
          <a href="/admin/api/export" className={btn("dark")}>
            <Download className="size-4" /> Download backup
          </a>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold">Restore from a backup</h2>
          <p className="mt-1 mb-5 text-muted">Replaces settings, pages and content with the backup. Enquiries, media and admins are kept.</p>
          <SimpleForm
            action={importBackupAction}
            submitLabel="Restore"
            confirm="Restore this backup? Current pages and content will be replaced."
            fields={[{ name: "file", label: "Backup file (.json)", type: "file", accept: "application/json,.json", required: true }]}
          />
        </Card>
      </div>
      <Card className="mt-6 p-6" >
        <h2 id="deploy" className="scroll-mt-24 font-semibold">
          Where your content lives
        </h2>
        <p className="mt-1 text-muted">
          All content is stored in <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">{DATA_DIR}</code>. When hosting, point the{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">DATA_DIR</code> environment variable at a persistent disk, and set{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">SITE_URL</code> to your domain (e.g. https://solvia.tech) so search engines and social
          previews use the right links.
        </p>
      </Card>
    </>
  );
}
