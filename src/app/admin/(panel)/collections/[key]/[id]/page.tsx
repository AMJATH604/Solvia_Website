import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { deleteItemAction, duplicateItemAction, saveItemAction } from "@/app/admin/actions";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { Editor } from "@/components/admin/Editor";
import { btn, Card, PageHeader, timeAgo } from "@/components/admin/ui";
import { getCollection } from "@/lib/schema";
import { getItem } from "@/lib/store";

type Props = { params: Promise<{ key: string; id: string }>; searchParams: Promise<{ created?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key, id } = await params;
  const def = getCollection(key);
  if (!def) return {};
  if (id === "new") return { title: `New ${def.singular.toLowerCase()}` };
  const item = await getItem(key, id);
  return { title: String(item?.[def.titleField] || def.singular) };
}

export default async function ItemPage({ params, searchParams }: Props) {
  const { key, id } = await params;
  const { created } = await searchParams;
  const def = getCollection(key);
  if (!def) notFound();
  const isNew = id === "new";
  const item = isNew ? undefined : await getItem(key, id);
  if (!isNew && !item) notFound();

  const initial: Record<string, unknown> = Object.fromEntries(
    def.fields.map((f) => [f.name, item?.[f.name] ?? (f.type === "tags" || f.type === "objects" ? [] : f.type === "boolean" ? false : "")]),
  );
  initial.published = item ? item.published : true;
  if (isNew) {
    const dateField = def.fields.find((f) => f.type === "date");
    if (dateField) initial[dateField.name] = new Date().toISOString().slice(0, 10);
  }

  const title = isNew ? `New ${def.singular.toLowerCase()}` : String(item?.[def.titleField] || def.singular);
  const publicHref = def.publicPath && item?.slug ? `${def.publicPath}/${item.slug}` : "";

  const aside = item ? (
    <Card className="divide-y divide-line">
      {publicHref && item.published && (
        <a href={publicHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-5 py-3.5 hover:bg-surface/60">
          <ExternalLink className="size-4 text-ink/50" /> View on website
        </a>
      )}
      <form action={duplicateItemAction.bind(null, key, item.id)}>
        <SubmitButton className="flex w-full items-center gap-2.5 px-5 py-3.5 text-left hover:bg-surface/60">
          <Copy className="size-4 text-ink/50" /> Duplicate
        </SubmitButton>
      </form>
      <form action={deleteItemAction.bind(null, key, item.id)}>
        <ConfirmButton
          message={`Delete "${title}"? This can't be undone.`}
          className="flex w-full items-center gap-2.5 px-5 py-3.5 text-left text-red-600 hover:bg-red-50"
        >
          <Trash2 className="size-4" /> Delete
        </ConfirmButton>
      </form>
      <div className="space-y-1 px-5 py-3.5 text-[12px] text-muted">
        <p>Created {timeAgo(item.createdAt)}</p>
        <p>Updated {timeAgo(item.updatedAt)}</p>
      </div>
    </Card>
  ) : null;

  return (
    <>
      <PageHeader
        title={title}
        breadcrumb={[{ href: `/admin/collections/${key}`, label: def.label }]}
        actions={created ? <span className="rounded-full bg-brand/10 px-3 py-1 text-[13px] font-medium text-[#0a7a51]">Created ✓</span> : null}
      />
      <Editor
        key={id}
        mode="item"
        publishable
        sections={[{ title: "Content", fields: def.fields }]}
        initial={initial}
        action={saveItemAction.bind(null, key, id)}
        aside={aside}
        submitLabel={isNew ? `Create ${def.singular.toLowerCase()}` : "Save changes"}
      />
    </>
  );
}
