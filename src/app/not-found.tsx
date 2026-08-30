import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center space-y-4 px-5 text-center">
      <p className="font-display text-5xl font-extrabold text-accent">404</p>
      <h1 className="font-display text-2xl font-bold text-fg">This page doesn&apos;t exist</h1>
      <p className="text-sm text-fg-soft">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="rounded-[var(--radius-control)] bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover">
        Back to home
      </Link>
    </div>
  );
}
