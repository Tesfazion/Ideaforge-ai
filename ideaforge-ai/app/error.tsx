"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-danger-soft text-danger-ink">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm leading-relaxed text-copy">
          An unexpected error occurred. You can retry, or head back to the home page.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-muted">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-secondary">Go home</Link>
        </div>
      </div>
    </div>
  );
}
