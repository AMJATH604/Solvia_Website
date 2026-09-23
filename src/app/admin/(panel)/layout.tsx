import { connection } from "next/server";
import { logoutAction } from "@/app/admin/actions";
import { Shell, type Command, type NavGroup } from "@/components/admin/Shell";
import { requireUser } from "@/lib/auth";
import { COLLECTIONS, SINGLETONS } from "@/lib/schema";
import { readDb } from "@/lib/store";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const user = await requireUser();
  const db = await readDb();
  const newEnquiries = db.enquiries.filter((e) => e.status === "new").length;

  const singleton = (key: string) => {
    const s = SINGLETONS.find((x) => x.key === key)!;
    return { href: `/admin/content/${s.key}`, label: s.label, icon: s.icon };
  };

  const groups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: "dashboard" },
        { href: "/admin/enquiries", label: "Enquiries", icon: "inbox", badge: newEnquiries },
      ],
    },
    { label: "Pages", items: [singleton("home"), singleton("about"), singleton("pages")] },
    {
      label: "Content",
      items: COLLECTIONS.map((c) => ({ href: `/admin/collections/${c.key}`, label: c.label, icon: c.icon })),
    },
    { label: "Library", items: [{ href: "/admin/media", label: "Media", icon: "image" }] },
    {
      label: "Settings",
      items: [
        singleton("settings"),
        { href: "/admin/users", label: "Admins", icon: "shield" },
        { href: "/admin/backup", label: "Backup & restore", icon: "backup" },
        { href: "/admin/account", label: "My account", icon: "account" },
      ],
    },
  ];

  const commands: Command[] = [
    ...groups.flatMap((g) => g.items.map((i) => ({ href: i.href, label: i.label, group: g.label, icon: i.icon }))),
    ...COLLECTIONS.map((c) => ({ href: `/admin/collections/${c.key}/new`, label: `New ${c.singular.toLowerCase()}`, group: "Create" })),
  ];

  return (
    <Shell groups={groups} commands={commands} user={{ name: user.name, email: user.email }} logout={logoutAction}>
      {children}
    </Shell>
  );
}
