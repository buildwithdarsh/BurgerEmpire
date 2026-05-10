import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Browse the Burger Empire menu or head back home.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-[#FAF8F4]">
      <h1 className="text-7xl font-black text-gray-900 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-[#D46E1F] text-white font-semibold rounded-xl hover:bg-[#C06820] transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/menu/burgers"
          className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}
