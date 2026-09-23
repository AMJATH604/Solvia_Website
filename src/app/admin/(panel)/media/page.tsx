import type { Metadata } from "next";
import { FileText, Trash2 } from "lucide-react";
import { deleteMediaAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CopyUrl, MediaUploader } from "@/components/admin/MediaUploader";
import { PageHeader, timeAgo } from "@/components/admin/ui";
import { readDb } from "@/lib/store";

export const metadata: Metadata = { title: "Media" };

const size = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default async function MediaPage() {
  const { media } = await readDb();
  return (
    <>
      <PageHeader title="Media" description="Images and documents you can use anywhere on the site. Pick them from any image field via “Library”." />
      <MediaUploader />
      {media.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {media.map((m) => (
            <figure key={m.id} className="group overflow-hidden rounded-2xl border border-line bg-white">
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="block aspect-square bg-surface">
                {m.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center">
                    <FileText className="size-10 text-ink/30" />
                  </span>
                )}
              </a>
              <figcaption className="flex items-center gap-1 p-2 pl-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{m.name}</p>
                  <p className="text-[12px] text-muted">
                    {size(m.size)} · {timeAgo(m.createdAt)}
                  </p>
                </div>
                <CopyUrl url={m.url} />
                <form action={deleteMediaAction.bind(null, m.id)}>
                  <ConfirmButton
                    message={`Delete ${m.name}? Pages using it will show a broken image.`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-ink/55 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
