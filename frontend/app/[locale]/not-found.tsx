import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60dvh] max-w-md place-items-center px-5 text-center">
      <div>
        <p className="grad-text font-display text-7xl font-extrabold">404</p>
        <p className="mt-4 text-muted">این صفحه پیدا نشد — This page was not found.</p>
        <Link href="/" className="grad-brand mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white">
          خانه / Home
        </Link>
      </div>
    </div>
  );
}
