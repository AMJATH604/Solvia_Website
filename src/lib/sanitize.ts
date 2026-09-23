import type { Field } from "./schema";

// Coerces untrusted form data into the shape the schema describes and drops
// anything unknown, so the store only ever holds well-formed content.

const MAX_TEXT = 100_000;

function safeLink(v: string) {
  const s = v.trim();
  if (!s) return "";
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(s) ? s : "";
}

function coerce(field: Field, value: unknown): unknown {
  switch (field.type) {
    case "boolean":
      return value === true || value === "true" || value === "on";
    case "number": {
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    case "tags":
      return Array.isArray(value)
        ? value.map((v) => String(v).trim().slice(0, 200)).filter(Boolean).slice(0, 100)
        : [];
    case "objects":
      return Array.isArray(value)
        ? value
            .filter((v) => v && typeof v === "object")
            .slice(0, 100)
            .map((obj) => sanitizeFields(field.fields || [], obj as Record<string, unknown>))
        : [];
    case "url":
    case "image":
      return safeLink(String(value ?? ""));
    case "color": {
      const s = String(value ?? "").trim();
      return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s) ? s : "";
    }
    case "select": {
      const s = String(value ?? "");
      return field.options?.some((o) => o.value === s) ? s : "";
    }
    case "textarea":
    case "markdown":
      return String(value ?? "").slice(0, MAX_TEXT);
    default: {
      const s = String(value ?? "").trim().slice(0, 2000);
      // Link-like text fields (e.g. "heroPrimaryLink") are rendered as hrefs.
      return /Link$/.test(field.name) ? safeLink(s) : s;
    }
  }
}

export function sanitizeFields(fields: Field[], input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) out[f.name] = coerce(f, input?.[f.name]);
  return out;
}

export function missingRequired(fields: Field[], data: Record<string, unknown>) {
  return fields.filter((f) => f.required && !String(data[f.name] ?? "").trim()).map((f) => f.label);
}
