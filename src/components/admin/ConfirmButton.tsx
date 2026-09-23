"use client";

import { useFormStatus } from "react-dom";

/** A submit button that asks for confirmation first. Put it inside a <form action={serverAction}>. */
export function ConfirmButton({
  children,
  message,
  className,
  title,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      aria-label={title}
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

export function SubmitButton({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} title={title} aria-label={title}>
      {children}
    </button>
  );
}
