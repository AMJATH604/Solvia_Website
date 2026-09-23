import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { duplicateItemAction, moveItemAction, togglePublishAction } from "@/app/admin/actions";
import { CollectionTable } from "@/components/admin/CollectionTable";
import { SubmitButton } from "@/components/admin/ConfirmButton";
import { btn, EmptyState, PageHeader } from "@/components/admin/ui";
import { getCollection } from "@/lib/schema";
import { listItems } from "@/lib/store";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getCollection((await params).key)?.label };
}

export default async function CollectionPage({ params }: Props) {
  const { key } = await params;
  const def = getCollection(key);
  if (!def) notFound();
  const items = await listItems(key, { all: true });
  const iconBtn = `${btn("ghost", "sm")} !px-2`;

  const rows = items.map((item, i) => ({
    id: item.id,
    title: String(item[def.titleField] || "Untitled"),
    subtitle: def.subtitleField ? String(item[def.subtitleField] || "") : "",
    published: item.published,
    updatedAt: item.updatedAt,
    date: typeof item.date === "string" ? item.date : "",
    href: `/admin/collections/${key}/${item.id}`,
    publicHref: def.publicPath && item.slug && item.published ? `${def.publicPath}/${item.slug}` : "",
    actions: (
      <div className="flex items-center justify-end">
        {def.sort === "order" && (
          <>
            <form action={moveItemAction.bind(null, key, item.id, "up")}>
              <SubmitButton className={iconBtn} title="Move up">
                <ArrowUp className="size-4" />
              </SubmitButton>
            </form>
            <form action={moveItemAction.bind(null, key, item.id, "down")}>
              <SubmitButton className={iconBtn} title="Move down">
                <ArrowDown className="size-4" />
              </SubmitButton>
            </form>
          </>
        )}
        <form action={togglePublishAction.bind(null, key, item.id)}>
          <SubmitButton className={iconBtn} title={item.published ? "Unpublish" : "Publish"}>
            {item.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </SubmitButton>
        </form>
        <form action={duplicateItemAction.bind(null, key, item.id)}>
          <SubmitButton className={iconBtn} title="Duplicate">
            <Copy className="size-4" />
          </SubmitButton>
        </form>
        <Link href={`/admin/collections/${key}/${item.id}`} className={iconBtn} title="Edit" aria-label="Edit">
          <Pencil className="size-4" />
        </Link>
      </div>
    ),
    index: i,
  }));

  return (
    <>
      <PageHeader
        title={def.label}
        description={def.description}
        actions={
          <Link href={`/admin/collections/${key}/new`} className={btn("primary")}>
            <Plus className="size-4" /> New {def.singular.toLowerCase()}
          </Link>
        }
      />
      {rows.length ? (
        <CollectionTable rows={rows} sortLabel={def.sort === "date" ? "Date" : "Updated"} />
      ) : (
        <EmptyState
          title={`No ${def.label.toLowerCase()} yet`}
          text={`Create your first ${def.singular.toLowerCase()} and it will appear on the website once published.`}
          action={
            <Link href={`/admin/collections/${key}/new`} className={btn("primary")}>
              <Plus className="size-4" /> New {def.singular.toLowerCase()}
            </Link>
          }
        />
      )}
    </>
  );
}
