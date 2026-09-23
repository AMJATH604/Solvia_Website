# Solvia Technologies — Website & Admin Panel

The company website for **Solvia Technologies Pvt Ltd**, plus an admin panel where every word, image and list on the site can be changed without touching code.

Built on the **Concept 1C "Solved"** brand: the `sol✓ia` wordmark, Solvia Green `#0EA66E`, Deep Forest `#0C1A14`, Mint `#34D399` and the Outfit typeface.

## What's inside

**Website** (`/`)

| Page | Path |
| --- | --- |
| Home — animated "problem → solved" board, services bento, why Solvia, stats, process, featured work, industries, testimonials, insights, FAQ | `/` |
| Services + one page per service | `/services`, `/services/[slug]` |
| Solutions (industries) | `/solutions` |
| Case studies | `/work`, `/work/[slug]` |
| Insights (blog) | `/insights`, `/insights/[slug]` |
| Company (story, mission, values, team) | `/about` |
| Careers + one page per role | `/careers`, `/careers/[slug]` |
| Contact form (saves to the admin inbox) | `/contact` |

Also: SEO metadata and social previews, `sitemap.xml`, `robots.txt`, a branded 404, responsive layouts from phone to desktop, and reduced-motion support.

**Admin panel** (`/admin`)

- **Dashboard**: new enquiries, content counts and a launch checklist
- **Enquiries inbox**: status tracking, internal notes, reply by email, CSV export
- **Page editors**: Home, Company, page headers, and site settings (brand colour, logo, contact details, social links, SEO, announcement bar, footer)
- **Content**: Services, Solutions, Case studies, Insights, Careers, Team, Testimonials and FAQs, each with create, edit, duplicate, reorder, publish/draft and delete
- **Media library**: drag-and-drop uploads, usable from any image field
- **Admins**: invite more people; change your own password
- **Backup & restore**: download everything as one JSON file, or restore it
- ⌘K command palette, ⌘S to save, and a warning before you leave with unsaved changes

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the admin panel.
The first time you open `/admin` you'll be asked to **create the admin account**. This only works once, so do it right after deploying.

## How content is stored

All content lives in one JSON file, `DATA_DIR/content.json` (default `./data`). Uploaded files go in `DATA_DIR/uploads/`.
On first run the store is filled with starter content, which you then edit in the admin panel. The `data/` folder is git-ignored, so use **Backup & restore** to keep copies.

Before launch, review the starter content. The sample case studies, stats and FAQ answers are placeholders that need your real details. The dashboard's launch checklist tracks what's left.

## Deploying

The site needs a Node.js server with a **persistent disk** for `DATA_DIR`. Good options:

- **Render / Railway / Fly.io**: attach a volume, set `DATA_DIR` to its mount path
- **Any VPS**: `npm ci && npm run build && npm start` behind Nginx
- **Docker**: the included `Dockerfile`

```bash
docker build -t solvia-website .
docker run -p 3000:3000 -v solvia-data:/app/data -e SITE_URL=https://solvia.tech solvia-website
```

Serverless hosts with read-only file systems (e.g. plain Vercel) won't keep admin edits unless the store is moved to a database.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATA_DIR` | Where content, uploads and the session key are stored (default `./data`) |
| `SITE_URL` | Public URL, used for the sitemap and social previews (e.g. `https://solvia.tech`) |
| `SESSION_SECRET` | Optional. Signing key for admin sessions; generated automatically if unset |
| `INSECURE_COOKIES` | Set to `1` only if you must serve the admin over plain HTTP (not recommended) |

## Project structure

```
src/
  app/(site)/          public website pages
  app/admin/           admin panel (auth, pages, server actions, API routes)
  components/site/     website components (header, footer, hero board, cards)
  components/admin/    admin components (shell, editor, field controls)
  components/brand/    Solvia wordmark and symbol
  lib/schema.ts        content model: every editable field is defined here
  lib/seed.ts          starter content
  lib/store.ts         JSON content store
  lib/auth.ts          admin sessions and password hashing
```

To add a new editable field, add it to `src/lib/schema.ts`. It appears in the admin panel automatically, and you can then use it in the page.
