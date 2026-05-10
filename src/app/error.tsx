"use client";

import Link from "next/link";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-[#FAF8F4]">
      <h1 className="text-7xl font-black text-gray-900 mb-2">Oops!</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Something went wrong. Don&apos;t worry, our burgers are still fresh.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#D46E1F] text-white font-semibold rounded-xl hover:bg-[#C06820] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
