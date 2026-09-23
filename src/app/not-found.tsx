import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="bg-grid mask-fade pointer-events-none absolute inset-0" />
      <Link href="/" className="relative" aria-label="Home">
        <Wordmark className="text-3xl" />
      </Link>
      <p className="relative mt-16 text-sm font-medium tracking-[0.08em] text-brand uppercase">404</p>
      <h1 className="display relative mt-4 text-5xl md:text-7xl">This one isn&apos;t solved yet.</h1>
      <p className="relative mt-5 max-w-md text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="relative mt-10 flex gap-3">
        <Link href="/" className="rounded-full bg-forest px-6 py-3.5 font-medium text-white hover:bg-black">
          Back home
        </Link>
        <Link href="/contact" className="rounded-full px-6 py-3.5 font-medium ring-1 ring-line hover:ring-ink/25">
          Contact us
        </Link>
      </div>
    </main>
  );
}
