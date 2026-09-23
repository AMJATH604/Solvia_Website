// The Solvia wordmark: "sol✓ia" — the "v" is the brand checkmark (Concept 1C "Solved").
// Built from live text in Outfit SemiBold so it stays crisp at any size.

type Tone = "dark" | "light" | "mono";

export function Wordmark({
  className = "",
  tone = "dark",
  label = "Solvia",
}: {
  className?: string;
  tone?: Tone;
  label?: string;
}) {
  const text = tone === "light" ? "text-white" : "text-forest";
  const check = tone === "light" ? "var(--mint)" : tone === "mono" ? "currentColor" : "var(--accent)";
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-baseline font-semibold leading-none tracking-[-0.035em] ${text} ${className}`}
    >
      <span aria-hidden="true">sol</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 54 74"
        className="mx-[0.01em] inline-block h-[0.74em] w-[0.54em] self-baseline"
        style={{ verticalAlign: "baseline" }}
      >
        <path
          d="M8 43 L21.5 63.5 L47 10"
          fill="none"
          stroke={check}
          strokeWidth="11.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span aria-hidden="true">ia</span>
    </span>
  );
}

export function Mark({ className = "", rounded = "square" }: { className?: string; rounded?: "square" | "circle" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {rounded === "circle" ? (
        <circle cx="50" cy="50" r="50" fill="var(--accent)" />
      ) : (
        <rect width="100" height="100" rx="26" fill="var(--accent)" />
      )}
      <path
        d="M29 52 L44 67 L72 33"
        fill="none"
        stroke="#fff"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Wordmark, or the custom logo image uploaded in Settings. */
export function Logo({
  logoImage,
  brandName,
  tone = "dark",
  className = "text-[28px]",
}: {
  logoImage?: string;
  brandName?: string;
  tone?: Tone;
  className?: string;
}) {
  if (logoImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoImage} alt={brandName || "Logo"} className="h-8 w-auto" />;
  }
  return <Wordmark tone={tone} className={className} label={brandName || "Solvia"} />;
}
