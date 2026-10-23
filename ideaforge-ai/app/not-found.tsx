import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060a13] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold gradient-text mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-sm text-slate-400 mb-6">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}
