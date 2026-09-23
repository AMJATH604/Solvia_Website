import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { saveSingletonAction } from "@/app/admin/actions";
import { Editor } from "@/components/admin/Editor";
import { btn, PageHeader, timeAgo } from "@/components/admin/ui";
import { getSingleton } from "@/lib/schema";
import { getSingletonData } from "@/lib/store";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getSingleton((await params).key)?.label };
}

export default async function SingletonPage({ params }: Props) {
  const { key } = await params;
  const def = getSingleton(key);
  if (!def) notFound();
  const data = await getSingletonData(key);
  const updated = typeof data._updatedAt === "string" ? data._updatedAt : undefined;
  const initial = Object.fromEntries(def.sections.flatMap((s) => s.fields).map((f) => [f.name, data[f.name] ?? (f.type === "tags" || f.type === "objects" ? [] : f.type === "boolean" ? false : "")]));

  return (
    <>
      <PageHeader
        title={def.label}
        description={`${def.description}${updated ? ` Last edited ${timeAgo(updated)}.` : ""}`}
        actions={
          def.publicPath ? (
            <a href={def.publicPath} target="_blank" rel="noopener noreferrer" className={btn("secondary")}>
              <ExternalLink className="size-4" /> View page
            </a>
          ) : null
        }
      />
      <Editor key={key} sections={def.sections} initial={initial} action={saveSingletonAction.bind(null, key)} />
    </>
  );
}
