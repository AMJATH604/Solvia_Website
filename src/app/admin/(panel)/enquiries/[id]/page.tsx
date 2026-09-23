import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone, Reply, Trash2 } from "lucide-react";
import { deleteEnquiryAction, updateEnquiryAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { EnquiryForm } from "@/components/admin/EnquiryForm";
import { btn, Card, PageHeader } from "@/components/admin/ui";
import { mutate, readDb } from "@/lib/store";

export const metadata: Metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const e = db.enquiries.find((x) => x.id === id);
  if (!e) notFound();
  // Opening a new enquiry marks it as in progress.
  if (e.status === "new") {
    await mutate((d) => {
      const x = d.enquiries.find((y) => y.id === e.id);
      if (x?.status === "new") x.status = "open";
    });
  }
  const status = e.status === "new" ? "open" : e.status;
  const settings = db.singletons.settings || {};
  const reply = `mailto:${e.email}?subject=${encodeURIComponent(`Re: your enquiry to ${settings.brandName || "Solvia"}`)}&body=${encodeURIComponent(`Hi ${e.name.split(" ")[0]},\n\n`)}`;

  return (
    <>
      <PageHeader
        title={e.name}
        description={`Received ${new Date(e.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`}
        breadcrumb={[{ href: "/admin/enquiries", label: "Enquiries" }]}
        actions={
          <a href={reply} className={btn("dark")}>
            <Reply className="size-4" /> Reply by email
          </a>
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <dl className="grid gap-5 sm:grid-cols-2">
              {[
                ["Email", e.email],
                ["Phone", e.phone],
                ["Company", e.company],
                ["Service", e.service],
                ["Budget", e.budget],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[12px] tracking-wide text-muted uppercase">{k}</dt>
                    <dd className="mt-1 font-medium break-words">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
          <Card className="p-6">
            <h2 className="text-[12px] tracking-wide text-muted uppercase">Message</h2>
            <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap">{e.message}</p>
          </Card>
        </div>
        <div className="space-y-4 lg:sticky lg:top-24">
          <Card className="p-5">
            <EnquiryForm action={updateEnquiryAction.bind(null, e.id)} status={status} notes={e.notes} />
          </Card>
          <Card className="divide-y divide-line">
            <a href={`mailto:${e.email}`} className="flex items-center gap-2.5 px-5 py-3.5 hover:bg-surface/60">
              <Mail className="size-4 text-ink/50" /> {e.email}
            </a>
            {e.phone && (
              <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 px-5 py-3.5 hover:bg-surface/60">
                <Phone className="size-4 text-ink/50" /> {e.phone}
              </a>
            )}
            <form action={deleteEnquiryAction.bind(null, e.id)}>
              <ConfirmButton message="Delete this enquiry permanently?" className="flex w-full items-center gap-2.5 px-5 py-3.5 text-left text-red-600 hover:bg-red-50">
                <Trash2 className="size-4" /> Delete enquiry
              </ConfirmButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
