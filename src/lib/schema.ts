// Content schema: one definition drives the admin forms, validation and the site.
// Add a field here and it appears in the admin panel automatically.

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "image"
  | "url"
  | "email"
  | "color"
  | "icon"
  | "slug"
  | "tags"
  | "objects";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Sub-fields for `objects` lists. */
  fields?: Field[];
  /** For `slug`: the field it is generated from. */
  from?: string;
  rows?: number;
  /** Render at half width on wide screens. */
  half?: boolean;
}

export interface Section {
  title: string;
  description?: string;
  fields: Field[];
}

export interface SingletonDef {
  key: string;
  label: string;
  description: string;
  icon: string;
  /** Public page this content shows on, for the "View" button. */
  publicPath?: string;
  sections: Section[];
}

export interface CollectionDef {
  key: string;
  label: string;
  singular: string;
  description: string;
  icon: string;
  titleField: string;
  subtitleField?: string;
  /** Base path of detail pages on the site (items need a `slug`). */
  publicPath?: string;
  /** Items are ordered by `order` (drag handles) or newest `date` first. */
  sort: "order" | "date";
  fields: Field[];
}

export type Item = Record<string, unknown> & {
  id: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export const ICON_OPTIONS = [
  "code",
  "smartphone",
  "brain",
  "cloud",
  "workflow",
  "shield",
  "palette",
  "chart",
  "database",
  "layers",
  "rocket",
  "sparkles",
  "cpu",
  "globe",
  "lightbulb",
  "users",
  "cart",
  "health",
  "education",
  "finance",
  "truck",
  "factory",
  "building",
  "store",
  "search",
  "target",
  "zap",
  "lock",
  "handshake",
  "eye",
  "compass",
  "wrench",
].map((v) => ({ value: v, label: v }));

const cta = (prefix: string, label: string): Field[] => [
  { name: `${prefix}Label`, label: `${label} label`, type: "text", half: true },
  { name: `${prefix}Link`, label: `${label} link`, type: "text", half: true, placeholder: "/contact" },
];

const titleIntro = (prefix: string, what: string): Field[] => [
  { name: `${prefix}Eyebrow`, label: "Eyebrow", type: "text", half: true, help: `Small label above the ${what} title` },
  { name: `${prefix}Title`, label: "Title", type: "text", half: true },
  { name: `${prefix}Intro`, label: "Intro", type: "textarea", rows: 2 },
];

/* ------------------------------------------------------------------ */
/* Singletons: one-off documents like settings and page copy           */
/* ------------------------------------------------------------------ */

export const SINGLETONS: SingletonDef[] = [
  {
    key: "settings",
    label: "Site settings",
    description: "Company details, brand colour, contact info, social links and SEO.",
    icon: "settings",
    sections: [
      {
        title: "Brand",
        description: "How the company appears across the site.",
        fields: [
          { name: "companyName", label: "Legal company name", type: "text", required: true, half: true },
          { name: "brandName", label: "Short brand name", type: "text", required: true, half: true },
          { name: "tagline", label: "Tagline", type: "text" },
          { name: "accentColor", label: "Accent colour", type: "color", half: true, help: "Brand green by default (#0EA66E)." },
          { name: "logoImage", label: "Custom logo (optional)", type: "image", half: true, help: "Leave empty to use the built-in Solvia wordmark." },
        ],
      },
      {
        title: "Contact",
        fields: [
          { name: "email", label: "Email", type: "email", half: true },
          { name: "phone", label: "Phone", type: "text", half: true },
          { name: "whatsapp", label: "WhatsApp number", type: "text", half: true, help: "With country code, e.g. 919876543210" },
          { name: "hours", label: "Working hours", type: "text", half: true },
          { name: "address", label: "Office address", type: "textarea", rows: 3 },
          { name: "mapLink", label: "Google Maps link", type: "url" },
        ],
      },
      {
        title: "Social links",
        description: "Leave a field empty to hide that icon.",
        fields: [
          { name: "linkedin", label: "LinkedIn", type: "url", half: true },
          { name: "x", label: "X / Twitter", type: "url", half: true },
          { name: "github", label: "GitHub", type: "url", half: true },
          { name: "instagram", label: "Instagram", type: "url", half: true },
          { name: "youtube", label: "YouTube", type: "url", half: true },
          { name: "facebook", label: "Facebook", type: "url", half: true },
        ],
      },
      {
        title: "SEO & sharing",
        fields: [
          { name: "seoTitle", label: "Default page title", type: "text" },
          { name: "seoDescription", label: "Meta description", type: "textarea", rows: 2 },
          { name: "ogImage", label: "Social share image", type: "image", help: "1200×630 recommended." },
        ],
      },
      {
        title: "Announcement bar",
        fields: [
          { name: "announcementEnabled", label: "Show announcement bar", type: "boolean" },
          { name: "announcementText", label: "Text", type: "text", half: true },
          { name: "announcementLink", label: "Link", type: "text", half: true },
        ],
      },
      {
        title: "Footer",
        fields: [
          { name: "footerBlurb", label: "Footer description", type: "textarea", rows: 2 },
          { name: "footerNote", label: "Bottom line", type: "text", help: "Shown next to the copyright." },
        ],
      },
    ],
  },
  {
    key: "home",
    label: "Home page",
    description: "Hero, stats, process, highlights and call to action on the home page.",
    icon: "home",
    publicPath: "/",
    sections: [
      {
        title: "Hero",
        fields: [
          { name: "heroEyebrow", label: "Eyebrow", type: "text" },
          { name: "heroTitle", label: "Headline", type: "text", half: true },
          { name: "heroHighlight", label: "Highlighted word(s)", type: "text", half: true, help: "Shown in brand green after the headline." },
          { name: "heroSubtitle", label: "Sub-headline", type: "textarea", rows: 3 },
          ...cta("heroPrimary", "Primary button"),
          ...cta("heroSecondary", "Secondary button"),
          {
            name: "heroTickets",
            label: "Problem → solved board",
            type: "objects",
            help: "The animated board in the hero. Each row flips from problem to solution.",
            fields: [
              { name: "problem", label: "Problem", type: "text" },
              { name: "solution", label: "Solution", type: "text" },
              { name: "tag", label: "Tag", type: "text", placeholder: "Finance" },
            ],
          },
        ],
      },
      {
        title: "Technology marquee",
        fields: [
          { name: "marqueeTitle", label: "Title", type: "text" },
          { name: "marqueeItems", label: "Items", type: "tags", help: "Press Enter after each item." },
        ],
      },
      {
        title: "Services section",
        fields: [...titleIntro("services", "services")],
      },
      {
        title: "Why Solvia",
        fields: [
          ...titleIntro("why", "why-us"),
          {
            name: "whyItems",
            label: "Reasons",
            type: "objects",
            fields: [
              { name: "icon", label: "Icon", type: "icon" },
              { name: "title", label: "Title", type: "text" },
              { name: "text", label: "Text", type: "textarea", rows: 2 },
            ],
          },
        ],
      },
      {
        title: "Stats band",
        fields: [
          { name: "statsEnabled", label: "Show stats band", type: "boolean" },
          {
            name: "stats",
            label: "Stats",
            type: "objects",
            fields: [
              { name: "value", label: "Value", type: "text", placeholder: "24h" },
              { name: "label", label: "Label", type: "text" },
            ],
          },
        ],
      },
      {
        title: "Process",
        fields: [
          ...titleIntro("process", "process"),
          {
            name: "processSteps",
            label: "Steps",
            type: "objects",
            fields: [
              { name: "title", label: "Title", type: "text" },
              { name: "text", label: "Text", type: "textarea", rows: 2 },
              { name: "duration", label: "Duration", type: "text", placeholder: "Week 1" },
            ],
          },
        ],
      },
      {
        title: "Other sections",
        fields: [
          { name: "workTitle", label: "Featured work title", type: "text", half: true },
          { name: "workIntro", label: "Featured work intro", type: "text", half: true },
          { name: "industriesTitle", label: "Industries title", type: "text", half: true },
          { name: "industriesIntro", label: "Industries intro", type: "text", half: true },
          { name: "testimonialsTitle", label: "Testimonials title", type: "text", half: true },
          { name: "insightsTitle", label: "Insights title", type: "text", half: true },
          { name: "faqTitle", label: "FAQ title", type: "text", half: true },
        ],
      },
      {
        title: "Closing call to action",
        fields: [
          { name: "ctaTitle", label: "Title", type: "text" },
          { name: "ctaText", label: "Text", type: "textarea", rows: 2 },
          ...cta("ctaPrimary", "Button"),
        ],
      },
    ],
  },
  {
    key: "about",
    label: "Company page",
    description: "Story, mission, values and team section on the company page.",
    icon: "building",
    publicPath: "/about",
    sections: [
      {
        title: "Header",
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text", half: true },
          { name: "title", label: "Headline", type: "text", half: true },
          { name: "intro", label: "Intro", type: "textarea", rows: 3 },
        ],
      },
      {
        title: "Mission & vision",
        fields: [
          { name: "mission", label: "Mission", type: "textarea", rows: 3, half: true },
          { name: "vision", label: "Vision", type: "textarea", rows: 3, half: true },
        ],
      },
      {
        title: "Our story",
        fields: [
          { name: "storyTitle", label: "Title", type: "text" },
          { name: "story", label: "Story", type: "markdown", rows: 10 },
        ],
      },
      {
        title: "Values",
        fields: [
          { name: "valuesTitle", label: "Title", type: "text" },
          {
            name: "values",
            label: "Values",
            type: "objects",
            fields: [
              { name: "icon", label: "Icon", type: "icon" },
              { name: "title", label: "Title", type: "text" },
              { name: "text", label: "Text", type: "textarea", rows: 2 },
            ],
          },
        ],
      },
      {
        title: "Team",
        fields: [
          { name: "teamTitle", label: "Title", type: "text", half: true },
          { name: "teamIntro", label: "Intro", type: "text", half: true },
        ],
      },
    ],
  },
  {
    key: "pages",
    label: "Page headers",
    description: "Titles and intros for the Services, Solutions, Work, Insights, Careers and Contact pages.",
    icon: "panels",
    sections: [
      { title: "Services page", fields: titleIntro("services", "Services page") },
      { title: "Solutions page", fields: titleIntro("solutions", "Solutions page") },
      { title: "Work page", fields: titleIntro("work", "Work page") },
      { title: "Insights page", fields: titleIntro("insights", "Insights page") },
      {
        title: "Careers page",
        fields: [
          ...titleIntro("careers", "Careers page"),
          {
            name: "perks",
            label: "Perks",
            type: "objects",
            fields: [
              { name: "icon", label: "Icon", type: "icon" },
              { name: "title", label: "Title", type: "text" },
              { name: "text", label: "Text", type: "text" },
            ],
          },
          { name: "careersEmpty", label: "Text when there are no open roles", type: "textarea", rows: 2 },
        ],
      },
      {
        title: "Contact page",
        fields: [
          ...titleIntro("contact", "Contact page"),
          { name: "contactServices", label: "Service options in the form", type: "tags" },
          { name: "contactBudgets", label: "Budget options in the form", type: "tags" },
          { name: "contactSuccess", label: "Message after sending", type: "textarea", rows: 2 },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Collections: lists of items                                         */
/* ------------------------------------------------------------------ */

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "services",
    label: "Services",
    singular: "Service",
    description: "What Solvia offers. Each service gets its own page.",
    icon: "layers",
    titleField: "title",
    subtitleField: "summary",
    publicPath: "/services",
    sort: "order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", half: true },
      { name: "icon", label: "Icon", type: "icon", half: true },
      { name: "featured", label: "Large tile on the home page", type: "boolean", half: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true },
      { name: "body", label: "Full description", type: "markdown", rows: 10 },
      { name: "capabilities", label: "Capabilities", type: "tags" },
      { name: "technologies", label: "Technologies", type: "tags" },
      {
        name: "deliverables",
        label: "What you get",
        type: "objects",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "text" },
        ],
      },
    ],
  },
  {
    key: "industries",
    label: "Solutions",
    singular: "Industry",
    description: "Industries you solve problems for, shown on the Solutions page.",
    icon: "compass",
    titleField: "title",
    subtitleField: "summary",
    sort: "order",
    fields: [
      { name: "title", label: "Industry", type: "text", required: true, half: true },
      { name: "icon", label: "Icon", type: "icon", half: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 2 },
      { name: "problems", label: "Problems we solve", type: "tags" },
    ],
  },
  {
    key: "work",
    label: "Case studies",
    singular: "Case study",
    description: "Projects told as problem → approach → outcome.",
    icon: "briefcase",
    titleField: "title",
    subtitleField: "client",
    publicPath: "/work",
    sort: "order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", half: true },
      { name: "client", label: "Client", type: "text", half: true },
      { name: "industry", label: "Industry", type: "text", half: true },
      { name: "year", label: "Year", type: "text", half: true },
      { name: "featured", label: "Feature on the home page", type: "boolean", half: true },
      { name: "cover", label: "Cover image", type: "image", half: true },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true },
      { name: "problem", label: "The problem", type: "markdown", rows: 5 },
      { name: "approach", label: "Our approach", type: "markdown", rows: 6 },
      { name: "outcome", label: "The outcome", type: "markdown", rows: 5 },
      {
        name: "metrics",
        label: "Results",
        type: "objects",
        fields: [
          { name: "value", label: "Value", type: "text" },
          { name: "label", label: "Label", type: "text" },
        ],
      },
      { name: "stack", label: "Tech stack", type: "tags" },
    ],
  },
  {
    key: "insights",
    label: "Insights",
    singular: "Article",
    description: "Blog posts and thought leadership.",
    icon: "newspaper",
    titleField: "title",
    subtitleField: "excerpt",
    publicPath: "/insights",
    sort: "date",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", half: true },
      { name: "date", label: "Publish date", type: "date", half: true },
      { name: "author", label: "Author", type: "text", half: true },
      { name: "category", label: "Category", type: "text", half: true },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, required: true },
      { name: "body", label: "Article", type: "markdown", rows: 18, help: "Markdown: ## Heading, **bold**, *italic*, [link](https://…), - list, > quote" },
    ],
  },
  {
    key: "careers",
    label: "Careers",
    singular: "Job opening",
    description: "Open roles shown on the Careers page.",
    icon: "rocket",
    titleField: "title",
    subtitleField: "department",
    publicPath: "/careers",
    sort: "order",
    fields: [
      { name: "title", label: "Role", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", half: true },
      { name: "department", label: "Team", type: "text", half: true },
      { name: "location", label: "Location", type: "text", half: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        half: true,
        options: [
          { value: "Full-time", label: "Full-time" },
          { value: "Part-time", label: "Part-time" },
          { value: "Contract", label: "Contract" },
          { value: "Internship", label: "Internship" },
        ],
      },
      { name: "experience", label: "Experience", type: "text", half: true },
      { name: "applyEmail", label: "Apply email", type: "email", half: true, help: "Defaults to the site email." },
      { name: "summary", label: "Summary", type: "textarea", rows: 2 },
      { name: "body", label: "Description", type: "markdown", rows: 12 },
    ],
  },
  {
    key: "team",
    label: "Team",
    singular: "Team member",
    description: "People shown on the Company page.",
    icon: "users",
    titleField: "name",
    subtitleField: "role",
    sort: "order",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "role", label: "Role", type: "text", half: true },
      { name: "photo", label: "Photo", type: "image" },
      { name: "bio", label: "Short bio", type: "textarea", rows: 3 },
      { name: "linkedin", label: "LinkedIn", type: "url" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Client quotes. The section hides when none are published.",
    icon: "quote",
    titleField: "name",
    subtitleField: "company",
    sort: "order",
    fields: [
      { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true },
      { name: "name", label: "Name", type: "text", half: true },
      { name: "role", label: "Role", type: "text", half: true },
      { name: "company", label: "Company", type: "text", half: true },
      { name: "photo", label: "Photo", type: "image", half: true },
    ],
  },
  {
    key: "faqs",
    label: "FAQs",
    singular: "Question",
    description: "Frequently asked questions on the home page.",
    icon: "help",
    titleField: "question",
    sort: "order",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", rows: 4, required: true },
    ],
  },
];

export const getCollection = (key: string) => COLLECTIONS.find((c) => c.key === key);
export const getSingleton = (key: string) => SINGLETONS.find((s) => s.key === key);

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
